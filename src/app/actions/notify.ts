'use server';

export async function sendTelegramNotification(message: string): Promise<{ success: boolean }> {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.warn('[Telegram] Missing BOT_TOKEN or CHAT_ID env vars.');
      return { success: false };
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
        // Never wait more than 5s — fail silently
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!response.ok) {
      console.warn('[Telegram] Non-OK response:', response.status);
      return { success: false };
    }

    return { success: true };
  } catch {
    // Completely silent — no error propagated to client
    return { success: false };
  }
}
