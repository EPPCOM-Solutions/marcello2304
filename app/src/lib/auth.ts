import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { query, initDb } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development_only_12345';

// Helper to hash password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Helper to compare password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Helper to create JWT token
export function signToken(payload: { userId: number; email: string; role: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// Helper to verify JWT token
export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number; email: string; role: string };
  } catch (err) {
    return null;
  }
}

// Seed Superuser if they don't exist
export async function seedSuperUser() {
  await initDb();
  if (process.env.NODE_ENV === 'development' && !process.env.DATABASE_URL) return; // skip for local dev without db
  
  try {
     const res = await query('SELECT id FROM livingmatch_users WHERE email = $1', ['eppler@eppcom.de']);
     if (res.rows.length === 0) {
        // Create superuser
        const generatedPassword = Math.random().toString(36).slice(-8) + '!' + Math.floor(Math.random()*10);
        const hash = await hashPassword(generatedPassword);
        await query(
           'INSERT INTO livingmatch_users (email, password_hash, role) VALUES ($1, $2, $3)', 
           ['eppler@eppcom.de', hash, 'admin']
        );
        console.log(`\n\n=======================================\nSUPERUSER CREATED!\nEmail: eppler@eppcom.de\nInitial Password: ${generatedPassword}\nPlease change this password in the app.\n=======================================\n\n`);
     }
  } catch (err) {
    console.error("Superuser Seed Error:", err);
  }
}
