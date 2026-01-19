import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import tls from 'tls';
import net from 'net';
import { URL } from 'url';

export const dynamic = 'force-dynamic';

// --- ZDE SI UPRAVTE SVÉ DOMÉNY ---
const DOMAINS = [
  { name: 'EXIL', url: 'https://exil.cz' },
  { name: 'Summit Tattoo', url: 'https://summittattoo.cz/' },
  { name: 'Great Idea', url: 'https://greatidea.cz/' },
  { name: 'Sentinel Dashboard', url: 'https://shaka.cz/' },
  { name: 'Olomoucký kraj', url: 'https://www.olkraj.cz/' },
  { name: 'Rodina je OK', url: 'https://www.rodinajeok.cz/' },
  { name: 'OK Tourism', url: 'https://www.ok-tourism.cz/' },
  { name: 'GINIS Cloud', url: 'https://ude.ginis.cloud/olkraj/' },
];

function getSSLExpiry(targetUrl: string): Promise<Date | null> {
  return new Promise((resolve) => {
    try {
      const urlObj = new URL(targetUrl);
      const options = { host: urlObj.hostname, port: 443, servername: urlObj.hostname, rejectUnauthorized: false, timeout: 3000 };
      const socket = tls.connect(options, () => {
        const cert = socket.getPeerCertificate();
        socket.end();
        resolve(cert && cert.valid_to ? new Date(cert.valid_to) : null);
      });
      socket.on('error', () => resolve(null));
      socket.on('timeout', () => { socket.destroy(); resolve(null); });
    } catch (e) { console.error(e); resolve(null); }
  });
}

function getDomainExpiry(targetUrl: string): Promise<Date | null> {
  return new Promise((resolve) => {
    try {
      let hostname = new URL(targetUrl).hostname;
      if (hostname.startsWith('www.')) hostname = hostname.replace('www.', '');
      const tld = hostname.split('.').pop();
      let whoisServer = 'whois.verisign-grs.com';
      if (tld === 'cz') whoisServer = 'whois.nic.cz';
      if (tld === 'cloud') whoisServer = 'whois.nic.cloud';
      
      const socket = net.createConnection(43, whoisServer, () => { socket.write(`${hostname}\r\n`); });
      let data = '';
      socket.on('data', (chunk) => { data += chunk; });
      socket.on('end', () => {
        let match;
        if (tld === 'cz') {
          match = data.match(/expire:\s+(\d{2}\.\d{2}\.\d{4})/);
          if (match && match[1]) {
            const p = match[1].split('.');
            resolve(new Date(`${p[2]}-${p[1]}-${p[0]}`));
            return;
          }
        }
        match = data.match(/Registry Expiry Date:\s+(\d{4}-\d{2}-\d{2})/);
        if (match && match[1]) { resolve(new Date(match[1])); return; }
        resolve(null);
      });
      socket.on('error', () => resolve(null));
      socket.setTimeout(5000, () => { socket.destroy(); resolve(null); });
    } catch (error) { console.error(error); resolve(null); }
  });
}

export async function GET() {
  const results = [];
  for (const domain of DOMAINS) {
    const { name, url } = domain;
    const start = Date.now();
    let status = 'offline', code = 0, latency = 0, certExpiry = null, domainExpiry = null;

    try {
      const res = await fetch(url, { 
        method: 'GET', cache: 'no-store',
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36' }
      });
      code = res.status;
      latency = Date.now() - start;
      status = (res.ok || res.status < 400) ? 'online' : 'offline';
    } catch (e) { console.error(e); status = 'offline'; code = 503; }

    if (status === 'online') {
      const [ssl, dom] = await Promise.all([getSSLExpiry(url), getDomainExpiry(url)]);
      certExpiry = ssl; domainExpiry = dom;
    }
    results.push({ name, url, status, latency, code, certExpiry, domainExpiry });
  }

  try {
    for (const r of results) {
      await sql`
        INSERT INTO uptime_logs (name, url, status, latency, code, cert_expiry, domain_expiry)
        VALUES (${r.name}, ${r.url}, ${r.status}, ${r.latency}, ${r.code}, ${r.certExpiry?.toISOString() || null}, ${r.domainExpiry?.toISOString() || null});
      `;
    }
    return NextResponse.json({ message: "Hotovo", count: results.length });
  } catch (error) { console.error(error); return NextResponse.json({ error: "DB Error" }, { status: 500 }); }
}