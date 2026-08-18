'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Flame, Check, X, SkipForward } from 'lucide-react';
import { EASE } from '@/lib/motion';
import { useGameStore } from '@/store/gameStore';
import { useTogetherStore } from '@/store/togetherStore';
import {
  DUEL_CARDS, HEAT_META, atOrBelow, forMode, drawFrom, roundLine, type DuelCard,
} from '@/data/together';
import { TogetherHeader, HeatPill, Scoreboard, TurnBanner, Countdown, DeckNote } from './TogetherUI';

const TRUTH = '#7B79FF';
const DARE = '#FF2060';
const GAME = 'duel';

export default function DareDuelScreen() {
  const setPhase = useGameStore(s => s.setPhase);
  const { heat, mode, turn, seen, swapTurn, score, countRound, markSeen, clearSeen } = useTogetherStore();

  const [card, setCard] = useState<DuelCard | null>(null);
  const [reshuffled, setReshuffled] = useState(false);

  const seenIds = seen[GAME] ?? [];
  const deck = useMemo(() => forMode(atOrBelow(DUEL_CARDS, heat), mode), [heat, mode]);
  const truths = useMemo(() => deck.filter(c => c.type === 'truth'), [deck]);
  const dares = useMemo(() => deck.filter(c => c.type === 'dare'), [deck]);

  const rounds = useTogetherStore(s => s.rounds);
  const other = turn === 'p1' ? 'p2' : 'p1';
  const accent = card?.type === 'dare' ? DARE : card?.type === 'truth' ? TRUTH : HEAT_META[heat].color;

  const draw = (type: 'truth' | 'dare') => {
    const source = type === 'truth' ? truths : dares;
    const { card: picked, reshuffled: wrapped } = drawFrom(source, seenIds);
    if (!picked) return;
    if (wrapped) clearSeen(GAME);
    setReshuffled(wrapped);
    setCard(picked);
  };

  /** Close the round: award, remember the card, hand the phone over. */
  const finish = (winner: 'turn' | 'other' | null) => {
    if (!card) return;
    markSeen(GAME, card.id);
    if (winner === 'turn') score(turn, 1);
    if (winner === 'other') score(other, 1);
    countRound();
    swapTurn();
    setCard(null);
    setReshuffled(false);
  };

  return (
    <motion.div className="absolute inset-0 flex flex-col overflow-hidden" style={{ background: '#0A0A0A' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="relative z-10 flex flex-col h-full max-w-lg mx-auto w-full overflow-y-auto app-scroll">

        <TogetherHeader
          title="Dare Duel 🔥"
          sub={card ? 'Do it, or hand them the point' : 'Pick your poison — then pass the phone'}
          onBack={() => (card ? setCard(null) : setPhase('together'))}
          right={<HeatPill onClick={() => setPhase('together')} />}
        />

        <div className="px-4 flex flex-col gap-3">
          <Scoreboard accent={accent} />
          <TurnBanner seat={turn} accent={accent} line={roundLine(rounds)} />
          <DeckNote show={reshuffled} accent={accent} />
        </div>

        <div className="flex-1 flex flex-col px-4 pt-4 pb-8">
          <AnimatePresence mode="wait">
            {!card ? (
              <motion.div key="pick" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex-1 flex flex-col justify-center gap-4">

                <motion.button whileTap={{ scale: 0.97 }} onClick={() => draw('truth')} disabled={truths.length === 0}
                  className="rounded-[26px] px-6 py-8 flex flex-col items-center gap-2"
                  style={{ background: '#13122A', border: `1.5px solid ${truths.length ? TRUTH : 'rgba(255,255,255,0.08)'}`,
                    boxShadow: truths.length ? `0 8px 36px ${TRUTH}44` : 'none', opacity: truths.length ? 1 : 0.4 }}>
                  <div className="p-3.5 rounded-2xl flex items-center justify-center"
                    style={{ background: TRUTH, boxShadow: `0 4px 20px ${TRUTH}55` }}>
                    <Eye size={24} className="text-white" />
                  </div>
                  <span className="text-[20px] font-black text-white">Truth 💋</span>
                  <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {truths.length} in the deck · answer honestly, out loud
                  </span>
                </motion.button>

                <motion.button whileTap={{ scale: 0.97 }} onClick={() => draw('dare')} disabled={dares.length === 0}
                  className="rounded-[26px] px-6 py-8 flex flex-col items-center gap-2"
                  style={{ background: '#241015', border: `1.5px solid ${dares.length ? DARE : 'rgba(255,255,255,0.08)'}`,
                    boxShadow: dares.length ? `0 8px 36px ${DARE}44` : 'none', opacity: dares.length ? 1 : 0.4 }}>
                  <div className="p-3.5 rounded-2xl flex items-center justify-center"
                    style={{ background: DARE, boxShadow: `0 4px 20px ${DARE}55` }}>
                    <Flame size={24} className="text-white" fill="currentColor" />
                  </div>
                  <span className="text-[20px] font-black text-white">Dare 😈</span>
                  <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {dares.length} in the deck · the clock will be watching
                  </span>
                </motion.button>
              </motion.div>
            ) : (
              <motion.div key={`card-${card.id}`} initial={{ opacity: 0, y: 16, rotateX: -8 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }} exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: EASE.smooth }}
                className="flex-1 flex flex-col justify-center gap-4">

                <div className="rounded-[24px] p-6" style={{ background: '#161616',
                  border: '1px solid rgba(255,255,255,0.09)', borderLeft: `3px solid ${accent}`,
                  boxShadow: `0 10px 40px ${accent}18` }}>
                  <p className="text-[10px] uppercase tracking-widest font-black mb-2" style={{ color: accent }}>
                    {card.type === 'truth' ? '💋 Truth' : '😈 Dare'} · {HEAT_META[card.level].name}
                  </p>
                  <p className="text-[19px] font-bold leading-snug text-white">{card.text}</p>
                  {card.hint && (
                    <p className="text-[12px] italic mt-3" style={{ color: 'rgba(255,255,255,0.35)' }}>{card.hint}</p>
                  )}
                </div>

                {card.seconds && <Countdown key={card.id} seconds={card.seconds} accent={accent} />}

                <div className="flex flex-col gap-2.5 mt-1">
                  <motion.button whileTap={{ scale: 0.97 }} onClick={() => finish('turn')}
                    className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[14px] font-black text-white"
                    style={{ background: accent, boxShadow: `0 6px 26px ${accent}55` }}>
                    <Check size={16} /> Did it — my point
                  </motion.button>

                  <div className="flex gap-2.5">
                    <motion.button whileTap={{ scale: 0.97 }} onClick={() => finish('other')}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[12px] font-bold"
                      style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}>
                      <X size={14} /> Chickened out
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.97 }} onClick={() => finish(null)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[12px] font-bold"
                      style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}>
                      <SkipForward size={14} /> Pass, no points
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
