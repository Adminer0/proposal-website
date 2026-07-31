'use client';

/**
 * RecordingIndicator — Fixed top-right glassmorphism pill showing recording state.
 *
 * Features:
 * - Red pulsing dot + "REC" label + live elapsed-time timer (MM:SS)
 * - Timer driven by `startTime` prop via setInterval (1-second tick)
 * - Only renders when `isRecording` is true
 * - Framer Motion entrance/exit animations
 * - Mobile-first responsive sizing
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── types ─── */

interface RecordingIndicatorProps {
  /** Whether the recording is actively running */
  isRecording: boolean;
  /** The moment recording began — used to compute elapsed time */
  startTime: Date | null;
}

/* ─── helpers ─── */

/** Format elapsed milliseconds as MM:SS */
function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/* ─── animation variants ─── */

const pillVariants = {
  hidden: { opacity: 0, x: 40, scale: 0.8 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
  exit: {
    opacity: 0,
    x: 40,
    scale: 0.8,
    transition: { duration: 0.3, ease: 'easeIn' },
  },
};

/* ─── component ─── */

export default function RecordingIndicator({ isRecording, startTime }: RecordingIndicatorProps) {
  const [elapsed, setElapsed] = useState('00:00');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── tick the timer every second while recording ── */
  useEffect(() => {
    // Clear any previous interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!isRecording || !startTime) {
      setElapsed('00:00');
      return;
    }

    // Compute initial elapsed time immediately
    setElapsed(formatElapsed(Date.now() - startTime.getTime()));

    // Then update every second
    intervalRef.current = setInterval(() => {
      setElapsed(formatElapsed(Date.now() - startTime.getTime()));
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRecording, startTime]);

  /* ── render ── */
  return (
    <AnimatePresence>
      {isRecording && startTime && (
        <motion.div
          key="recording-indicator"
          variants={pillVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="
            fixed top-4 right-4 z-[100]
            flex items-center gap-2
            px-3.5 py-1.5
            rounded-full
            bg-black/40 backdrop-blur-lg
            border border-white/15
            shadow-lg shadow-black/30
            select-none pointer-events-none
          "
          /* Accessible label for screen readers */
          role="status"
          aria-live="polite"
          aria-label={`Recording for ${elapsed}`}
        >
          {/* Pulsing red dot */}
          <span className="relative flex h-2.5 w-2.5">
            {/* Outer pulse ring */}
            <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
            {/* Solid dot */}
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
          </span>

          {/* REC label */}
          <span className="text-xs font-bold tracking-wider text-red-400 uppercase">
            REC
          </span>

          {/* Elapsed timer */}
          <span
            className="text-xs font-mono tabular-nums text-white/90"
            aria-hidden="true"
          >
            {elapsed}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
