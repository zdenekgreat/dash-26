import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Získáme hlavní seznam domén SEŘAZENÝ ABECEDNĚ
    const { rows: domains } = await sql`
      SELECT 
        name,
        url,
        (SELECT status FROM uptime_logs u2 WHERE u2.url = u1.url ORDER BY created_at DESC LIMIT 1) as status,
        (SELECT latency FROM uptime_logs u2 WHERE u2.url = u1.url ORDER BY created_at DESC LIMIT 1) as latency,
        (SELECT cert_expiry FROM uptime_logs u2 WHERE u2.url = u1.url ORDER BY created_at DESC LIMIT 1) as cert_expiry,
        (SELECT domain_expiry FROM uptime_logs u2 WHERE u2.url = u1.url ORDER BY created_at DESC LIMIT 1) as domain_expiry,
        ROUND((COUNT(CASE WHEN status = 'online' THEN 1 END)::numeric / COUNT(*)::numeric) * 100, 1) as uptime_percent
      FROM uptime_logs u1
      GROUP BY name, url
      ORDER BY name ASC;
    `;

    // 2. Najdeme nejbližší expiraci SSL
    const { rows: nearSSL } = await sql`
      SELECT name, cert_expiry 
      FROM uptime_logs 
      WHERE cert_expiry IS NOT NULL AND cert_expiry > NOW()
      ORDER BY cert_expiry ASC LIMIT 1;
    `;

    // 3. Najdeme nejbližší expiraci Domény
    const { rows: nearDom } = await sql`
      SELECT name, domain_expiry 
      FROM uptime_logs 
      WHERE domain_expiry IS NOT NULL AND domain_expiry > NOW()
      ORDER BY domain_expiry ASC LIMIT 1;
    `;

    // VRACÍME OBJEKT, KTERÝ FRONTEND OČEKÁVÁ
    return NextResponse.json({
      domains: domains || [],
      nearestSSL: nearSSL[0] || null,
      nearestDomain: nearDom[0] || null
    });

  } catch (error) {
    console.error("API Status Error:", error);
    return NextResponse.json({ 
      domains: [], 
      nearestSSL: null, 
      nearestDomain: null 
    }, { status: 500 });
  }
}