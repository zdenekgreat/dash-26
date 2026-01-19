import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

// SEM SI DOPLŇTE SVÝCH 10 DOMÉN
const DOMAINS = [
  'https://exil.cz/',
  'https://summittattoo.cz/',
  'https://shaka.cz/',
  // 'https://vasedomena.cz',
];

export async function GET() {
  console.log('Spouštím kontrolu domén...');
  
  const results = await Promise.all(DOMAINS.map(async (url) => {
    const start = Date.now();
    let status = 'online';
    let code = 200;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const res = await fetch(url, { method: 'HEAD', signal: controller.signal });
      clearTimeout(timeoutId);
      
      code = res.status;
      if (!res.ok) status = 'error';
      
    // ZMĚNA 1: Smazáno (_error), stačí jen catch
    } catch {
      status = 'offline';
      code = 0;
    }

    const latency = Date.now() - start;
    return { url, status, latency, code };
  }));

  // Uložení do databáze
  try {
    for (const r of results) {
      await sql`
        INSERT INTO uptime_logs (url, status, latency)
        VALUES (${r.url}, ${r.status}, ${r.latency});
      `;
    }
    
    return NextResponse.json({ message: 'Hotovo', saved: results.length, data: results });
    
  // ZMĚNA 2: Smazáno (_error), stačí jen catch
  } catch {
    return NextResponse.json({ error: 'Chyba při ukládání' }, { status: 500 });
  }
}