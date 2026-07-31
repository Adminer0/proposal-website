'use client';

/**
 * ConsentScreen — Full-screen overlay asking the user for recording consent.
 *
 * Features:
 * - Glassmorphism centered card over a gradient backdrop
 * - Framer Motion entrance animations (fade + slide + scale)
 * - 3 consent options: record (camera+mic), continue without, exit
 * - Handles getUserMedia permission flow with live status feedback
 * - Mobile-first responsive layout
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── types ─── */

export type ConsentMode = 'record' | 'no-record' | 'exit';

interface ConsentScreenProps {
  /** Callback fired when the user makes a choice */
  onConsent: (mode: ConsentMode) => void;
}

/* ─── permission status enum ─── */

type PermissionStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'error';

/* ─── animation variants ─── */

/** Stagger children into view */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.4 } },
};

/** Each child fades up */
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

/** Card entrance: scale up + fade */
const cardVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, scale: 0.9, y: -20, transition: { duration: 0.4 } },
};

/* ─── main component ─── */

export default function ConsentScreen({ onConsent }: ConsentScreenProps) {
  const [permStatus, setPermStatus] = useState<PermissionStatus>('idle');
  const [isExiting, setIsExiting] = useState(false);

  /**
   * Attempt to acquire camera + microphone permissions.
   * On success → fire onConsent('record').
   * On failure → show inline error, let user retry or choose another option.
   */
  const handleRecordClick = useCallback(async () => {
    setPermStatus('requesting');

    try {
      // Request both video and audio in a single getUserMedia call
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // Permission granted — stop tracks immediately (we just needed the permission)
      stream.getTracks().forEach((t) => t.stop());

      setPermStatus('granted');

      // Brief delay so user sees the "granted" feedback before transitioning
      setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => onConsent('record'), 500);
      }, 600);
    } catch (err: unknown) {
      // Distinguish between user denial and unexpected errors
      if (
        err instanceof DOMException &&
        (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError')
      ) {
        setPermStatus('denied');
      } else {
        setPermStatus('error');
      }
    }
  }, [onConsent]);

  /** Continue without recording — no permissions needed */
  const handleNoRecord = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => onConsent('no-record'), 500);
  }, [onConsent]);

  /** Exit entirely */
  const handleExit = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => onConsent('exit'), 500);
  }, [onConsent]);

  /* ── render ── */
  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key="consent-overlay"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none"
          /* Dreamy gradient backdrop matching the site's palette */
          style={{
            background:
              'radial-gradient(ellipse at 30% 20%, #fbc2eb 0%, transparent 50%), ' +
              'radial-gradient(ellipse at 70% 80%, #a6c1ee 0%, transparent 50%), ' +
              'linear-gradient(135deg, #f5af19 0%, #f12711 100%)',
          }}
        >
          {/* ── glassmorphism card ── */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="
              relative w-full max-w-md
              rounded-3xl
              bg-white/15 backdrop-blur-xl
              border border-white/25
              shadow-2xl shadow-black/20
              p-6 sm:p-8
              flex flex-col items-center gap-6
            "
          >
            {/* ── title ── */}
            <motion.h2
              variants={itemVariants}
              className="text-2xl sm:text-3xl font-semibold text-white text-center"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Before We Begin ❤️
            </motion.h2>

            {/* ── explanation ── */}
            <motion.p
              variants={itemVariants}
              className="text-sm sm:text-base text-white/80 text-center leading-relaxed"
            >
              We can record your reaction with your camera and microphone as a
              keepsake. This is <span className="font-semibold">entirely optional</span> —
              everything works perfectly without it.
            </motion.p>

            {/* ── permission status feedback ── */}
            <AnimatePresence mode="wait">
              {permStatus === 'requesting' && (
                <motion.div
                  key="status-requesting"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 text-sm text-yellow-200"
                >
                  <span className="inline-block w-4 h-4 border-2 border-yellow-200 border-t-transparent rounded-full animate-spin" />
                  Requesting camera &amp; mic access…
                </motion.div>
              )}

              {permStatus === 'granted' && (
                <motion.div
                  key="status-granted"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-green-300 font-medium"
                >
                  ✅ Permission granted — starting recording…
                </motion.div>
              )}

              {permStatus === 'denied' && (
                <motion.div
                  key="status-denied"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-red-300 text-center"
                >
                  ⚠️ Camera/mic access was denied. You can try again or continue
                  without recording.
                </motion.div>
              )}

              {permStatus === 'error' && (
                <motion.div
                  key="status-error"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-red-300 text-center"
                >
                  ❌ Something went wrong accessing your devices. Please check
                  your browser settings or continue without recording.
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── action buttons ── */}
            <motion.div variants={itemVariants} className="flex flex-col gap-3 w-full">
              {/* Primary: Record My Reaction */}
              <button
                onClick={handleRecordClick}
                disabled={permStatus === 'requesting'}
                className="
                  w-full py-3 px-6 rounded-2xl
                  bg-white text-pink-600 font-semibold text-base
                  shadow-lg shadow-pink-500/25
                  hover:bg-pink-50 hover:shadow-pink-500/40
                  active:scale-[0.97]
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200
                  cursor-pointer
                "
              >
                🎥 Record My Reaction
              </button>

              {/* Secondary: Continue Without Recording */}
              <button
                onClick={handleNoRecord}
                className="
                  w-full py-3 px-6 rounded-2xl
                  bg-white/10 text-white font-medium text-base
                  border border-white/25
                  hover:bg-white/20
                  active:scale-[0.97]
                  transition-all duration-200
                  cursor-pointer
                "
              >
                Continue Without Recording
              </button>

              {/* Ghost: Exit */}
              <button
                onClick={handleExit}
                className="
                  w-full py-2.5 px-6 rounded-2xl
                  bg-transparent text-white/50 font-medium text-sm
                  hover:text-white/80 hover:bg-white/5
                  active:scale-[0.97]
                  transition-all duration-200
                  cursor-pointer
                "
              >
                Exit
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
