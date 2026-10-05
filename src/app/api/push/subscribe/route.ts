import { NextRequest, NextResponse } from 'next/server';
import type { PushSubscription } from 'web-push';
import { addSubscription } from '@/lib/server/push';

export async function POST(req: NextRequest) {
  try {
    const { subscription } = (await req.json()) as { subscription: PushSubscription };
    if (!subscription?.endpoint || !subscription.keys?.p256dh || !subscription.keys?.auth) {
      return NextResponse.json({ success: false, error: 'Invalid subscription' }, { status: 400 });
    }
    await addSubscription(subscription);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[push subscribe]', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
