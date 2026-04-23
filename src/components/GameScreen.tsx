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
  type MultipleChoiceQuestion,
} from "@/lib/questions";
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
    useReverseCard,
    undoReverse,
  } = useGameStore();

  const [direction, setDirection] = useState(1);
  const [isFlipping, setIsFlipping] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [heartBurstTrigger, setHeartBurstTrigger] = useState(0);
  const [loveNoteTrigger, setLoveNoteTrigger] = useState(0);
  const [showLevelIntro, setShowLevelIntro] = useState(true);
  const seenLevelsRef = useRef<Set<number>>(new Set([1]));

  const currentQuestion: Question = questions[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === questions.length - 1;
  const currentAnswer = answers[currentQuestion.id] || "";
  const isReversed = reversed.has(currentQuestion.id);
  const hasAnswer = currentAnswer.trim().length > 0 || isReversed;
  const isTimeCapsule = currentQuestion.level === 5;
  const levelMeta = levels[currentQuestion.level - 1];

  // ─── Handlers ────────────────────────────────────────────────────

  const handleNext = useCallback(() => {
    if (!hasAnswer) return;

    setHeartBurstTrigger((t) => t + 1);
    setLoveNoteTrigger((t) => t + 1);

    if (isTimeCapsule && !isReversed) {
      setToastMsg("تم قفل الإجابة! سنكشف عنها عند لقائنا وجهاً لوجه.");
      setToastVisible(true);
    }

    setDirection(1);
    
    if (!isLast) {
      const nextIndex = currentIndex + 1;
      const nextQuestion = questions[nextIndex];

      if (nextQuestion.level !== currentQuestion.level) {
        const nextLevel = nextQuestion.level;
        if (!seenLevelsRef.current.has(nextLevel)) {
          seenLevelsRef.current.add(nextLevel);
          setTimeout(() => {
            goNext();
            setShowLevelIntro(true);
          }, 400);
          return;
        }
      }
    }
    
    goNext();
  }, [hasAnswer, isTimeCapsule, isReversed, isLast, currentIndex, currentQuestion.level, goNext]);

  const handlePrev = useCallback(() => {
    if (isFirst) return;
    setDirection(-1);
    goPrev();
  }, [isFirst, goPrev]);

  const handleUseReverseCard = useCallback(() => {
    if (reverseCardsLeft <= 0 || isReversed) return;

    setIsFlipping(true);
    setTimeout(() => {
      useReverseCard(currentQuestion.id);
      setIsFlipping(false);
    }, 600);
  }, [reverseCardsLeft, isReversed, currentQuestion.id, useReverseCard]);

  // ─── Render ──────────────────────────────────────────────────────

  const levelStart = questions.findIndex((q) => q.level === currentQuestion.level);
  const levelEnd = questions.filter((q) => q.level === currentQuestion.level).length;
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
        style={{ background: `radial-gradient(ellipse at top, ${levelMeta.accentHex}, transparent 70%)` }}
      />
      <div
        className="fixed bottom-0 inset-x-0 h-[30vh] pointer-events-none opacity-10 blur-[100px] transition-all duration-1000"
        style={{ background: `radial-gradient(ellipse at bottom, ${levelMeta.accentHex}, transparent 70%)` }}
      />

      <div className="relative z-10 w-full max-w-lg flex flex-col h-full max-h-full">
        {/* ── Header ── */}
        <div className="mb-4 shrink-0">
          <VibeMeter total={questions.length} level={currentQuestion.level} />

          <div className="flex items-center justify-between mt-3">
            <div className="text-xs text-white/30 font-medium flex items-center gap-1.5">
              <IconFromName name={levelMeta.icon} size={13} className="text-white/40" />
              <span className="hidden sm:inline">{levelMeta.title}</span>
              <span className="sm:hidden">الفصل {currentQuestion.level}</span>
              <span className="text-white/15 mx-1">·</span>
              <span className="text-white/20" dir="ltr">{posInLevel} / {levelEnd}</span>
            </div>
            <button
              onClick={handleUseReverseCard}
              disabled={reverseCardsLeft <= 0 || isReversed || isFlipping}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass text-xs font-semibold text-white/70 active:scale-95 transition-transform disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <RotateCcw size={14} className="text-amber-400" />
              <span>{reverseCardsLeft}</span>
              <span className="hidden sm:inline">تخطي</span>
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
                        استخدمتِ بطاقة تخطي!
                        <RotateCcw size={16} className="text-amber-400" />
                      </h3>
                      <p className="text-xs text-white/50 mb-2 max-w-xs leading-relaxed">
                        سأجيب أنا على هذا السؤال عندما نلتقي شخصياً.
                      </p>
                      <p className="text-[11px] text-white/30 italic mb-5">
                        لا مفر — ستسمعين الإجابة وجهاً لوجه
                      </p>
                      <button
                        onClick={() => undoReverse(currentQuestion.id)}
                        className="text-[11px] text-amber-400/70 active:text-amber-400 underline underline-offset-2 transition-colors cursor-pointer"
                      >
                        تراجع — سأجيب بنفسي
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-4">
                        <span
                          className={`
                            inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider
                            ${isTimeCapsule
                              ? "bg-red-500/20 text-red-300 ring-1 ring-red-500/30"
                              : "bg-white/10 text-white/60"
                            }
                          `}
                        >
                          {currentQuestion.type === "text" ? <Pen size={10} /> : <MessageCircleHeart size={10} />}
                          {currentQuestion.type === "text" ? "كتابي" : "اختياري"}
                        </span>
                        {isTimeCapsule && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-bold bg-red-500/20 text-red-300 ring-1 ring-red-500/30">
                            <Lock size={9} />
                            كبسولة الزمن
                          </span>
                        )}
                        <span className="me-auto text-[10px] text-white/25 font-mono" dir="ltr">
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
                            placeholder={currentQuestion.placeholder}
                          />
                        ) : (
                          <MultipleChoice
                            question={currentQuestion as MultipleChoiceQuestion}
                            selected={currentAnswer}
                            onSelect={(v) => setAnswer(currentQuestion.id, v)}
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
            <ArrowRight size={18} />
            السابق
          </motion.button>

          <motion.button
            onClick={handleNext}
            disabled={!hasAnswer}
            className={`
              flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold text-white shadow-lg active:scale-95 transition-all cursor-pointer
              disabled:opacity-30 disabled:pointer-events-none
              ${isTimeCapsule
                ? "bg-gradient-to-l from-red-600 to-rose-600 shadow-red-600/30"
                : "bg-gradient-to-l from-rose-500 to-pink-500 shadow-rose-500/30"
              }
            `}
          >
            {isLast ? (
              <>
                <Heart size={16} fill="currentColor" />
                إنهاء
              </>
            ) : isTimeCapsule ? (
              <>
                <Lock size={14} />
                قفل والتالي
              </>
            ) : (
              <>
                <ArrowLeft size={18} />
                التالي
              </>
            )}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {showLevelIntro && (
          <LevelIntro
            key={`level-intro-${currentQuestion.level}`}
            level={currentQuestion.level}
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
        className="w-full px-4 py-3 bg-white/[0.06] border border-white/10 rounded-2xl text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-rose-500/50 resize-none transition-all text-[15px] leading-relaxed"
      />
      {value.length > 0 && (
        <span className="absolute bottom-3 end-3 text-[10px] text-white/20 tabular-nums" dir="ltr">
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
              relative flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-start font-medium active:scale-95 transition-all cursor-pointer
              ${
                isSelected
                  ? "bg-gradient-to-r from-rose-500/90 to-pink-500/90 text-white shadow-lg shadow-rose-500/20 ring-1 ring-rose-400/30"
                  : "bg-white/[0.06] text-white/70 border border-white/10"
              }
            `}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 * i, duration: 0.25 }}
          >
            <IconFromName
              name={option.icon}
              size={18}
              className={isSelected ? "text-white/90" : "text-white/40"}
            />
            <span className="text-[14px] leading-snug">{option.label}</span>
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
