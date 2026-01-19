import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { rows } = await sql`
      SELECT 
        url,
        (SELECT status FROM uptime_logs u2 WHERE u2.url = u1.url ORDER BY created_at DESC LIMIT 1) as status,
        (SELECT latency FROM uptime_logs u2 WHERE u2.url = u1.url ORDER BY created_at DESC LIMIT 1) as latency,
        (SELECT code FROM uptime_logs u2 WHERE u2.url = u1.url ORDER BY created_at DESC LIMIT 1) as code,
        (SELECT cert_expiry FROM uptime_logs u2 WHERE u2.url = u1.url ORDER BY created_at DESC LIMIT 1) as cert_expiry,
        ROUND((COUNT(CASE WHEN status = 'online' THEN 1 END)::numeric / COUNT(*)::numeric) * 100, 1) as uptime_percent
      FROM uptime_logs u1
      GROUP BY url;
    `;
    return NextResponse.json(rows);
  } catch (error) {
    // ZMĚNA: Vypíšeme chybu do konzole, aby proměnná 'error' nezůstala nevyužitá
    console.error("Chyba při načítání statusu:", error);
    return NextResponse.json([]); 
  }
}