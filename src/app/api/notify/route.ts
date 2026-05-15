import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  try {
    const { message } = (await req.json()) as { message: string };

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.MY_EMAIL_ADDRESS || 'mohajamedhide@gmail.com';

    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'Missing RESEND_API_KEY' }, { status: 500 });
    }

    const resend = new Resend(apiKey);

    const lines = message
      .replace(/<b>([\s\S]*?)<\/b>/g, '<strong>$1</strong>')
      .replace(/<i>([\s\S]*?)<\/i>/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');

    const subjectRaw = lines.split('<br/>')[0].replace(/<[^>]+>/g, '').trim();
    const subject = subjectRaw.length > 80 ? subjectRaw.slice(0, 77) + '…' : subjectRaw;

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#0c0a14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:520px;margin:0 auto;padding:32px 16px;">
    <div style="text-align:center;margin-bottom:24px;">
      <span style="display:inline-block;background:linear-gradient(135deg,#f43f5e,#ec4899);color:#fff;font-size:18px;font-weight:800;padding:8px 20px;border-radius:999px;">
        Faty's App
      </span>
    </div>
    <div style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);border-radius:20px;overflow:hidden;">
      <div style="height:3px;background:linear-gradient(to right,#f43f5e,#fb923c);"></div>
      <div style="padding:24px;color:#e2e8f0;font-size:15px;line-height:1.7;">${lines}</div>
    </div>
    <p style="text-align:center;color:rgba(255,255,255,0.2);font-size:11px;margin-top:16px;">
      Sent silently · Only you see this
    </p>
  </div>
</body></html>`;

    const { error } = await resend.emails.send({
      from: "Faty's App <onboarding@resend.dev>",
      to: [toEmail],
      subject,
      html,
    });

    if (error) {
      console.error('[Notify API error]:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Notify API crash]:', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
