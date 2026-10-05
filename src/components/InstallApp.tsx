'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { softTap } from '@/lib/useHaptics';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches
    || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

/** "Install as an app" card — hidden once the site runs as an installed app. */
export default function InstallApp() {
  const [visible, setVisible] = useState(false);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;
    const ua = navigator.userAgent;
    const t = setTimeout(() => {
      setIsIOS(/iphone|ipad|ipod/i.test(ua) || (ua.includes('Mac') && 'ontouchend' in document));
      setVisible(true);
    }, 0);
    const onPrompt = (e: Event) => { e.preventDefault(); setDeferred(e as BeforeInstallPromptEvent); };
    const onInstalled = () => setVisible(false);
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      clearTimeout(t);
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (!visible) return null;

  const install = async () => {
    softTap();
    if (deferred) {
      await deferred.prompt();
      const { outcome } = await deferred.userChoice;
      if (outcome === 'accepted') setVisible(false);
      setDeferred(null);
    } else {
      setShowHelp(h => !h);
    }
  };

  return (
    <div className="rounded-[22px] p-4"
      style={{ background: 'linear-gradient(135deg, rgba(255,201,168,0.18), rgba(255,157,180,0.16))', border: '1px solid rgba(255,201,168,0.35)' }}>
      <button onClick={install} className="w-full flex items-center gap-3.5 text-left">
        <span className="w-12 h-12 rounded-2xl flex items-center justify-center text-[22px] shrink-0" style={{ background: 'rgba(255,255,255,0.12)' }}>📲</span>
        <span className="flex-1 min-w-0">
          <span className="block text-[15px] font-black" style={{ color: '#FFF3EA' }}>Put me on your home screen</span>
          <span className="block text-[12px] mt-0.5" style={{ color: 'rgba(255,238,228,0.6)' }}>Open your Haven like an app, in one tap 🤍</span>
        </span>
        <span className="px-3 py-2 rounded-xl text-[12px] font-black shrink-0" style={{ background: '#FFF3EA', color: '#4A1D3A' }}>Install</span>
      </button>

      <AnimatePresence>
        {showHelp && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <ol className="mt-4 flex flex-col gap-2 text-[13px] leading-relaxed" style={{ color: '#FFF3EA' }}>
              {isIOS ? (
                <>
                  <li>1. Open this page in <b>Safari</b>.</li>
                  <li>2. Tap the <b>Share</b> button <span aria-hidden>⬆️</span> at the bottom.</li>
                  <li>3. Choose <b>“Add to Home Screen”</b>, then <b>Add</b>.</li>
                </>
              ) : (
                <>
                  <li>1. Open this page in <b>Chrome</b>.</li>
                  <li>2. Tap the <b>⋮ menu</b> at the top right.</li>
                  <li>3. Choose <b>“Install app”</b> or <b>“Add to Home screen”</b>.</li>
                </>
              )}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
