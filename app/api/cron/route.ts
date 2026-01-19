import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import tls from 'tls';
import net from 'net';
import { URL } from 'url';

export const dynamic = 'force-dynamic';

const DOMAINS = [
  'https://exil.cz',
  'https://summittattoo.cz/',
  'https://greatidea.cz',
  'https://dash-26.vercel.app',
  'https://olkraj.cz',
  'https://www.rodinajeok.cz/',
  'https://www.ok-tourism.cz/',
  'https://ude.ginis.cloud/olkraj/',
];

// 1. Funkce pro SSL (Zámeček)
function getSSLExpiry(targetUrl: string): Promise<Date | null> {
  return new Promise((resolve) => {
    try {
      const urlObj = new URL(targetUrl);
      const options = { 
        host: urlObj.hostname, 
        port: 443, 
        servername: urlObj.hostname, 
        rejectUnauthorized: false, 
        timeout: 3000 
      };
      const socket = tls.connect(options, () => {
        const cert = socket.getPeerCertificate();
        socket.end();
        resolve(cert && cert.valid_to ? new Date(cert.valid_to) : null);
      });
      socket.on('error', (err) => { console.error(`SSL Error ${targetUrl}:`, err); resolve(null); });
      socket.on('timeout', () => { socket.destroy(); resolve(null); });
    } catch (e) { console.error(`SSL Config Error:`, e); resolve(null); }
  });
}

// 2. Funkce pro DOMÉNU (Whois)
function getDomainExpiry(targetUrl: string): Promise<Date | null> {
  return new Promise((resolve) => {
    try {
      // Získáme čistou doménu bez 'www.' (důležité pro WHOIS)
      let hostname = new URL(targetUrl).hostname;
      if (hostname.startsWith('www.')) {
        hostname = hostname.replace('www.', '');
      }

      const parts = hostname.split('.');
      const tld = parts[parts.length - 1]; // Získáme koncovku (cz, com, cloud...)
      
      // Mapování serverů (přidáme základní podporu pro více koncovek)
      let whoisServer = 'whois.verisign-grs.com'; // Default pro .com, .net
      if (tld === 'cz') whoisServer = 'whois.nic.cz';
      if (tld === 'cloud') whoisServer = 'whois.nic.cloud'; // Pro Ginis
      
      const port = 43;

      const socket = net.createConnection(port, whoisServer, () => {
        socket.write(`${hostname}\r\n`);
      });

      let data = '';
      socket.on('data', (chunk) => { data += chunk; });
      
      socket.on('end', () => {
        let match;
        
        // .CZ domény
        if (tld === 'cz') {
            match = data.match(/expire:\s+(\d{2}\.\d{2}\.\d{4})/);
            if (match && match[1]) {
                const p = match[1].split('.');
                resolve(new Date(`${p[2]}-${p[1]}-${p[0]}`));
                return;
            }
        }
        
        // Ostatní mezinárodní (ISO formát YYYY-MM-DD)
        match = data.match(/Registry Expiry Date:\s+(\d{4}-\d{2}-\d{2})/);
        if (match && match[1]) {
            resolve(new Date(match[1]));
            return;
        }

        resolve(null);
      });

      socket.on('error', (err) => { console.error('Whois error:', err); resolve(null); });
      socket.setTimeout(5000, () => { socket.destroy(); resolve(null); });

    } catch (error) { console.error(error); resolve(null); }
  });
}

export async function GET() {
  const results = [];

  for (const url of DOMAINS) {
    const start = Date.now();
    let status = 'offline';
    let code = 0;
    let latency = 0;
    let certExpiry = null;
    let domainExpiry = null;

    // A. Měření odezvy (s User-Agentem pro oklamání firewallu)
    try {
      const res = await fetch(url, { 
        method: 'GET', 
        cache: 'no-store',
        headers: {
            // Tváříme se jako Chrome na Windows, aby nás Olkraj.cz nezablokoval
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      code = res.status;
      latency = Date.now() - start;
      status = (res.ok || res.status < 400) ? 'online' : 'offline';
    } catch (error) {
      console.error(`Fetch error ${url}:`, error);
      code = 503;
      status = 'offline';
    }

    // B. Získání dat
    if (status === 'online') {
      const [sslDate, domDate] = await Promise.all([
        getSSLExpiry(url),
        getDomainExpiry(url)
      ]);
      certExpiry = sslDate;
      domainExpiry = domDate;
    }

    results.push({ url, status, latency, code, certExpiry, domainExpiry });
  }

  // C. Uložení
  try {
    for (const r of results) {
      const sslIso = r.certExpiry ? r.certExpiry.toISOString() : null;
      const domIso = r.domainExpiry ? r.domainExpiry.toISOString() : null;

      await sql`
        INSERT INTO uptime_logs (url, status, latency, code, cert_expiry, domain_expiry)
        VALUES (${r.url}, ${r.status}, ${r.latency}, ${r.code}, ${sslIso}, ${domIso});
      `;
    }
    return NextResponse.json({ message: 'Hotovo', saved: results.length, data: results });
  } catch (error) {
    return NextResponse.json({ error: 'Chyba DB', details: error }, { status: 500 });
  }
}