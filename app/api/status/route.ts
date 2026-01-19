import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { rows } = await sql`
      SELECT 
        name,
        url,
        (SELECT status FROM uptime_logs u2 WHERE u2.url = u1.url ORDER BY created_at DESC LIMIT 1) as status,
        (SELECT latency FROM uptime_logs u2 WHERE u2.url = u1.url ORDER BY created_at DESC LIMIT 1) as latency,
        (SELECT cert_expiry FROM uptime_logs u2 WHERE u2.url = u1.url ORDER BY created_at DESC LIMIT 1) as cert_expiry,
        (SELECT domain_expiry FROM uptime_logs u2 WHERE u2.url = u1.url ORDER BY created_at DESC LIMIT 1) as domain_expiry,
        ROUND((COUNT(CASE WHEN status = 'online' THEN 1 END)::numeric / COUNT(*)::numeric) * 100, 1) as uptime_percent
      FROM uptime_logs u1
      GROUP BY name, url;
    `;
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json([]);
  }
}