'use client';

import { useEffect, useState } from 'react';
import { softTap, successVibe } from '@/lib/useHaptics';
import { notifyOwner } from '@/lib/notify';

type State = 'hidden' | 'off' | 'ios-install' | 'blocked' | 'working' | 'on' | 'error';

function urlBase64ToUint8Array(base64: string) {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(raw, c => c.charCodeAt(0));
}

async function subscribe(): Promise<void> {
  const { publicKey } = await (await fetch('/api/push/key')).json();
  if (!publicKey) throw new Error('Push is not configured');
  const reg = await navigator.serviceWorker.ready;
  const sub = (await reg.pushManager.getSubscription())
    ?? await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(publicKey) });
  const res = await fetch('/api/push/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subscription: sub.toJSON() }),
  });
  if (!res.ok) throw new Error('Could not save subscription');
}

/** "Turn on notifications" card — lets him reach her phone even when the app is closed. */
export default function NotifyToggle() {
  const [state, setState] = useState<State>('hidden');

  useEffect(() => {
    const t = setTimeout(async () => {
      const ua = navigator.userAgent;
      const ios = /iphone|ipad|ipod/i.test(ua) || (ua.includes('Mac') && 'ontouchend' in document);
      const standalone = window.matchMedia('(display-mode: standalone)').matches
        || (navigator as Navigator & { standalone?: boolean }).standalone === true;
      if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
        setState(ios && !standalone ? 'ios-install' : 'hidden');
        return;
      }
      if (Notification.permission === 'denied') { setState('blocked'); return; }
      if (Notification.permission === 'granted') {
        // Keep the server copy fresh (subscriptions can rotate)
        try { await subscribe(); setState('hidden'); } catch { setState('off'); }
        return;
      }
      setState('off');
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const turnOn = async () => {
    softTap();
    setState('working');
    try {
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') { setState(perm === 'denied' ? 'blocked' : 'off'); return; }
      await subscribe();
      successVibe();
      setState('on');
      notifyOwner('🔔 <b>She turned on notifications</b>\n\nAnything you send to this bot now appears on her phone 💌');
    } catch (e) {
      console.error('[push]', e);
      setState('error');
    }
  };

  if (state === 'hidden') return null;

  const text: Record<Exclude<State, 'hidden'>, [string, string]> = {
    off:           ['Let me reach you 🔔', 'Turn on notifications for little messages from me'],
    working:       ['One second…', 'Allow notifications when your phone asks'],
    on:            ['Notifications are on 💗', 'You’ll hear from me, even when the app is closed'],
    'ios-install': ['Want my messages? 🔔', 'First add this to your home screen (card above), then open it from there'],
    blocked:       ['Notifications are blocked', 'Allow them in your phone settings for this app'],
    error:         ['Something went wrong', 'Tap to try again'],
  };
  const [title, sub] = text[state];
  const tappable = state === 'off' || state === 'error';

  return (
    <button onClick={tappable ? turnOn : undefined} disabled={!tappable}
      className="w-full flex items-center gap-3.5 p-4 rounded-[22px] text-left"
      style={{ background: 'linear-gradient(135deg, rgba(205,180,255,0.2), rgba(255,157,180,0.16))', border: '1px solid rgba(205,180,255,0.35)' }}>
      <span className="w-12 h-12 rounded-2xl flex items-center justify-center text-[22px] shrink-0" style={{ background: 'rgba(255,255,255,0.12)' }}>
        {state === 'on' ? '✅' : '🔔'}
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-[15px] font-black" style={{ color: '#FFF3EA' }}>{title}</span>
        <span className="block text-[12px] mt-0.5" style={{ color: 'rgba(255,238,228,0.6)' }}>{sub}</span>
      </span>
      {tappable && <span className="px-3 py-2 rounded-xl text-[12px] font-black shrink-0" style={{ background: '#FFF3EA', color: '#4A1D3A' }}>Turn on</span>}
    </button>
  );
}
