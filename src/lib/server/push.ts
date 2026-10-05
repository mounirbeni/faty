import webpush, { type PushSubscription } from 'web-push';
import { kvGet, kvSet } from './store';

const SUBS_KEY = 'push_subs';

function configure() {
  const pub = process.env.VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  if (!pub || !priv) throw new Error('Missing VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY');
  webpush.setVapidDetails('https://frommbn.vercel.app', pub, priv);
}

export async function addSubscription(sub: PushSubscription) {
  const subs = (await kvGet<PushSubscription[]>(SUBS_KEY)) ?? [];
  const next = [...subs.filter(s => s.endpoint !== sub.endpoint), sub].slice(-5);
  await kvSet(SUBS_KEY, next);
}

/** Push to every saved device of hers. Returns how many devices received it. */
export async function pushToHer(payload: { title: string; body: string; url?: string }): Promise<number> {
  configure();
  const subs = (await kvGet<PushSubscription[]>(SUBS_KEY)) ?? [];
  const alive: PushSubscription[] = [];
  let sent = 0;
  for (const s of subs) {
    try {
      await webpush.sendNotification(s, JSON.stringify(payload));
      alive.push(s);
      sent++;
    } catch (e) {
      const code = (e as { statusCode?: number }).statusCode;
      if (code !== 404 && code !== 410) alive.push(s); // drop only expired subscriptions
      console.error('[push]', code, e);
    }
  }
  if (alive.length !== subs.length) await kvSet(SUBS_KEY, alive);
  return sent;
}
