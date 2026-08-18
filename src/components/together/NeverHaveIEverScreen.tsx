'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EyeOff, Hand, Sparkles, ArrowRight } from 'lucide-react';
import { EASE, SPRING } from '@/lib/motion';
import { useGameStore } from '@/store/gameStore';
import { useTogetherStore, type Seat } from '@/store/togetherStore';
import {
  NHIE_CARDS, HEAT_META, atOrBelow, forMode, drawFrom, type NhieCard,
} from '@/data/together';
import { TogetherHeader, HeatPill, Scoreboard, DeckNote } from './TogetherUI';

const GAME = 'nhie';
const GUILTY = '#FF2060';
const INNOCENT = '#5AC8FA';

type Stage = 'cover-1' | 'ask-1' | 'cover-2' | 'ask-2' | 'reveal';
type Verdict = 'have' | 'never';

export default function NeverHaveIEverScreen() {
  const setPhase = useGameStore(s => s.setPhase);
  const { p1, p2, heat, mode, seen, score, countRound, markSeen, clearSeen } = useTogetherStore();

  const seenIds = seen[GAME] ?? [];
  const deck = useMemo(() => forMode(atOrBelow(NHIE_CARDS, heat), mode), [heat, mode]);
  const accent = HEAT_META[heat].color;

  const [card, setCard] = useState<NhieCard | null>(() => drawFrom(deck, seen[GAME] ?? []).card);
  const [stage, setStage] = useState<Stage>('cover-1');
  const [answers, setAnswers] = useState<Record<Seat, Verdict | null>>({ p1: null, p2: null });
  const [reshuffled, setReshuffled] = useState(false);

  const nextCard = () => {
    const { card: picked, reshuffled: wrapped } = drawFrom(deck, seenIds);
    if (!picked) return;
    if (wrapped) clearSeen(GAME);
    setReshuffled(wrapped);
    setCard(picked);
    setAnswers({ p1: null, p2: null });
    setStage('cover-1');
  };

  // Heat or mode changed under us (edited on the hub) — deal from the new deck.
  const deckKey = `${heat}-${mode}`;
  const [dealtFor, setDealtFor] = useState(deckKey);
  if (dealtFor !== deckKey) {
    setDealtFor(deckKey);
    setCard(drawFrom(deck, seenIds).card);
    setAnswers({ p1: null, p2: null });
    setStage('cover-1');
    setReshuffled(false);
  }

  const answer = (seat: Seat, verdict: Verdict) => {
    const next = { ...answers, [seat]: verdict };
    setAnswers(next);
    if (seat === 'p1') { setStage('cover-2'); return; }

    // both in — award a guilty point each and close the round
    if (card) markSeen(GAME, card.id);
    if (next.p1 === 'have') score('p1', 1);
    if (next.p2 === 'have') score('p2', 1);
    countRound();
    setStage('reveal');
  };

  const bothHave = answers.p1 === 'have' && answers.p2 === 'have';
  const neither = answers.p1 === 'never' && answers.p2 === 'never';

  const verdictLine = bothHave
    ? (card?.bothLine ?? 'Both of you. Say more about that.')
    : neither
      ? 'Neither of you. Suspicious, but fine — next card.'
      : `Only one of you owned up. ${answers.p1 === 'have' ? p1 : p2}, explain yourself. 😏`;

  return (
    <motion.div className="absolute inset-0 flex flex-col overflow-hidden" style={{ background: '#0A0A0A' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="relative z-10 flex flex-col h-full max-w-lg mx-auto w-full overflow-y-auto app-scroll">

        <TogetherHeader
          title="Never Have I Ever 👀"
          sub="Answer in secret — the phone flips you both at once"
          onBack={() => setPhase('together')}
          right={<HeatPill onClick={() => setPhase('together')} />}
        />

        <div className="px-4 flex flex-col gap-3">
          <Scoreboard accent={accent} />
          <DeckNote show={reshuffled} accent={accent} />
        </div>

        <div className="flex-1 flex flex-col px-4 pt-4 pb-8">
          {card && (
            <>
              {/* The statement — hidden while a cover is up so nobody peeks ahead */}
              <AnimatePresence>
                {stage !== 'cover-1' && stage !== 'cover-2' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="rounded-[24px] p-6 mb-4"
                    style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.09)', borderLeft: `3px solid ${accent}` }}>
                    <p className="text-[10px] uppercase tracking-widest font-black mb-2" style={{ color: accent }}>
                      Never have I ever…
                    </p>
                    <p className="text-[19px] font-bold leading-snug text-white">{card.text}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {(stage === 'cover-1' || stage === 'cover-2') && (
                  <motion.div key={stage} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.4, ease: EASE.smooth }}
                    className="flex-1 flex flex-col items-center justify-center gap-5 text-center">
                    <motion.div className="w-20 h-20 rounded-3xl flex items-center justify-center"
                      style={{ background: '#141414', border: `1.5px solid ${accent}55` }}
                      animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 2.4, repeat: Infinity }}>
                      <EyeOff size={30} style={{ color: accent }} />
                    </motion.div>
                    <div>
                      <h2 className="text-[22px] font-black text-white">
                        {stage === 'cover-1' ? p1 : p2}, the phone is yours
                      </h2>
                      <p className="text-[12px] mt-1.5 px-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        {mode === 'same-room'
                          ? 'The other one looks away — no peeking, no cheating.'
                          : 'Answer here, they answer on their side. Nobody says it out loud yet.'}
                      </p>
                    </div>
                    <motion.button whileTap={{ scale: 0.96 }}
                      onClick={() => setStage(stage === 'cover-1' ? 'ask-1' : 'ask-2')}
                      className="flex items-center gap-2 px-7 py-3.5 rounded-2xl text-[14px] font-black text-white"
                      style={{ background: accent, boxShadow: `0 6px 26px ${accent}55` }}>
                      <Hand size={16} /> I&rsquo;m the only one looking
                    </motion.button>
                  </motion.div>
                )}

                {(stage === 'ask-1' || stage === 'ask-2') && (
                  <motion.div key={stage} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col justify-center gap-3">
                    <p className="text-center text-[12px] mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {stage === 'ask-1' ? p1 : p2} — the honest answer, nobody sees it yet
                    </p>
                    <VerdictButton emoji="😳" label="I have" sub="Guilty. Take the point."
                      color={GUILTY} onClick={() => answer(stage === 'ask-1' ? 'p1' : 'p2', 'have')} />
                    <VerdictButton emoji="😇" label="I never" sub="Clean… supposedly."
                      color={INNOCENT} onClick={() => answer(stage === 'ask-1' ? 'p1' : 'p2', 'never')} />
                  </motion.div>
                )}

                {stage === 'reveal' && (
                  <motion.div key="reveal" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }} transition={SPRING.gentle}
                    className="flex-1 flex flex-col justify-center gap-4">
                    <div className="flex gap-3">
                      <RevealCard name={p1} verdict={answers.p1!} delay={0} />
                      <RevealCard name={p2} verdict={answers.p2!} delay={0.18} />
                    </div>

                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                      className="text-[13px] text-center font-bold px-4" style={{ color: bothHave ? GUILTY : 'rgba(255,255,255,0.55)' }}>
                      {verdictLine}
                    </motion.p>

                    <motion.button whileTap={{ scale: 0.97 }} onClick={nextCard}
                      className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[14px] font-black text-white mt-1"
                      style={{ background: accent, boxShadow: `0 6px 26px ${accent}55` }}>
                      Next card <ArrowRight size={16} />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function VerdictButton({ emoji, label, sub, color, onClick }: {
  emoji: string; label: string; sub: string; color: string; onClick: () => void;
}) {
  return (
    <motion.button whileTap={{ scale: 0.97 }} onClick={onClick}
      className="rounded-[24px] px-6 py-7 flex flex-col items-center gap-1.5"
      style={{ background: '#141414', border: `1.5px solid ${color}77`, boxShadow: `0 8px 30px ${color}22` }}>
      <span className="text-[30px]">{emoji}</span>
      <span className="text-[19px] font-black text-white">{label}</span>
      <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{sub}</span>
    </motion.button>
  );
}

function RevealCard({ name, verdict, delay }: { name: string; verdict: Verdict; delay: number }) {
  const guilty = verdict === 'have';
  const color = guilty ? GUILTY : INNOCENT;
  return (
    <motion.div className="flex-1 rounded-[22px] p-5 flex flex-col items-center gap-1.5 min-w-0"
      initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }}
      transition={{ delay, duration: 0.5, ease: EASE.smooth }}
      style={{ background: '#141414', border: `1.5px solid ${color}77`, boxShadow: `0 8px 30px ${color}22` }}>
      <span className="text-[26px]">{guilty ? '😳' : '😇'}</span>
      <span className="text-[11px] font-black uppercase tracking-wider truncate max-w-full" style={{ color }}>{name}</span>
      <span className="text-[14px] font-black text-white">{guilty ? 'I have' : 'I never'}</span>
      {guilty && (
        <span className="flex items-center gap-1 text-[9px] font-bold" style={{ color: 'rgba(255,255,255,0.35)' }}>
          <Sparkles size={9} /> +1 point
        </span>
      )}
    </motion.div>
  );
}
