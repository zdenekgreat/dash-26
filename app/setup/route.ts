import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await sql`SELECT version();`;
    
    // Vytvoření tabulky
    await sql`
      CREATE TABLE IF NOT EXISTS uptime_logs (
        id SERIAL PRIMARY KEY,
        url VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL,
        latency INT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    return NextResponse.json({ 
      status: 'success', 
      message: 'Databáze je připojená a tabulka vytvořena!', 
      version: result.rows[0].version 
    });
  } catch (error) {
    return NextResponse.json({ 
      status: 'error', 
      message: 'Chyba připojení', 
      error: error 
    }, { status: 500 });
  }
}