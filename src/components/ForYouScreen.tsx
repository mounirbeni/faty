'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mail, Heart, Ticket, ChevronRight, Check, RotateCcw, Lock } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { OPEN_WHEN, LOVE_REASONS, LOVE_COUPONS } from '@/data/forYou';
import { notifyOwner } from '@/lib/notify';

type View = 'hub' | 'letters' | 'reasons' | 'coupons';

const ROSE = '#FF2060';
const VIOLET = '#7B79FF';
const GOLD = '#FFB300';

// ── tiny localStorage helpers (remember what she's opened/redeemed) ──
function loadSet(key: string): number[] {
  if (typeof localStorage === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}
function saveSet(key: string, ids: number[]) {
  try { localStorage.setItem(key, JSON.stringify(ids)); } catch { /* ignore */ }
}

export default function ForYouScreen() {
  const setPhase = useGameStore(s => s.setPhase);
  const [view, setView] = useState<View>('hub');

  return (
    <motion.div className="absolute inset-0 flex flex-col overflow-hidden" style={{ background: '#08060E' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* soft glow */}
      <div className="absolute pointer-events-none" style={{
        top: '-15%', left: '50%', transform: 'translateX(-50%)', width: '90vw', height: '50vh',
        background: 'radial-gradient(ellipse, rgba(255,32,96,0.16) 0%, transparent 65%)', filter: 'blur(50px)' }} />

      <div className="relative z-10 flex flex-col h-full max-w-lg mx-auto w-full overflow-y-auto app-scroll">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-10 pb-5 shrink-0">
          <button onClick={() => (view === 'hub' ? setPhase('home') : setView('hub'))}
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: '#161320', border: '1px solid rgba(255,255,255,0.09)' }}>
            <ArrowLeft size={16} className="text-white/70" />
          </button>
          <div>
            <h1 className="text-[18px] font-black text-white">
              {view === 'hub' ? 'For You 💌' : view === 'letters' ? 'Open When… 💌' : view === 'reasons' ? 'Reasons I Love You 🃏' : 'Love Coupons 🎟️'}
            </h1>
            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {view === 'hub' ? 'Made by me, for whenever you need me' :
               view === 'letters' ? 'Only open each one when it’s true' :
               view === 'reasons' ? 'Tap for the next one' : 'Redeem any time — I’ll deliver'}
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {view === 'hub'     && <Hub     key="hub"     onPick={setView} />}
          {view === 'letters' && <Letters key="letters" />}
          {view === 'reasons' && <Reasons key="reasons" />}
          {view === 'coupons' && <Coupons key="coupons" />}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Hub ──────────────────────────────────────────────────────────────────────
function Hub({ onPick }: { onPick: (v: View) => void }) {
  const cards = [
    { v: 'letters' as View, emoji: '💌', icon: <Mail size={24} className="text-white" />, title: 'Open When…', sub: `${OPEN_WHEN.length} sealed letters for every kind of moment`, from: ROSE, to: '#D9266B' },
    { v: 'reasons' as View, emoji: '🃏', icon: <Heart size={24} className="text-white" fill="white" />, title: 'Reasons I Love You', sub: `${LOVE_REASONS.length} reasons, whenever you need one`, from: VIOLET, to: '#5856D6' },
    { v: 'coupons' as View, emoji: '🎟️', icon: <Ticket size={24} className="text-white" />, title: 'Love Coupons', sub: `${LOVE_COUPONS.length} gifts you can redeem from me`, from: GOLD, to: '#FF8A00' },
  ];
  return (
    <motion.div key="hub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex flex-col gap-3.5 px-4 pb-10">
      <div className="rounded-[20px] p-4 mb-1" style={{ background: '#120F1C', border: '1px solid rgba(255,255,255,0.08)' }}>
        <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
          Everything in here is from me to you. When you’re far and I can’t hold you, come here — I left pieces of myself waiting for you. 🤍
        </p>
      </div>
      {cards.map((c, i) => (
        <motion.button key={c.v} onClick={() => onPick(c.v)} whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
          className="relative rounded-[22px] p-4 flex items-center gap-4 text-left overflow-hidden"
          style={{ background: '#120F1C', border: '1px solid rgba(255,255,255,0.09)', boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: `linear-gradient(135deg, ${c.from}, ${c.to})`, boxShadow: `0 6px 22px ${c.from}55` }}>
            {c.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[16px] font-black text-white">{c.title} <span className="ml-0.5">{c.emoji}</span></h3>
            <p className="text-[11.5px] mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{c.sub}</p>
          </div>
          <ChevronRight size={18} className="text-white/35 shrink-0" />
        </motion.button>
      ))}
    </motion.div>
  );
}

// ─── Open When… letters ───────────────────────────────────────────────────────
function Letters() {
  const [opened, setOpened] = useState<number[]>(() => loadSet('fy_open_when'));
  const [active, setActive] = useState<number | null>(null);

  const open = useCallback((id: number) => {
    setActive(id);
    setOpened(prev => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      saveSet('fy_open_when', next);
      const letter = OPEN_WHEN.find(l => l.id === id);
      if (letter) notifyOwner(`💌 <b>She opened a letter</b>\n\n<i>“Open when ${letter.when}”</i>\n\n<i>She needed you just now.</i>`);
      return next;
    });
  }, []);

  const letter = OPEN_WHEN.find(l => l.id === active) ?? null;

  return (
    <motion.div key="letters" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex flex-col px-4 pb-10">
      <div className="grid grid-cols-2 gap-3">
        {OPEN_WHEN.map((l, i) => {
          const isOpen = opened.includes(l.id);
          return (
            <motion.button key={l.id} onClick={() => open(l.id)} whileTap={{ scale: 0.96 }}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="relative rounded-[18px] p-4 min-h-[112px] flex flex-col items-center justify-center text-center gap-1.5 overflow-hidden"
              style={{
                background: isOpen ? '#160c12' : '#15121F',
                border: isOpen ? `1px solid ${ROSE}55` : '1px solid rgba(255,255,255,0.09)',
                boxShadow: isOpen ? `0 4px 20px ${ROSE}22` : '0 4px 16px rgba(0,0,0,0.4)',
              }}>
              <span className="text-3xl">{l.emoji}</span>
              <span className="text-[12px] font-bold leading-tight text-white">Open when…</span>
              <span className="text-[11px] leading-tight" style={{ color: 'rgba(255,255,255,0.5)' }}>{l.when}</span>
              {isOpen && (
                <span className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: ROSE }}><Check size={11} className="text-white" /></span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Letter reader */}
      <AnimatePresence>
        {letter && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-5"
            style={{ background: 'rgba(4,2,10,0.82)', backdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setActive(null)}>
            <motion.div onClick={e => e.stopPropagation()}
              className="relative w-full max-w-[400px] rounded-[26px] overflow-hidden"
              style={{ background: 'linear-gradient(165deg, #1C1320 0%, #140E18 100%)', border: `1px solid ${ROSE}40`, boxShadow: `0 20px 70px rgba(0,0,0,0.6)` }}
              initial={{ scale: 0.85, y: 30, rotateX: 12 }} animate={{ scale: 1, y: 0, rotateX: 0 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 22 }}>
              <div className="h-[4px] w-full" style={{ background: `linear-gradient(90deg, ${ROSE}, ${GOLD}, ${VIOLET})` }} />
              <div className="p-6">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-1">{letter.emoji}</div>
                  <p className="text-[11px] uppercase tracking-[0.18em] font-black" style={{ color: ROSE }}>Open when {letter.when}</p>
                </div>
                <p className="text-[15px] leading-relaxed" style={{ color: 'rgba(255,240,245,0.92)' }}>{letter.body}</p>
                <p className="text-[13px] italic mt-5 text-right" style={{ color: GOLD }}>{letter.signoff}</p>
                <button onClick={() => setActive(null)}
                  className="w-full mt-6 py-3 rounded-2xl text-[13px] font-bold text-white"
                  style={{ background: ROSE, boxShadow: `0 4px 20px ${ROSE}55` }}>
                  Close & keep it with me
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Reasons I Love You ───────────────────────────────────────────────────────
function Reasons() {
  const [idx, setIdx] = useState(0);
  const next = () => setIdx(i => (i + 1) % LOVE_REASONS.length);

  return (
    <motion.div key="reasons" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex flex-col flex-1 px-4 pb-10 items-center justify-center gap-6">
      <div className="w-full flex flex-col items-center" style={{ minHeight: 320 }}>
        <p className="text-[11px] font-black uppercase tracking-[0.2em] mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Reason {idx + 1} of {LOVE_REASONS.length}
        </p>
        <div className="relative w-full max-w-[360px]" style={{ perspective: 1000 }}>
          {/* stacked cards behind */}
          <div className="absolute inset-x-3 -bottom-2 h-full rounded-[26px]" style={{ background: '#160f1e', border: '1px solid rgba(255,255,255,0.05)', transform: 'translateY(10px) scale(0.96)' }} />
          <div className="absolute inset-x-1.5 -bottom-1 h-full rounded-[26px]" style={{ background: '#1a1226', border: '1px solid rgba(255,255,255,0.06)', transform: 'translateY(5px) scale(0.98)' }} />
          <AnimatePresence mode="wait">
            <motion.button key={idx} onClick={next} whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, rotateY: -90, scale: 0.9 }} animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: 90, scale: 0.9 }} transition={{ duration: 0.35 }}
              className="relative w-full rounded-[26px] px-7 py-12 flex flex-col items-center justify-center gap-5 text-center"
              style={{ background: 'linear-gradient(165deg, #211531 0%, #160E1F 100%)', border: `1px solid ${VIOLET}45`, boxShadow: `0 16px 50px ${VIOLET}33`, minHeight: 280 }}>
              <Heart size={28} fill={ROSE} style={{ color: ROSE, filter: `drop-shadow(0 0 12px ${ROSE}88)` }} />
              <p className="text-[20px] font-bold leading-snug text-white">{LOVE_REASONS[idx]}</p>
              <span className="text-[11px] flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                <RotateCcw size={11} /> tap for the next reason
              </span>
            </motion.button>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Love Coupons ─────────────────────────────────────────────────────────────
function Coupons() {
  const [redeemed, setRedeemed] = useState<number[]>(() => loadSet('fy_coupons'));
  const [justDone, setJustDone] = useState<number | null>(null);

  const redeem = (id: number) => {
    if (redeemed.includes(id)) return;
    const c = LOVE_COUPONS.find(x => x.id === id);
    const next = [...redeemed, id];
    setRedeemed(next);
    saveSet('fy_coupons', next);
    setJustDone(id);
    setTimeout(() => setJustDone(null), 2200);
    if (c) notifyOwner(`🎟️ <b>She redeemed a Love Coupon!</b>\n\n${c.emoji} <b>${c.title}</b>\n<i>${c.detail}</i>\n\n<i>Time to deliver. 💕</i>`);
  };

  return (
    <motion.div key="coupons" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex flex-col gap-3 px-4 pb-10">
      {LOVE_COUPONS.map((c, i) => {
        const used = redeemed.includes(c.id);
        return (
          <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="relative rounded-[18px] overflow-hidden flex items-stretch"
            style={{ background: used ? '#141016' : '#1A1206', border: used ? '1px solid rgba(255,255,255,0.08)' : `1px solid ${GOLD}40`, opacity: used ? 0.65 : 1 }}>
            {/* perforated stub */}
            <div className="w-14 shrink-0 flex items-center justify-center text-2xl"
              style={{ background: used ? 'rgba(255,255,255,0.03)' : `${GOLD}1A`, borderRight: `2px dashed ${used ? 'rgba(255,255,255,0.12)' : GOLD + '55'}` }}>
              {c.emoji}
            </div>
            <div className="flex-1 p-3.5 min-w-0">
              <h3 className="text-[14px] font-black text-white leading-tight">{c.title}</h3>
              <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{c.detail}</p>
              <button onClick={() => redeem(c.id)} disabled={used}
                className="mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold"
                style={{ background: used ? 'rgba(255,255,255,0.06)' : GOLD, color: used ? 'rgba(255,255,255,0.5)' : '#1A1206' }}>
                {used ? <><Check size={12} /> Redeemed</> : <><Ticket size={12} /> Redeem</>}
              </button>
            </div>
            <AnimatePresence>
              {justDone === c.id && (
                <motion.div initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center gap-2"
                  style={{ background: 'rgba(20,12,4,0.85)' }}>
                  <span className="text-[13px] font-black" style={{ color: GOLD }}>Sent to him 💕</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
      <p className="text-[10px] text-center mt-1 flex items-center justify-center gap-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
        <Lock size={9} /> The moment you redeem one, I get the message instantly
      </p>
    </motion.div>
  );
}
