'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Activity, Heart, Gamepad2, Trophy,
  MessageCircle, Send, CheckCircle2, Clock,
} from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { notifyOwner } from '@/lib/notify';
import { softTap } from '@/lib/useHaptics';

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  const hr = Math.floor(diff / 3600000);
  const day = Math.floor(diff / 86400000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  if (hr < 24) return `${hr}h ago`;
  return `${day}d ago`;
}

const typeIcons: Record<string, { icon: React.ReactNode; color: string }> = {
  'mini-game': { icon: <Gamepad2 size={13} />, color: 'text-violet-300 bg-violet-500/20' },
  'milestone': { icon: <Trophy size={13} />, color: 'text-amber-300 bg-amber-500/20' },
  'kiss-jar': { icon: <Heart size={13} fill="currentColor" />, color: 'text-rose-300 bg-rose-500/20' },
  'mood': { icon: <Activity size={13} />, color: 'text-sky-300 bg-sky-500/20' },
};

export default function ActivityDashboardScreen() {
  const {
    setPhase, activityLog,
    answers, reversed, currentMood,
  } = useGameStore();

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const totalAnswered = Object.values(answers).filter((v) => v?.trim()).length + reversed.length;
  const moodText = currentMood ?? 'Not set';

  const handleSendReport = async () => {
    softTap();
    setSending(true);
    const last5 = activityLog
      .slice(0, 5)
      .map((e) => `• ${e.label} (${timeAgo(e.ts)})`)
      .join('\n');

    const report =
      `📊 <b>Your Angel's Full Activity Report</b>\n\n` +
      `❤️ Questions answered: <b>${totalAnswered}/70</b>\n` +
      `🌙 Current mood: <b>${moodText}</b>\n` +
      `📝 Total logged events: <b>${activityLog.length}</b>\n\n` +
      `<b>Recent Activity:</b>\n${last5 || 'No activity yet.'}`;

    notifyOwner(report);
    setSending(false);
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-violet-600/8 blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-10 pb-4 shrink-0">
        <button
          onClick={() => setPhase('home')}
          className="glass flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-white/60 transition-transform cursor-pointer"
        >
          <ArrowLeft size={16} />
          Map
        </button>
        <div className="text-center">
          <p className="text-[11px] text-violet-300 uppercase tracking-widest font-bold flex items-center gap-1 justify-center">
            <Activity size={11} /> Activity Log
          </p>
        </div>
        <div className="w-16" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8 relative z-10">
        <div className="max-w-sm mx-auto flex flex-col gap-4 pt-2">

          {/* Stats overview */}
          <div className="grid grid-cols-2 gap-2.5">
            <StatCard
              icon={<MessageCircle size={18} className="text-rose-300" />}
              bg="bg-rose-500/15 border-rose-400/20"
              label="Questions"
              value={`${totalAnswered}/70`}
              sub={`${Math.round((totalAnswered / 70) * 100)}% complete`}
            />
            <StatCard
              icon={<Activity size={18} className="text-violet-300" />}
              bg="bg-violet-500/15 border-violet-400/20"
              label="Mini-games"
              value={String(activityLog.filter(e => e.type === 'mini-game').length)}
              sub="games played"
            />
            <StatCard
              icon={<Trophy size={18} className="text-amber-300" />}
              bg="bg-amber-500/15 border-amber-400/20"
              label="Events"
              value={String(activityLog.length)}
              sub="total actions logged"
            />
          </div>

          {/* Current mood */}
          {currentMood && (
            <div className="glass-premium rounded-2xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 flex items-center justify-center shrink-0">
                <Heart size={16} fill="currentColor" className="text-rose-400" />
              </div>
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-widest">Current Mood</p>
                <p className="text-[14px] font-bold text-white">{moodText}</p>
              </div>
            </div>
          )}

          {/* Send report button */}
          <motion.button
            onClick={handleSendReport}
            disabled={sending}
            className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-transform cursor-pointer disabled:opacity-60 relative overflow-hidden"
            style={{
              background: sent
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              boxShadow: sent
                ? '0 8px 32px rgba(16,185,129,0.3)'
                : '0 8px 32px rgba(139,92,246,0.3)',
            }}
            
          >
            {sent ? (
              <>
                <CheckCircle2 size={16} /> Report Sent!
              </>
            ) : sending ? (
              <>
                <Send size={16} className="animate-pulse" /> Sending...
              </>
            ) : (
              <>
                <Send size={16} /> Send Full Report to Telegram
              </>
            )}
          </motion.button>

          {/* Activity timeline */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock size={12} className="text-white/30" />
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Timeline</span>
            </div>

            {activityLog.length === 0 ? (
              <div className="glass rounded-2xl p-6 text-center">
                <p className="text-white/30 text-sm">No activity yet. She is about to start.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {activityLog.map((entry, idx) => {
                  const meta = typeIcons[entry.type] ?? {
                    icon: <Activity size={13} />,
                    color: 'text-white/50 bg-white/10',
                  };
                  return (
                    <motion.div
                      key={idx}
                      className="glass rounded-xl px-4 py-3 flex items-center gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${meta.color}`}>
                        {meta.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-white/80 font-medium truncate">{entry.label}</p>
                      </div>
                      <span className="text-[10px] text-white/25 shrink-0">{timeAgo(entry.ts)}</span>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </motion.div>
  );
}

function StatCard({
  icon, bg, label, value, sub,
}: {
  icon: React.ReactNode;
  bg: string;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className={`glass-premium rounded-2xl p-4 border ${bg}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-2xl font-extrabold text-white leading-none">{value}</p>
      <p className="text-[10px] text-white/30 mt-1">{sub}</p>
    </div>
  );
}
