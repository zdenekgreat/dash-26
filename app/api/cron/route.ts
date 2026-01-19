import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import tls from 'tls';
import { URL } from 'url';

export const dynamic = 'force-dynamic';

const DOMAINS = [
  'https://olkraj.cz',
  'https://portal.olkraj.cz',
  'https://google.com',
];

// Pomocná funkce pro získání expirace certifikátu
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
        if (cert && cert.valid_to) {
          resolve(new Date(cert.valid_to));
        } else {
          resolve(null);
        }
      });

      socket.on('error', (err) => { // Změna: Použijeme 'err'
        console.error(`SSL Error u ${targetUrl}:`, err);
        resolve(null);
      });
      
      socket.on('timeout', () => { 
        socket.destroy(); 
        resolve(null); 
      });

    } catch (e) {
      console.error(`SSL Config Error:`, e); // Změna: Vypíšeme chybu 'e'
      resolve(null);
    }
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

    // 1. Změření dostupnosti (Ping)
    try {
      const res = await fetch(url, { method: 'GET', cache: 'no-store' });
      code = res.status;
      latency = Date.now() - start;
      status = (res.ok || res.status < 400) ? 'online' : 'offline';
    } catch (error) {
      // Změna: Vypíšeme chybu 'error'
      console.error(`Fetch Error u ${url}:`, error);
      code = 503;
      status = 'offline';
    }

    // 2. Získání expirace certifikátu (pouze pokud je web online)
    if (status === 'online') {
      certExpiry = await getSSLExpiry(url);
    }

    results.push({ url, status, latency, code, certExpiry });
  }

  // 3. Uložení do databáze
  try {
    for (const r of results) {
      const expiryDate = r.certExpiry ? r.certExpiry.toISOString() : null;

      await sql`
        INSERT INTO uptime_logs (url, status, latency, code, cert_expiry)
        VALUES (${r.url}, ${r.status}, ${r.latency}, ${r.code}, ${expiryDate});
      `;
    }
    return NextResponse.json({ message: 'Hotovo', saved: results.length, data: results });
  } catch (error) {
    return NextResponse.json({ error: 'Chyba DB', details: error }, { status: 500 });
  }
}