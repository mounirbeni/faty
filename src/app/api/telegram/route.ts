import { NextRequest, NextResponse } from 'next/server';
import { pushToHer } from '@/lib/server/push';
import { telegramReply, webhookSecret } from '@/lib/server/telegram';

// Telegram webhook: every text he sends to the bot becomes a notification on her phone
export async function POST(req: NextRequest) {
  if (req.headers.get('x-telegram-bot-api-secret-token') !== webhookSecret()) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  try {
    const update = await req.json();
    const msg = update?.message;
    const text: string | undefined = msg?.text;
    if (!msg || String(msg.chat?.id) !== process.env.TELEGRAM_CHAT_ID || !text) {
      return NextResponse.json({ ok: true });
    }
    if (text.startsWith('/start') || text.startsWith('/help')) {
      await telegramReply('💌 Send me any message and it will appear as a notification on her phone.');
      return NextResponse.json({ ok: true });
    }
    const sent = await pushToHer({ title: '💌 From him', body: text.slice(0, 300) });
    await telegramReply(sent > 0
      ? '✅ Sent to her phone 💗'
      : '⚠️ Not delivered — she hasn’t turned on notifications in the app yet.');
  } catch (err) {
    console.error('[telegram webhook]', err);
    await telegramReply('⚠️ Couldn’t send that notification. Check the Vercel logs.');
  }
  return NextResponse.json({ ok: true });
}
