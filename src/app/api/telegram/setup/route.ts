import { NextRequest, NextResponse } from 'next/server';
import { webhookSecret } from '@/lib/server/telegram';

// Open once in a browser to connect the Telegram bot to /api/telegram
export async function GET(req: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return NextResponse.json({ ok: false, error: 'Missing TELEGRAM_BOT_TOKEN' }, { status: 500 });
  const url = `${req.nextUrl.origin}/api/telegram`;
  const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, secret_token: webhookSecret(), allowed_updates: ['message'] }),
  });
  const data = await res.json();
  return NextResponse.json({ ok: data.ok, webhook: url, telegram: data.description });
}
