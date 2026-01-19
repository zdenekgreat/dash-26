import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic'; // Aby se data načítala vždy čerstvá

export async function GET() {
  try {
    // Tento SQL dotaz vytáhne POSLEDNÍ známý stav pro každou doménu
    // (Seřadí podle URL a času, a vezme jen ten nejnovější záznam)
    const { rows } = await sql`
      SELECT DISTINCT ON (url) url, status, latency, code, created_at
      FROM uptime_logs
      ORDER BY url, created_at DESC;
    `;

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Chyba DB:', error);
    // Pokud tabulka ještě neexistuje, vrátíme prázdné pole, aby aplikace nespadla
    return NextResponse.json([]); 
  }
}