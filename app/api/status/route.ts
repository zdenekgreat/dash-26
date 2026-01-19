import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Tento dotaz udělá dvě věci:
    // 1. Získá POSLEDNÍ stav (pro semafor)
    // 2. Spočítá PROCENTO úspěšnosti ze všech záznamů (pro SLA)
    const { rows } = await sql`
      SELECT 
        url,
        (SELECT status FROM uptime_logs u2 WHERE u2.url = u1.url ORDER BY created_at DESC LIMIT 1) as status,
        (SELECT latency FROM uptime_logs u2 WHERE u2.url = u1.url ORDER BY created_at DESC LIMIT 1) as latency,
        (SELECT code FROM uptime_logs u2 WHERE u2.url = u1.url ORDER BY created_at DESC LIMIT 1) as code,
        ROUND(
          (COUNT(CASE WHEN status = 'online' THEN 1 END)::numeric / COUNT(*)::numeric) * 100, 
          1
        ) as uptime_percent
      FROM uptime_logs u1
      GROUP BY url;
    `;

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Chyba DB:', error);
    return NextResponse.json([]); 
  }
}