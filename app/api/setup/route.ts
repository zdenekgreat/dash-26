import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    // Vytvoření tabulky pro logy (pokud neexistuje)
    await sql`
      CREATE TABLE IF NOT EXISTS uptime_logs (
        id SERIAL PRIMARY KEY,
        url VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL,
        latency INTEGER,
        code INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    return NextResponse.json({ message: "Tabulka 'uptime_logs' byla úspěšně vytvořena! 🎉" });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}