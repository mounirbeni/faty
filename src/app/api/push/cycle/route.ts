import { NextRequest, NextResponse } from 'next/server';
import { kvSet } from '@/lib/server/store';

// Keeps a server copy of her period start dates so daily reminders can be sent
export async function POST(req: NextRequest) {
  try {
    const { starts } = (await req.json()) as { starts: unknown };
    if (!Array.isArray(starts) || !starts.every(s => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s))) {
      return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 });
    }
    await kvSet('cycle', { starts: starts.slice(-12), pain: {} });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[push cycle]', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
