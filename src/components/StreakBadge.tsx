'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { CheckCircle2, Flame } from 'lucide-react';

export interface StreakBadgeProps {
  streakDays: number;
  longestStreak: number;
  studiedToday: boolean;
  /** Increments when the learner completes a daily reading passage to trigger the celebration animation. */
  celebrationKey?: number;
  variant?: 'inline' | 'compact' | 'card';
  testId?: string;
}

const EMBER_PARTICLES = [
  { id: 'p1', dx: -9, dy: -13, color: '#A63816', delay: 0.02, size: 4 },
  { id: 'p2', dx: 8, dy: -15, color: '#D97706', delay: 0.08, size: 3.5 },
  { id: 'p3', dx: -3, dy: -18, color: '#287A52', delay: 0.14, size: 3.5 },
  { id: 'p4', dx: 11, dy: -9, color: '#A63816', delay: 0.18, size: 3 },
];

export const StreakBadge: React.FC<StreakBadgeProps> = ({
  streakDays,
  longestStreak,
  studiedToday,
  celebrationKey = 0,
  variant = 'inline',
  testId,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [isCelebrating, setIsCelebrating] = useState(false);
  const effectiveLongestStreak = Math.max(longestStreak, streakDays);

  useEffect(() => {
    if (!celebrationKey || celebrationKey <= 0) return;
    setIsCelebrating(true);
    const timer = setTimeout(() => {
      setIsCelebrating(false);
    }, 2400);
    return () => clearTimeout(timer);
  }, [celebrationKey]);

  const flameAnimation =
    isCelebrating && !prefersReducedMotion
      ? {
          scale: [1, 1.28, 1.06, 1.18, 1],
          rotate: [0, -12, 10, -6, 0],
          y: [0, -2.5, 0, -1, 0],
        }
      : { scale: 1, rotate: 0, y: 0 };

  const containerAnimation =
    isCelebrating && !prefersReducedMotion
      ? {
          scale: [1, 1.045, 0.995, 1.015, 1],
          boxShadow: [
            '0 0 0 0px rgba(40, 122, 82, 0)',
            '0 0 0 5px rgba(40, 122, 82, 0.18)',
            '0 0 0 8px rgba(166, 56, 22, 0.08)',
            '0 0 0 0px rgba(40, 122, 82, 0)',
          ],
        }
      : {
          scale: 1,
          boxShadow: '0 0 0 0px rgba(40, 122, 82, 0)',
        };

  if (variant === 'card') {
    return (
      <motion.article
        key={`streak-card-${celebrationKey}`}
        animate={containerAnimation}
        transition={{ duration: 0.95, ease: 'easeOut' }}
        data-testid={testId || 'streak-card'}
        data-celebrating={isCelebrating ? 'true' : 'false'}
        className={`relative flex items-center gap-4 rounded-2xl border p-5 transition-colors duration-500 ${
          isCelebrating
            ? 'border-[#287A52]/60 bg-[#E6F2EC]/45'
            : 'border-[#E3D7C3] bg-[#F2EDE3]'
        }`}
      >
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F7E9DC] text-[#A63816]">
          <motion.span
            animate={flameAnimation}
            transition={{ duration: 0.85, ease: 'easeOut' }}
            className="inline-flex items-center justify-center"
          >
            <Flame
              className={`h-6 w-6 transition-colors duration-300 ${
                studiedToday ? 'text-[#A63816] fill-[#A63816]/15' : 'text-[#A63816]'
              }`}
              aria-hidden="true"
            />
          </motion.span>

          <AnimatePresence>
            {isCelebrating &&
              !prefersReducedMotion &&
              EMBER_PARTICLES.map((p) => (
                <motion.span
                  key={`${celebrationKey}-${p.id}`}
                  initial={{ opacity: 0.95, x: 0, y: 0, scale: 0.6 }}
                  animate={{ opacity: 0, x: p.dx * 1.35, y: p.dy * 1.35, scale: 1.15 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.85, delay: p.delay, ease: 'easeOut' }}
                  style={{
                    width: p.size,
                    height: p.size,
                    backgroundColor: p.color,
                  }}
                  className="pointer-events-none absolute rounded-full"
                  aria-hidden="true"
                />
              ))}
          </AnimatePresence>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[#76675B]">
              Reading streak
            </p>
            <span className="font-mono-code text-[11px] font-semibold text-[#76675B] tabular-nums">
              Best: {effectiveLongestStreak} {effectiveLongestStreak === 1 ? 'day' : 'days'}
            </span>
          </div>
          <div className="mt-0.5 flex items-center gap-2">
            <motion.p
              key={`card-count-${streakDays}-${celebrationKey}`}
              initial={
                isCelebrating && !prefersReducedMotion
                  ? { y: 5, opacity: 0.5, scale: 1.08 }
                  : false
              }
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="font-display text-2xl font-bold text-[#171615] tabular-nums"
            >
              {streakDays} {streakDays === 1 ? 'day' : 'days'}
            </motion.p>
            {studiedToday && (
              <motion.span
                initial={
                  isCelebrating && !prefersReducedMotion ? { scale: 0.85, opacity: 0 } : false
                }
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.35, delay: 0.1 }}
                className="inline-flex items-center gap-1 rounded bg-[#E6F2EC] px-2 py-0.5 font-mono-code text-[10px] font-bold text-[#287A52]"
              >
                <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                {isCelebrating ? 'Daily goal complete!' : 'Studied today'}
              </motion.span>
            )}
          </div>
          <p className="mt-1 text-xs text-[#76675B]">
            {studiedToday
              ? 'Studied today — keep your reading rhythm going.'
              : streakDays > 0
              ? 'Finish a passage today to extend your streak.'
              : 'Finish a passage today to begin your streak.'}
          </p>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.span
      key={`streak-badge-${variant}-${celebrationKey}`}
      animate={containerAnimation}
      transition={{ duration: 0.9, ease: 'easeOut' }}
      data-testid={testId || 'dashboard-streak-badge'}
      data-celebrating={isCelebrating ? 'true' : 'false'}
      className={`relative inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold text-[#171615] transition-colors duration-500 ${
        isCelebrating
          ? 'border-[#287A52]/65 bg-[#E6F2EC]/55'
          : 'border-[#E3D7C3] bg-[#FFFDFA]'
      }`}
    >
      <span className="relative inline-flex items-center justify-center">
        <motion.span
          animate={flameAnimation}
          transition={{ duration: 0.85, ease: 'easeOut' }}
          className="inline-flex items-center justify-center"
        >
          <Flame
            className={`h-4 w-4 transition-colors duration-300 ${
              studiedToday ? 'text-[#A63816] fill-[#A63816]/20' : 'text-[#A63816]'
            }`}
            aria-hidden="true"
          />
        </motion.span>

        <AnimatePresence>
          {isCelebrating &&
            !prefersReducedMotion &&
            EMBER_PARTICLES.map((p) => (
              <motion.span
                key={`${celebrationKey}-${p.id}`}
                initial={{ opacity: 0.95, x: 0, y: 0, scale: 0.5 }}
                animate={{ opacity: 0, x: p.dx, y: p.dy, scale: 1.1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, delay: p.delay, ease: 'easeOut' }}
                style={{
                  width: p.size,
                  height: p.size,
                  backgroundColor: p.color,
                }}
                className="pointer-events-none absolute rounded-full"
                aria-hidden="true"
              />
            ))}
        </AnimatePresence>
      </span>

      <span>
        Streak:{' '}
        <motion.strong
          key={`inline-count-${streakDays}-${celebrationKey}`}
          initial={
            isCelebrating && !prefersReducedMotion
              ? { y: 4, opacity: 0.45, scale: 1.12 }
              : false
          }
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.38, ease: 'easeOut' }}
          className="inline-block font-mono-code text-[#A63816] tabular-nums"
        >
          {streakDays} {streakDays === 1 ? 'day' : 'days'}
        </motion.strong>
      </span>

      {variant !== 'compact' && (
        <span className="text-[#76675B] font-mono-code text-[11px] tabular-nums">
          (Best: {effectiveLongestStreak}d)
        </span>
      )}

      {studiedToday && (
        <motion.span
          initial={
            isCelebrating && !prefersReducedMotion ? { scale: 0.85, opacity: 0 } : false
          }
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.08 }}
          className="ml-1 inline-flex items-center gap-1 rounded bg-[#E6F2EC] px-1.5 py-0.5 font-mono-code text-[10px] font-bold text-[#287A52]"
        >
          {isCelebrating && <CheckCircle2 className="h-2.5 w-2.5" aria-hidden="true" />}
          <span>{isCelebrating ? 'Daily streak active!' : 'Studied today'}</span>
        </motion.span>
      )}
    </motion.span>
  );
};
