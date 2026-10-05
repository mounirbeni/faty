import { neon } from '@neondatabase/serverless';

// Tiny key/value store on Neon (table: kv(key text pk, value jsonb, updated_at))
function sql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('Missing DATABASE_URL');
  return neon(url);
}

export async function kvGet<T>(key: string): Promise<T | null> {
  const rows = await sql()`SELECT value FROM kv WHERE key = ${key}`;
  return rows.length ? (rows[0].value as T) : null;
}

export async function kvSet(key: string, value: unknown): Promise<void> {
  await sql()`
    INSERT INTO kv (key, value, updated_at) VALUES (${key}, ${JSON.stringify(value)}::jsonb, now())
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`;
}
