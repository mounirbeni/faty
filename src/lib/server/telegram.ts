import { createHash } from 'crypto';

/** Secret Telegram must echo on every webhook call (derived from the bot token). */
export function webhookSecret(): string {
  return createHash('sha256').update(process.env.TELEGRAM_BOT_TOKEN ?? '').digest('hex').slice(0, 32);
}

export async function telegramReply(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  });
}
