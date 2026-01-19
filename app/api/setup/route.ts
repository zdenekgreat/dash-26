import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Nejdřív smažeme starou, rozbitou tabulku
    await sql`DROP TABLE IF EXISTS uptime_logs;`;

    // 2. Vytvoříme ji znovu a správně (i se sloupcem 'code')
    await sql`
      CREATE TABLE uptime_logs (
        id SERIAL PRIMARY KEY,
        url VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL,
        latency INTEGER,
        code INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    return NextResponse.json({ message: "Stará tabulka smazána, nová vytvořena! Můžete pokračovat." });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}