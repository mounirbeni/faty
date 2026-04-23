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
import {
  questions,
  levels,
  type Question,
  type Answer,
  type MultipleChoiceQuestion,
} from "@/lib/questions";
import VibeMeter from "./ProgressBar";
import Toast from "./Toast";
import IconFromName from "./IconFromName";
import LevelIntro from "./LevelIntro";
import HeartBurst from "./HeartBurst";
import LoveNote from "./LoveNote";

// ─── Constants ───────────────────────────────────────────────────────

const MAX_REVERSE_CARDS = 3;

// ─── Animation variants ─────────────────────────────────────────────

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

const flipVariants = {
  initial: { rotateY: 0 },
  flipped: { rotateY: 180 },
  back: { rotateY: 360 },
};

// ─── Props ───────────────────────────────────────────────────────────

interface GameScreenProps {
  onComplete: (answers: Answer[]) => void;
}

// ─── Component ───────────────────────────────────────────────────────

export default function GameScreen({ onComplete }: GameScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [reversed, setReversed] = useState<Set<number>>(new Set());
  const [reverseCardsLeft, setReverseCardsLeft] = useState(MAX_REVERSE_CARDS);
  const [direction, setDirection] = useState(1);
  const [isFlipping, setIsFlipping] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [heartBurstTrigger, setHeartBurstTrigger] = useState(0);
  const [loveNoteTrigger, setLoveNoteTrigger] = useState(0);
  const [showLevelIntro, setShowLevelIntro] = useState(true); // show for level 1 on mount
  const seenLevelsRef = useRef<Set<number>>(new Set([1])); // track which level intros we've shown

  const currentQuestion: Question = questions[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === questions.length - 1;
  const currentAnswer = answers[currentQuestion.id] || "";
  const isReversed = reversed.has(currentQuestion.id);
  const hasAnswer = currentAnswer.trim().length > 0 || isReversed;
  const isTimeCapsule = currentQuestion.level === 5;
  const levelMeta = levels[currentQuestion.level - 1];

  // ─── Handlers ────────────────────────────────────────────────────

  const setAnswer = useCallback(
    (value: string) => {
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
    },
    [currentQuestion.id]
  );

  const goNext = useCallback(() => {
    if (!hasAnswer) return;

    // Heart burst + love note
    setHeartBurstTrigger((t) => t + 1);
    setLoveNoteTrigger((t) => t + 1);

    // Time Capsule toast on Level 5
    if (isTimeCapsule && !isReversed) {
      setToastMsg("Answer locked! It will only be revealed when we meet face-to-face.");
      setToastVisible(true);
    }

    setDirection(1);
    if (isLast) {
      const allAnswers: Answer[] = questions.map((q) => ({
        questionId: q.id,
        value: answers[q.id] || "",
        reversed: reversed.has(q.id),
      }));
      onComplete(allAnswers);
    } else {
      const nextIndex = currentIndex + 1;
      const nextQuestion = questions[nextIndex];

      // Check if we're entering a new level
      if (nextQuestion.level !== currentQuestion.level) {
        const nextLevel = nextQuestion.level;
        if (!seenLevelsRef.current.has(nextLevel)) {
          seenLevelsRef.current.add(nextLevel);
          // Delay transition to let heart burst play
          setTimeout(() => {
            setCurrentIndex(nextIndex);
            setShowLevelIntro(true);
          }, 400);
          return;
        }
      }

      setCurrentIndex(nextIndex);
    }
  }, [hasAnswer, isTimeCapsule, isReversed, isLast, answers, reversed, onComplete, currentIndex, currentQuestion.level]);

  const goPrev = useCallback(() => {
    if (isFirst) return;
    setDirection(-1);
    setCurrentIndex((i) => i - 1);
  }, [isFirst]);

  const useReverseCard = useCallback(() => {
    if (reverseCardsLeft <= 0 || isReversed) return;

    setIsFlipping(true);
    setTimeout(() => {
      setReversed((prev) => new Set(prev).add(currentQuestion.id));
      setReverseCardsLeft((c) => c - 1);
      setIsFlipping(false);
    }, 600);
  }, [reverseCardsLeft, isReversed, currentQuestion.id]);

  const undoReverse = useCallback(() => {
    setReversed((prev) => {
      const next = new Set(prev);
      next.delete(currentQuestion.id);
      return next;
    });
    setReverseCardsLeft((c) => c + 1);
  }, [currentQuestion.id]);

  // ─── Question position within level ──────────────────────────────

  const levelStart = questions.findIndex((q) => q.level === currentQuestion.level);
  const levelEnd = questions.filter((q) => q.level === currentQuestion.level).length;
  const posInLevel = currentIndex - levelStart + 1;

  // ─── Render ──────────────────────────────────────────────────────

  return (
    <motion.div
      className="relative min-h-dvh flex flex-col items-center px-4 pt-6 pb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Ambient glow based on level */}
      <div
        className="fixed top-0 inset-x-0 h-[60vh] pointer-events-none opacity-25 blur-[120px] transition-all duration-1000"
        style={{ background: `radial-gradient(ellipse at top, ${levelMeta.accentHex}, transparent 70%)` }}
      />

      {/* Subtle bottom glow */}
      <div
        className="fixed bottom-0 inset-x-0 h-[30vh] pointer-events-none opacity-10 blur-[100px] transition-all duration-1000"
        style={{ background: `radial-gradient(ellipse at bottom, ${levelMeta.accentHex}, transparent 70%)` }}
      />

      <div className="relative z-10 w-full max-w-lg flex flex-col flex-1">
        {/* ── Header: Vibe Meter + Reverse Cards ── */}
        <div className="mb-5">
          <VibeMeter
            current={currentIndex}
            total={questions.length}
            level={currentQuestion.level}
          />

          {/* Level label + Reverse Card */}
          <div className="flex items-center justify-between mt-3">
            <div className="text-xs text-white/30 font-medium flex items-center gap-1.5">
              <IconFromName name={levelMeta.icon} size={13} className="text-white/40" />
              <span className="hidden sm:inline">{levelMeta.title}</span>
              <span className="sm:hidden">Lvl {currentQuestion.level}</span>
              <span className="text-white/15 mx-1">·</span>
              <span className="text-white/20">{posInLevel}/{levelEnd}</span>
            </div>
            <button
              onClick={useReverseCard}
              disabled={reverseCardsLeft <= 0 || isReversed || isFlipping}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              title="Use a Reverse Card to skip this question"
            >
              <RotateCcw size={14} className="text-amber-400" />
              <span>{reverseCardsLeft}</span>
              <span className="hidden sm:inline">Reverse</span>
            </button>
          </div>
        </div>

        {/* ── Question Card ── */}
        <div className="flex-1 flex items-start justify-center">
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
              className="w-full"
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
                    rounded-3xl p-6 sm:p-8 shadow-2xl
                    ${isTimeCapsule
                      ? "glass-warm ring-1 ring-red-500/20 shadow-red-500/10"
                      : "glass-strong shadow-black/20"
                    }
                  `}
                >
                  {isReversed ? (
                    /* ── Reversed State ── */
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 12 }}
                        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-5 shadow-lg shadow-amber-500/30"
                      >
                        <RotateCcw size={28} className="text-white" />
                      </motion.div>
                      <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                        Reverse Card Played!
                        <RotateCcw size={18} className="text-amber-400" />
                      </h3>
                      <p className="text-sm text-white/50 mb-2 max-w-xs">
                        This one is for me to answer when we meet in person.
                      </p>
                      <p className="text-xs text-white/30 italic mb-6">
                        No escaping it — you&apos;ll hear my answer face-to-face
                      </p>
                      <button
                        onClick={undoReverse}
                        className="text-xs text-amber-400/70 hover:text-amber-400 underline underline-offset-2 transition-colors cursor-pointer"
                      >
                        Undo — I&apos;ll answer it myself
                      </button>
                    </div>
                  ) : (
                    /* ── Normal Question ── */
                    <>
                      {/* Type badge + Time Capsule indicator */}
                      <div className="flex items-center gap-2 mb-5">
                        <span
                          className={`
                            inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider
                            ${isTimeCapsule
                              ? "bg-red-500/20 text-red-300 ring-1 ring-red-500/30"
                              : "bg-white/10 text-white/60"
                            }
                          `}
                        >
                          {currentQuestion.type === "text" ? (
                            <Pen size={11} />
                          ) : (
                            <MessageCircleHeart size={11} />
                          )}
                          {currentQuestion.type === "text" ? "Open" : "Pick One"}
                        </span>
                        {isTimeCapsule && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-red-500/20 text-red-300 ring-1 ring-red-500/30">
                            <Lock size={10} />
                            Time Capsule
                          </span>
                        )}
                        <span className="ms-auto text-[11px] text-white/25 font-mono">
                          Q{currentQuestion.id}
                        </span>
                      </div>

                      {/* Question */}
                      <motion.h2
                        className="text-xl sm:text-2xl font-bold text-white leading-snug mb-6"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.12, duration: 0.4 }}
                      >
                        {currentQuestion.question}
                      </motion.h2>

                      {/* Input */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.22, duration: 0.4 }}
                      >
                        {currentQuestion.type === "text" ? (
                          <TextInput
                            value={currentAnswer}
                            onChange={setAnswer}
                            placeholder={currentQuestion.placeholder}
                          />
                        ) : (
                          <MultipleChoice
                            question={currentQuestion as MultipleChoiceQuestion}
                            selected={currentAnswer}
                            onSelect={setAnswer}
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
        <div className="mt-6 flex items-center justify-between gap-4">
          <motion.button
            onClick={goPrev}
            disabled={isFirst}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white/60 glass hover:bg-white/10 transition-all disabled:opacity-20 disabled:pointer-events-none cursor-pointer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <ArrowRight size={16} />
            Back
          </motion.button>

          <motion.button
            onClick={goNext}
            disabled={!hasAnswer}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white shadow-lg transition-all cursor-pointer
              disabled:opacity-30 disabled:pointer-events-none
              ${isTimeCapsule
                ? "bg-gradient-to-r from-red-600 to-rose-600 shadow-red-600/30 hover:shadow-red-500/50"
                : "bg-gradient-to-r from-rose-500 to-pink-500 shadow-rose-500/30 hover:shadow-rose-400/50"
              }
            `}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
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
                <ArrowLeft size={16} />
                Next
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Level Intro Overlay */}
      <AnimatePresence>
        {showLevelIntro && (
          <LevelIntro
            key={`level-intro-${currentQuestion.level}`}
            level={currentQuestion.level}
            onContinue={() => setShowLevelIntro(false)}
          />
        )}
      </AnimatePresence>

      {/* Heart Burst Effect */}
      <HeartBurst trigger={heartBurstTrigger} />

      {/* Love Note */}
      <LoveNote trigger={loveNoteTrigger} />

      {/* Time Capsule Toast */}
      <Toast
        message={toastMsg}
        visible={toastVisible}
        onDismiss={() => setToastVisible(false)}
      />
    </motion.div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full px-4 py-3 bg-white/[0.06] border border-white/10 rounded-2xl text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-transparent resize-none transition-all text-base leading-relaxed"
      />
      {value.length > 0 && (
        <span className="absolute bottom-3 start-3 text-[11px] text-white/20 tabular-nums">
          {value.length}
        </span>
      )}
    </div>
  );
}

function MultipleChoice({
  question,
  selected,
  onSelect,
}: {
  question: MultipleChoiceQuestion;
  selected: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="grid gap-2.5">
      {question.options.map((option, i) => {
        const isSelected = selected === option.id;
        return (
          <motion.button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={`
              relative flex items-center gap-3 w-full px-5 py-3.5 rounded-2xl text-start font-medium transition-all cursor-pointer
              ${
                isSelected
                  ? "bg-gradient-to-r from-rose-500/90 to-pink-500/90 text-white shadow-lg shadow-rose-500/20 ring-1 ring-rose-400/30"
                  : "bg-white/[0.06] text-white/70 border border-white/10 hover:bg-white/10 hover:border-white/15"
              }
            `}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 * i, duration: 0.25 }}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
          >
            <IconFromName
              name={option.icon}
              size={18}
              className={isSelected ? "text-white/90" : "text-white/40"}
            />
            <span className="text-sm sm:text-[15px]">{option.label}</span>
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
