'use server';

import { Resend } from 'resend';

/**
 * Sends a silent notification email to the owner via Resend.
 *
 * Required env vars in .env.local:
 *   RESEND_API_KEY    — free key from https://resend.com/api-keys
 *   MY_EMAIL_ADDRESS  — the email where you want to receive notifications
 */
async function sendEmailNotification(
  message: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.MY_EMAIL_ADDRESS || 'mohajamedhide@gmail.com';

    if (!apiKey) {
      console.error('[Resend] Missing RESEND_API_KEY env var.');
      return { success: false, error: 'Missing RESEND_API_KEY' };
    }

    const resend = new Resend(apiKey);

    // Convert Telegram-style HTML tags to email-friendly HTML
    // and derive a subject line from the first line of the message
    const lines = message
      .replace(/<b>([\s\S]*?)<\/b>/g, '<strong>$1</strong>')
      .replace(/<i>([\s\S]*?)<\/i>/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>')
      .split('<br/>');

    // Subject = first line stripped of all tags
    const subjectRaw = lines[0].replace(/<[^>]+>/g, '').trim();
    const subject = subjectRaw.length > 80
      ? subjectRaw.slice(0, 77) + '…'
      : subjectRaw;

    const bodyHtml = lines.join('<br/>');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
      </head>
      <body style="margin:0;padding:0;background:#0c0a14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
        <div style="max-width:520px;margin:0 auto;padding:32px 16px;">

          <!-- Header -->
          <div style="text-align:center;margin-bottom:24px;">
            <span style="display:inline-block;background:linear-gradient(135deg,#f43f5e,#ec4899);color:#fff;font-size:20px;font-weight:800;padding:10px 24px;border-radius:999px;letter-spacing:0.5px;">
              💌 Faty's App
            </span>
          </div>

          <!-- Card -->
          <div style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);border-radius:20px;overflow:hidden;">
            <div style="height:3px;background:linear-gradient(to right,#f43f5e,#fb923c);"></div>
            <div style="padding:28px 24px;color:#e2e8f0;font-size:15px;line-height:1.7;">
              ${bodyHtml}
            </div>
          </div>

          <!-- Footer -->
          <p style="text-align:center;color:rgba(255,255,255,0.2);font-size:11px;margin-top:20px;">
            Sent silently from Faty's app &nbsp;·&nbsp; Only you can see this
          </p>
        </div>
      </body>
      </html>
    `;

    const { error } = await resend.emails.send({
      from: "Faty's App <onboarding@resend.dev>",
      to: [toEmail],
      subject,
      html,
    });

    if (error) {
      console.error('[Resend error]:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('[Notify ACTION CRASH]:', err);
    return { success: false, error: String(err) };
  }
}

// Primary export
export { sendEmailNotification };

// Backward-compat alias — all existing imports keep working with zero changes
export const sendTelegramNotification = sendEmailNotification;
