import { Pool } from 'pg';

// Initialize connection pool
// It will use process.env.DATABASE_URL automatically if passed, 
// usually shaped like postgres://user:password@host:port/database
let pool: Pool | null = null;

if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Add SSL for remote connections if needed, usually required by managed DBs
    // ssl: { rejectUnauthorized: false }
  });
}

// Helper to query the DB
export async function query(text: string, params?: any[]) {
  if (!pool) {
    if (process.env.NODE_ENV === 'development') {
       console.log('No DATABASE_URL provided. Mocking DB query.');
       return { rows: [] };
    }
    throw new Error("Datenbank nicht verfügbar. DATABASE_URL fehlt.");
  }
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

// Run initial migration
export async function initDb() {
  if (!pool) return;
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS livingmatch_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("DB Init Check: users table verified");
  } catch (err) {
    console.error("DB Init Error:", err);
  }
}
