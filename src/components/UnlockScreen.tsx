'use client';

/**
 * UnlockScreen — Full-screen overlay displayed until the configured unlock date.
 *
 * Features:
 * - Dreamy gradient background with floating particles
 * - GSAP-animated lock icon (pulse + glow)
 * - Live countdown timer updating every second
 * - Smooth fade-out + scale transition via Framer Motion when the date arrives
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { SITE_CONFIG } from '@/config';

/* ─── helpers ─── */

/** Break remaining ms into days/hours/minutes/seconds */
function getTimeLeft(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

/** Pad a number to two digits */
const pad = (n: number) => String(n).padStart(2, '0');

/* ─── floating particle component ─── */

/** A single softly floating dot in the background */
function Particle({ delay, size, x }: { delay: number; size: number; x: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-white/20 pointer-events-none"
      style={{ width: size, height: size, left: `${x}%` }}
      initial={{ y: '110vh', opacity: 0 }}
      animate={{ y: '-10vh', opacity: [0, 0.6, 0] }}
      transition={{ duration: 12 + delay * 2, repeat: Infinity, delay, ease: 'linear' }}
    />
  );
}

/* ─── lock SVG icon with GSAP animation ─── */

function AnimatedLock() {
  const lockRef = useRef<SVGSVGElement>(null);
  const glowRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!lockRef.current) return;

    // Gentle floating pulse
    gsap.to(lockRef.current, {
      scale: 1.06,
      duration: 2.4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // Glow ring pulse
    if (glowRef.current) {
      gsap.fromTo(
        glowRef.current,
        { opacity: 0.3, scale: 0.95 },
        { opacity: 0.7, scale: 1.08, duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut' },
      );
    }

    return () => { gsap.killTweensOf(lockRef.current!); };
  }, []);

  return (
    <div className="relative flex items-center justify-center w-28 h-28 sm:w-36 sm:h-36">
      {/* Glow ring */}
      <g ref={glowRef}>
        <div className="absolute inset-0 rounded-full bg-pink-400/20 blur-2xl" />
      </g>

      {/* Lock icon */}
      <svg
        ref={lockRef}
        viewBox="0 0 24 24"
        fill="none"
        className="relative w-16 h-16 sm:w-20 sm:h-20 drop-shadow-lg"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Shackle */}
        <rect x="3" y="11" width="18" height="11" rx="2" className="fill-pink-200/30 text-white/80" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" className="text-white/80" />
        {/* Keyhole */}
        <circle cx="12" cy="16" r="1.5" className="fill-white/70" />
        <line x1="12" y1="17.5" x2="12" y2="19" className="text-white/70" />
      </svg>
    </div>
  );
}

/* ─── countdown unit tile ─── */

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <motion.span
        key={value}
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl sm:text-5xl font-bold tabular-nums text-white drop-shadow-md"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        {pad(value)}
      </motion.span>
      <span className="text-[10px] sm:text-xs uppercase tracking-widest text-white/60 mt-1">
        {label}
      </span>
    </div>
  );
}

/* ─── main component ─── */

interface UnlockScreenProps {
  onUnlock: () => void;
}

export default function UnlockScreen({ onUnlock }: UnlockScreenProps) {
  const unlockDate = SITE_CONFIG.UNLOCK_DATE;
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(unlockDate));
  const [unlocked, setUnlocked] = useState(false);

  // Pre-generate stable particle data (avoids re-renders)
  const particles = useRef(
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      delay: Math.random() * 8,
      size: 4 + Math.random() * 8,
      x: Math.random() * 100,
    })),
  ).current;

  // Tick the countdown every second
  useEffect(() => {
    const id = setInterval(() => {
      const left = getTimeLeft(unlockDate);
      setTimeLeft(left);

      // Check if we've reached zero
      if (left.days === 0 && left.hours === 0 && left.minutes === 0 && left.seconds === 0) {
        clearInterval(id);
        setUnlocked(true);
      }
    }, 1000);

    // Also handle the edge case where it's already past on mount
    if (getTimeLeft(unlockDate).days === 0 &&
        getTimeLeft(unlockDate).hours === 0 &&
        getTimeLeft(unlockDate).minutes === 0 &&
        getTimeLeft(unlockDate).seconds === 0) {
      setUnlocked(true);
    }

    return () => clearInterval(id);
  }, [unlockDate]);

  // Fire onUnlock after the exit animation completes
  const handleExitComplete = useCallback(() => {
    if (unlocked) onUnlock();
  }, [unlocked, onUnlock]);

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {!unlocked && (
        <motion.div
          key="unlock-overlay"
          exit={{ opacity: 0, scale: 1.08 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden select-none"
          style={{
            background:
              'radial-gradient(ellipse at 30% 20%, #fbc2eb 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, #a6c1ee 0%, transparent 50%), linear-gradient(135deg, #f5af19 0%, #f12711 100%)',
          }}
        >
          {/* ── floating particles ── */}
          {particles.map((p) => (
            <Particle key={p.id} {...p} />
          ))}

          {/* ── content ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative z-10 flex flex-col items-center gap-8 px-6"
          >
            <AnimatedLock />

            <h1
              className="text-2xl sm:text-4xl text-white text-center font-light tracking-wide"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Unlocks on{' '}
              <span className="font-semibold">
                {unlockDate.toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </h1>

            {/* Countdown */}
            <div className="flex items-center gap-4 sm:gap-8">
              <CountdownUnit value={timeLeft.days} label="Days" />
              <span className="text-2xl sm:text-4xl text-white/40 font-light">:</span>
              <CountdownUnit value={timeLeft.hours} label="Hours" />
              <span className="text-2xl sm:text-4xl text-white/40 font-light">:</span>
              <CountdownUnit value={timeLeft.minutes} label="Min" />
              <span className="text-2xl sm:text-4xl text-white/40 font-light">:</span>
              <CountdownUnit value={timeLeft.seconds} label="Sec" />
            </div>

            <p className="text-sm text-white/50 mt-4 tracking-wide">
              Something special is waiting for you ✨
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
