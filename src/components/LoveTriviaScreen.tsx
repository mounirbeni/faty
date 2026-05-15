'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, XCircle, Sparkles, Heart, Trophy, RotateCcw } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { softTap, successVibe, heartbeat } from '@/lib/useHaptics';
import { triviaData } from '@/data/triviaData';
import { notifyOwner } from '@/lib/notify';

type AnswerState = 'unanswered' | 'correct' | 'wrong';

export default function LoveTriviaScreen() {
  const { setPhase, setTriviaScore, logActivity } = useGameStore();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('unanswered');
  const [score, setScore] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const q = triviaData[currentIdx];
  const isLast = currentIdx === triviaData.length - 1;

  const handlePick = (idx: number) => {
    if (answerState !== 'unanswered') return;
    softTap();
    setSelectedOption(idx);
    const correct = idx === q.correctIndex;
    setAnswerState(correct ? 'correct' : 'wrong');
    if (correct) {
      successVibe();
      setScore((s) => s + 1);
    }
    setAnswers((prev) => [...prev, correct]);
  };

  const handleNext = () => {
    heartbeat();
    if (isLast) {
      const finalScore = score + (answerState === 'correct' ? 0 : 0); // already set above
      setTriviaScore(finalScore);
      logActivity('love-trivia', `Scored ${finalScore}/${triviaData.length} on Love Trivia`);
      notifyOwner(`🧠 <b>Faty just completed Love Trivia!</b>\n\nShe scored <b>${finalScore}/${triviaData.length}</b>.\n\n${finalScore >= 8 ? 'She knows you so well!' : finalScore >= 5 ? 'She is learning!' : 'She needs more time with you.'}`);
      setIsDone(true);
    } else {
      setCurrentIdx((i) => i + 1);
      setSelectedOption(null);
      setAnswerState('unanswered');
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setAnswerState('unanswered');
    setScore(0);
    setIsDone(false);
    setAnswers([]);
  };

  const optionColors: Record<AnswerState, (idx: number) => string> = {
    unanswered: () => 'glass border border-white/10 active:scale-95 cursor-pointer',
    correct: (idx) =>
      idx === q.correctIndex
        ? 'bg-emerald-500/25 border border-emerald-400/60 shadow-[0_0_16px_rgba(16,185,129,0.25)]'
        : idx === selectedOption
        ? 'bg-rose-500/15 border border-rose-400/30 opacity-50'
        : 'glass border border-white/5 opacity-40',
    wrong: (idx) =>
      idx === q.correctIndex
        ? 'bg-emerald-500/25 border border-emerald-400/60'
        : idx === selectedOption
        ? 'bg-rose-500/25 border border-rose-400/60 shadow-[0_0_16px_rgba(244,63,94,0.2)]'
        : 'glass border border-white/5 opacity-40',
  };

  const scoreMessage = () => {
    if (score >= 9) return { text: "You know me better than anyone.", color: 'text-amber-300' };
    if (score >= 7) return { text: "You really pay attention. I love that.", color: 'text-emerald-300' };
    if (score >= 5) return { text: "Not bad! We still have so much to discover.", color: 'text-sky-300' };
    return { text: "Looks like you need more time with me.", color: 'text-rose-300' };
  };

  if (isDone) {
    const msg = scoreMessage();
    return (
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-amber-500/8 blur-[120px] pointer-events-none" />

        <motion.div
          className="relative z-10 w-full max-w-sm flex flex-col items-center gap-6"
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 140, damping: 18 }}
        >
          {/* Trophy */}
          <div className="w-24 h-24 rounded-3xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.25)]">
            <Trophy size={44} className="text-amber-300" />
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white mb-1">{score} / {triviaData.length}</h2>
            <p className={`text-base font-semibold ${msg.color}`}>{msg.text}</p>
          </div>

          {/* Answer history dots */}
          <div className="flex gap-1.5 flex-wrap justify-center">
            {answers.map((correct, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-full flex items-center justify-center ${correct ? 'bg-emerald-500/25 border border-emerald-400/50' : 'bg-rose-500/25 border border-rose-400/50'}`}
              >
                {correct
                  ? <CheckCircle2 size={12} className="text-emerald-400" />
                  : <XCircle size={12} className="text-rose-400" />
                }
              </div>
            ))}
          </div>

          <div className="w-full flex flex-col gap-3">
            <button
              onClick={handleReset}
              className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 active:scale-95 transition-transform cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 8px 32px rgba(245,158,11,0.3)' }}
            >
              <RotateCcw size={16} /> Play Again
            </button>
            <button
              onClick={() => setPhase('home')}
              className="w-full py-3.5 rounded-2xl font-semibold text-white/60 glass border border-white/10 active:scale-95 transition-transform cursor-pointer flex items-center justify-center gap-2"
            >
              <Heart size={14} fill="currentColor" className="text-rose-400" /> Back to Map
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="absolute inset-0 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-violet-600/8 blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-10 pb-4 shrink-0">
        <button
          onClick={() => { heartbeat(); setPhase('home'); }}
          className="glass flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-white/60 active:scale-95 transition-transform cursor-pointer"
        >
          <ArrowLeft size={16} />
          Map
        </button>
        <div className="text-center">
          <p className="text-[11px] text-amber-300 uppercase tracking-widest font-bold flex items-center gap-1 justify-center">
            <Sparkles size={11} /> How Well Do You Know Me?
          </p>
        </div>
        {/* Score */}
        <div className="w-16 flex justify-end">
          <div className="glass px-2.5 py-1.5 rounded-xl text-center">
            <span className="text-[11px] font-bold text-amber-300">{score}</span>
            <span className="text-[9px] text-white/30">/{triviaData.length}</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative z-10 px-5 shrink-0">
        <div className="h-1 w-full bg-white/8 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-300"
            animate={{ width: `${((currentIdx) / triviaData.length) * 100}%` }}
            transition={{ type: 'spring', stiffness: 80, damping: 20 }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[9px] text-white/25">Question {currentIdx + 1} of {triviaData.length}</span>
          <span className="text-[9px] text-white/25">{Math.round((currentIdx / triviaData.length) * 100)}%</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-5 relative z-10 gap-5 overflow-y-auto pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            className="w-full max-w-sm flex flex-col gap-4"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            {/* Question card */}
            <div className="glass-premium rounded-3xl overflow-hidden">
              <div className="h-[3px] w-full bg-gradient-to-r from-amber-400 to-yellow-300" />
              <div className="p-6">
                <p className="text-[18px] font-bold text-white leading-snug text-center">
                  {q.question}
                </p>
              </div>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-2.5">
              {q.options.map((opt, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => handlePick(idx)}
                  className={`w-full text-left px-4 py-3.5 rounded-2xl text-[14px] font-semibold text-white transition-all flex items-center gap-3 ${optionColors[answerState](idx)}`}
                  whileTap={answerState === 'unanswered' ? { scale: 0.97 } : {}}
                >
                  <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-[11px] font-bold shrink-0 ${
                    answerState !== 'unanswered' && idx === q.correctIndex
                      ? 'bg-emerald-500/30 border-emerald-400 text-emerald-300'
                      : answerState !== 'unanswered' && idx === selectedOption
                      ? 'bg-rose-500/30 border-rose-400 text-rose-300'
                      : 'border-white/20 text-white/40'
                  }`}>
                    {answerState !== 'unanswered' && idx === q.correctIndex
                      ? <CheckCircle2 size={12} />
                      : answerState !== 'unanswered' && idx === selectedOption && idx !== q.correctIndex
                      ? <XCircle size={12} />
                      : String.fromCharCode(65 + idx)}
                  </span>
                  {opt}
                </motion.button>
              ))}
            </div>

            {/* Fun fact reveal */}
            <AnimatePresence>
              {answerState !== 'unanswered' && (
                <motion.div
                  className={`rounded-2xl p-4 flex items-start gap-3 ${answerState === 'correct' ? 'bg-emerald-500/15 border border-emerald-400/30' : 'bg-white/5 border border-white/10'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Sparkles size={14} className={`shrink-0 mt-0.5 ${answerState === 'correct' ? 'text-emerald-300' : 'text-white/40'}`} />
                  <p className="text-[13px] text-white/70 leading-relaxed italic">
                    {q.funFact}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next button */}
            <AnimatePresence>
              {answerState !== 'unanswered' && (
                <motion.button
                  onClick={handleNext}
                  className="w-full py-4 rounded-2xl font-bold text-white active:scale-95 transition-transform cursor-pointer relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    boxShadow: '0 8px 32px rgba(245,158,11,0.3)',
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div
                    className="absolute inset-0 w-1/3 h-full bg-white/15 -skew-x-12 pointer-events-none"
                    initial={{ x: '-150%' }}
                    animate={{ x: '350%' }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  />
                  <span className="relative z-10">
                    {isLast ? 'See My Score' : 'Next Question'}
                  </span>
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
