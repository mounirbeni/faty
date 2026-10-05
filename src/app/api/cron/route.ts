import { NextRequest, NextResponse } from 'next/server';
import { kvGet } from '@/lib/server/store';
import { pushToHer } from '@/lib/server/push';
import { cycleInfo, type CycleData } from '@/lib/cycle';
import { COMFORT_NOTES } from '@/data/haven';

// Runs once a day (vercel.json): a love note + a gentle heads-up before her period
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  try {
    const sent: string[] = [];
    const cycle = await kvGet<CycleData>('cycle');
    const info = cycle ? cycleInfo(cycle) : null;

    if (info && info.daysUntilNext === 2) {
      await pushToHer({ title: '🌙 Soft days are coming', body: 'Your period may start in about 2 days. Keep your hot-water bottle and chocolate close, my love 🤍' });
      sent.push('heads-up');
    } else if (info && info.daysUntilNext === 0) {
      await pushToHer({ title: '🌸 Be gentle with yourself today', body: 'Your period may start today. Rest, warm tea, and remember I’m with you 💗' });
      sent.push('today');
    }

    const day = Math.floor(Date.now() / 86_400_000);
    await pushToHer({ title: '💌 A little note from me', body: COMFORT_NOTES[day % COMFORT_NOTES.length] });
    sent.push('love-note');

    return NextResponse.json({ ok: true, sent });
  } catch (err) {
    console.error('[cron]', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
