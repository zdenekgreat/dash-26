import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Smažeme starou tabulku a vytvoříme novou s polem 'name'
    await sql`DROP TABLE IF EXISTS uptime_logs;`;

    await sql`
      CREATE TABLE uptime_logs (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        url VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL,
        latency INTEGER,
        code INTEGER,
        cert_expiry TIMESTAMP,
        domain_expiry TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    return NextResponse.json({ message: "Tabulka s názvy úspěšně vytvořena! 🚀" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Chyba při setupu" }, { status: 500 });
  }
}