"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Lock,
  RotateCcw,
  Pen,
  MessageCircleHeart,
  Heart,
} from "lucide-react";
import { questionsData as questions, type Question } from "@/data/questions";
import { categoriesMeta } from "@/data/meta";
import VibeMeter from "./ProgressBar";
import Toast from "./Toast";
import IconFromName from "./IconFromName";
import LevelIntro from "./LevelIntro";
import HeartBurst from "./HeartBurst";
import LoveNote from "./LoveNote";
import { useGameStore } from "@/store/gameStore";

// ─── Animation variants (Hardware accelerated) ────────────────────────

const cardVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 280 : -280,
    opacity: 0,
    rotateY: dir > 0 ? 5 : -5,
    scale: 0.94,
  }),
  center: {
    x: 0,
    opacity: 1,
    rotateY: 0,
    scale: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -280 : 280,
    opacity: 0,
    rotateY: dir > 0 ? -5 : 5,
    scale: 0.94,
  }),
};

// ─── Theme Mapping ───────────────────────────────────────────────────

const categoryStyles: Record<number, { ring: string; shadow: string; bgGradient: string; buttonGradient: string; tagColor: string }> = {
  1: { ring: "focus:ring-sky-500/50 ring-sky-400/30", shadow: "shadow-sky-500/20", bgGradient: "bg-gradient-to-r from-sky-500/90 to-indigo-500/90", buttonGradient: "bg-gradient-to-r from-sky-400 to-indigo-400", tagColor: "bg-sky-500/20 text-sky-300 ring-1 ring-sky-500/30" },
  2: { ring: "focus:ring-violet-500/50 ring-violet-400/30", shadow: "shadow-violet-500/20", bgGradient: "bg-gradient-to-r from-violet-500/90 to-fuchsia-500/90", buttonGradient: "bg-gradient-to-r from-violet-400 to-fuchsia-400", tagColor: "bg-violet-500/20 text-violet-300 ring-1 ring-violet-500/30" },
  3: { ring: "focus:ring-fuchsia-500/50 ring-fuchsia-400/30", shadow: "shadow-fuchsia-500/20", bgGradient: "bg-gradient-to-r from-fuchsia-500/90 to-rose-500/90", buttonGradient: "bg-gradient-to-r from-fuchsia-400 to-rose-400", tagColor: "bg-fuchsia-500/20 text-fuchsia-300 ring-1 ring-fuchsia-500/30" },
  4: { ring: "focus:ring-rose-500/50 ring-rose-400/30", shadow: "shadow-rose-500/20", bgGradient: "bg-gradient-to-r from-rose-500/90 to-orange-500/90", buttonGradient: "bg-gradient-to-r from-rose-400 to-orange-400", tagColor: "bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/30" },
  5: { ring: "focus:ring-red-500/50 ring-red-400/30", shadow: "shadow-red-500/20", bgGradient: "bg-gradient-to-r from-red-600/90 to-rose-600/90", buttonGradient: "bg-gradient-to-r from-red-500 to-rose-600", tagColor: "bg-red-500/20 text-red-300 ring-1 ring-red-500/30" },
};

const flipVariants = {
  initial: { rotateY: 0 },
  flipped: { rotateY: 180 },
  back: { rotateY: 360 },
};

// ─── Component ───────────────────────────────────────────────────────

export default function GameScreen() {
  const {
    currentIndex,
    answers,
    reversed,
    reverseCardsLeft,
    setAnswer,
    goNext,
    goPrev,
    playReverseCard,
    undoReverse,
  } = useGameStore();

  const [direction, setDirection] = useState(1);
  const [isFlipping, setIsFlipping] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [heartBurstTrigger, setHeartBurstTrigger] = useState(0);
  const [loveNoteTrigger, setLoveNoteTrigger] = useState(0);
  const [showLevelIntro, setShowLevelIntro] = useState(true);
  const seenCategoriesRef = useRef<Set<number>>(new Set([1]));

  const currentQuestion: Question = questions[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === questions.length - 1;
  const currentAnswer = answers[currentQuestion.id] || "";
  const isReversed = reversed.has(currentQuestion.id);
  const hasAnswer = currentAnswer.trim().length > 0 || isReversed;
  const isTimeCapsule = currentQuestion.category === 5;
  const categoryMeta = categoriesMeta[currentQuestion.category - 1];
  const theme = categoryStyles[currentQuestion.category] || categoryStyles[1];

  // ─── Handlers ────────────────────────────────────────────────────

  const handleNext = useCallback(() => {
    if (!hasAnswer) return;

    setHeartBurstTrigger((t) => t + 1);
    setLoveNoteTrigger((t) => t + 1);

    if (isTimeCapsule && !isReversed) {
      setToastMsg("Answer locked! It will only be revealed when we meet face-to-face.");
      setToastVisible(true);
    }

    setDirection(1);
    
    if (!isLast) {
      const nextIndex = currentIndex + 1;
      const nextQuestion = questions[nextIndex];

      if (nextQuestion.category !== currentQuestion.category) {
        const nextCategory = nextQuestion.category;
        if (!seenCategoriesRef.current.has(nextCategory)) {
          seenCategoriesRef.current.add(nextCategory);
          setTimeout(() => {
            goNext();
            setShowLevelIntro(true);
          }, 400);
          return;
        }
      }
    }
    
    goNext();
  }, [hasAnswer, isTimeCapsule, isReversed, isLast, currentIndex, currentQuestion.category, goNext]);

  const handlePrev = useCallback(() => {
    if (isFirst) return;
    setDirection(-1);
    goPrev();
  }, [isFirst, goPrev]);

  const handleUseReverseCard = useCallback(() => {
    if (reverseCardsLeft <= 0 || isReversed) return;

    setIsFlipping(true);
    setTimeout(() => {
      playReverseCard(currentQuestion.id);
      setIsFlipping(false);
    }, 600);
  }, [reverseCardsLeft, isReversed, currentQuestion.id, playReverseCard]);

  // ─── Render ──────────────────────────────────────────────────────

  const levelStart = questions.findIndex((q) => q.category === currentQuestion.category);
  const levelEnd = questions.filter((q) => q.category === currentQuestion.category).length;
  const posInLevel = currentIndex - levelStart + 1;

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center px-4 pt-6 pb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Ambient glow */}
      <div
        className="fixed top-0 inset-x-0 h-[60vh] pointer-events-none opacity-25 blur-[120px] transition-all duration-1000"
        style={{ background: `radial-gradient(ellipse at top, ${categoryMeta.accentHex}, transparent 70%)` }}
      />
      <div
        className="fixed bottom-0 inset-x-0 h-[30vh] pointer-events-none opacity-10 blur-[100px] transition-all duration-1000"
        style={{ background: `radial-gradient(ellipse at bottom, ${categoryMeta.accentHex}, transparent 70%)` }}
      />

      <div className="relative z-10 w-full max-w-lg flex flex-col h-full max-h-full">
        {/* ── Header ── */}
        <div className="mb-4 shrink-0">
          <VibeMeter total={questions.length} category={currentQuestion.category} />

          <div className="flex items-center justify-between mt-3">
            <div className="text-xs text-white/30 font-medium flex items-center gap-1.5">
              <IconFromName name={categoryMeta.icon} size={13} className="text-white/40" />
              <span className="hidden sm:inline">{categoryMeta.title}</span>
              <span className="sm:hidden">Lvl {currentQuestion.category}</span>
              <span className="text-white/15 mx-1">·</span>
              <span className="text-white/20">{posInLevel} / {levelEnd}</span>
            </div>
            <button
              onClick={handleUseReverseCard}
              disabled={reverseCardsLeft <= 0 || isReversed || isFlipping}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass text-xs font-semibold text-white/70 active:scale-95 transition-transform disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <RotateCcw size={14} className="text-amber-400" />
              <span>{reverseCardsLeft}</span>
              <span className="hidden sm:inline">Reverse</span>
            </button>
          </div>
        </div>

        {/* ── Question Card ── */}
        <div className="flex-1 min-h-0 relative flex flex-col justify-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentQuestion.id}
              custom={direction}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 25,
                mass: 0.8,
              }}
              className="w-full absolute inset-x-0 top-1/2 -translate-y-1/2"
              style={{ perspective: 1000 }}
            >
              <motion.div
                variants={flipVariants}
                animate={isFlipping ? "flipped" : isReversed ? "back" : "initial"}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div
                  className={`
                    rounded-3xl p-5 sm:p-8 shadow-2xl overflow-y-auto max-h-[60vh]
                    ${isTimeCapsule
                      ? "glass-warm ring-1 ring-red-500/20 shadow-red-500/10"
                      : "glass-strong shadow-black/20"
                    }
                  `}
                >
                  {isReversed ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 12 }}
                        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4 shadow-lg shadow-amber-500/30"
                      >
                        <RotateCcw size={24} className="text-white" />
                      </motion.div>
                      <h3 className="text-lg font-bold text-white mb-2 flex items-center justify-center gap-2">
                        Reverse Card Played!
                        <RotateCcw size={16} className="text-amber-400" />
                      </h3>
                      <p className="text-xs text-white/50 mb-2 max-w-xs leading-relaxed">
                        I&apos;ll answer this one myself when we meet in person.
                      </p>
                      <p className="text-[11px] text-white/30 italic mb-5">
                        No escaping it — you&apos;ll hear my answer face-to-face
                      </p>
                      <button
                        onClick={() => undoReverse(currentQuestion.id)}
                        className="text-[11px] text-amber-400/70 active:text-amber-400 underline underline-offset-2 transition-colors cursor-pointer"
                      >
                        Undo — I&apos;ll answer it myself
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-4">
                        <span
                          className={`
                            inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase
                            ${theme.tagColor}
                          `}
                        >
                          {currentQuestion.type === "text" ? <Pen size={10} /> : <MessageCircleHeart size={10} />}
                          {currentQuestion.type === "text" ? "Open" : "Pick One"}
                        </span>
                        {isTimeCapsule && (
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-bold uppercase ${theme.tagColor}`}>
                            <Lock size={9} />
                            Time Capsule
                          </span>
                        )}
                        <span className="ms-auto text-[10px] text-white/25 font-mono">
                          Q{currentQuestion.id}
                        </span>
                      </div>

                      <motion.h2
                        className="text-lg sm:text-xl font-bold text-white leading-snug mb-5"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.12, duration: 0.4 }}
                      >
                        {currentQuestion.question}
                      </motion.h2>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.22, duration: 0.4 }}
                      >
                        {currentQuestion.type === "text" ? (
                          <TextInput
                            value={currentAnswer}
                            onChange={(v) => setAnswer(currentQuestion.id, v)}
                            placeholder="Type your answer here..."
                            theme={theme}
                          />
                        ) : (
                          <MultipleChoice
                            options={currentQuestion.options!}
                            selected={currentAnswer}
                            onSelect={(v) => setAnswer(currentQuestion.id, v)}
                            theme={theme}
                          />
                        )}
                      </motion.div>
                    </>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Navigation ── */}
        <div className="mt-4 pb-4 shrink-0 flex items-center justify-between gap-3">
          <motion.button
            onClick={handlePrev}
            disabled={isFirst}
            className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-semibold text-white/60 glass active:scale-95 transition-all disabled:opacity-20 disabled:pointer-events-none cursor-pointer"
          >
            <ArrowLeft size={18} />
            Back
          </motion.button>

          <motion.button
            onClick={handleNext}
            disabled={!hasAnswer}
            className={`
              flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold text-white shadow-lg active:scale-95 transition-all cursor-pointer
              disabled:opacity-30 disabled:pointer-events-none
              ${theme.buttonGradient} ${theme.shadow}
            `}
          >
            {isLast ? (
              <>
                <Heart size={16} fill="currentColor" />
                Finish
              </>
            ) : isTimeCapsule ? (
              <>
                <Lock size={14} />
                Lock & Next
              </>
            ) : (
              <>
                Next
                <ArrowRight size={18} />
              </>
            )}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {showLevelIntro && (
          <LevelIntro
            key={`level-intro-${currentQuestion.category}`}
            category={currentQuestion.category}
            onContinue={() => setShowLevelIntro(false)}
          />
        )}
      </AnimatePresence>

      <HeartBurst trigger={heartBurstTrigger} />
      <LoveNote trigger={loveNoteTrigger} />
      <Toast message={toastMsg} visible={toastVisible} onDismiss={() => setToastVisible(false)} />
    </motion.div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────

function TextInput({
  value,
  onChange,
  placeholder,
  theme,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  theme: { ring: string; shadow: string; bgGradient: string; buttonGradient: string; tagColor: string };
}) {
  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className={`w-full px-4 py-3 bg-white/[0.06] border border-white/10 rounded-2xl text-white placeholder:text-white/25 focus:outline-none focus:ring-2 resize-none transition-all text-[15px] leading-relaxed ${theme.ring}`}
      />
      {value.length > 0 && (
        <span className="absolute bottom-3 end-3 text-[10px] text-white/20 tabular-nums">
          {value.length}
        </span>
      )}
    </div>
  );
}

function MultipleChoice({
  options,
  selected,
  onSelect,
  theme,
}: {
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
  theme: { ring: string; shadow: string; bgGradient: string; buttonGradient: string; tagColor: string };
}) {
  return (
    <div className="grid gap-2.5">
      {options.map((option, i) => {
        const isSelected = selected === option;
        return (
          <motion.button
            key={i}
            onClick={() => onSelect(option)}
            className={`
              relative flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-start font-medium active:scale-95 transition-all cursor-pointer
              ${
                isSelected
                  ? `${theme.bgGradient} text-white shadow-lg ${theme.shadow} ring-1 ${theme.ring.split(' ')[1]}`
                  : "bg-white/[0.06] text-white/70 border border-white/10"
              }
            `}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 * i, duration: 0.25 }}
          >
            <span className="text-[14px] leading-snug">{option}</span>
            {isSelected && (
              <motion.div
                className="absolute end-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <Check size={16} />
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
