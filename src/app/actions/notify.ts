'use server';

export async function sendTelegramNotification(message: string): Promise<{ success: boolean; error?: string }> {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.error('[Telegram] Missing BOT_TOKEN or CHAT_ID env vars.');
      return { success: false, error: 'Missing env vars' };
    }

    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
        }),
        signal: AbortSignal.timeout(5000),
      }
    );

    // سحب البيانات من تليجرام لمعرفة سبب الرفض
    const data: unknown = await response.json();

    if (!response.ok) {
      const errStr = typeof data === 'object' ? JSON.stringify(data) : String(data);
      console.error('[Telegram API ERROR]:', errStr);
      return { success: false, error: errStr };
    }

    return { success: true };
  } catch (error) {
    console.error('[SERVER ACTION CRASH]:', error);
    return { success: false, error: String(error) };
  }
}