import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await sql`DROP TABLE IF EXISTS uptime_logs;`;

    await sql`
      CREATE TABLE uptime_logs (
        id SERIAL PRIMARY KEY,
        url VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL,
        latency INTEGER,
        code INTEGER,
        cert_expiry TIMESTAMP,    -- Expirace SSL (Zámeček)
        domain_expiry TIMESTAMP,  -- NOVÉ: Expirace Domény (Vlastnictví)
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    return NextResponse.json({ message: "Tabulka připravena pro domény! 🎉" });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}