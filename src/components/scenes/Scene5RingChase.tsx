'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

interface Props { onComplete: () => void; }

/** Scene 5 — Tap the eagle chase game */
export default function Scene5RingChase({ onComplete }: Props) {
  const [taps, setTaps] = useState(0);
  const [escaped, setEscaped] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const eagleRef = useRef<HTMLDivElement>(null);
  const hasCompleted = useRef(false);
  const maxTaps = 13 + Math.floor(Math.random() * 3); // 13-15

  // Eagle movement
  useEffect(() => {
    if (!eagleRef.current || escaped) return;
    const el = eagleRef.current;

    const moveEagle = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      gsap.to(el, {
        x: Math.random() * (vw - 120) + 20,
        y: Math.random() * (vh - 200) + 60,
        duration: Math.max(0.6, 1.5 - taps * 0.05),
        ease: 'power1.inOut',
        onComplete: () => {
          if (!escaped) moveEagle();
        }
      });
    };

    moveEagle();
    return () => { gsap.killTweensOf(el); };
  }, [taps, escaped]);

  const handleTap = useCallback(() => {
    if (escaped) return;
    const newTaps = taps + 1;
    setTaps(newTaps);

    // Dodge animation
    if (eagleRef.current) {
      gsap.to(eagleRef.current, {
        rotation: Math.random() * 30 - 15,
        scale: 1.1,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
      });
    }

    if (newTaps >= maxTaps) {
      setEscaped(true);
      // Dramatic flyaway
      if (eagleRef.current) {
        gsap.to(eagleRef.current, {
          y: -300,
          x: window.innerWidth / 2,
          scale: 0.3,
          duration: 1.5,
          ease: 'power2.in',
          onComplete: () => {
            setShowMessage(true);
            setTimeout(() => {
              if (!hasCompleted.current) { hasCompleted.current = true; onComplete(); }
            }, 3000);
          }
        });
      }
    }
  }, [taps, escaped, maxTaps, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 cursor-pointer select-none"
      style={{ background: 'linear-gradient(180deg, #87CEEB 0%, #B0E0E6 40%, #98FB98 100%)' }}
      onClick={handleTap}
    >
      {/* Instruction */}
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-8 text-xl font-bold text-gray-700"
      >
        Tap the eagle to retrieve the ring! 🦅
      </motion.p>

      {/* Tap counter */}
      <motion.div
        className="absolute top-4 right-4 glass px-4 py-2 rounded-full"
        key={taps}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.2 }}
      >
        <span className="text-sm font-semibold text-gray-600">Taps: {taps}</span>
      </motion.div>

      {/* Eagle */}
      {!escaped && (
        <div ref={eagleRef} className="absolute" style={{ top: '30%', left: '40%' }}>
          <svg width="90" height="70" viewBox="0 0 100 80">
            {/* Body */}
            <ellipse cx="50" cy="45" rx="22" ry="14" fill="#8B4513" />
            <ellipse cx="50" cy="45" rx="18" ry="10" fill="#A0522D" />
            {/* Head */}
            <circle cx="72" cy="36" r="11" fill="#D2691E" />
            {/* Beak */}
            <polygon points="83,36 94,40 83,42" fill="#FFD700" />
            {/* Eye */}
            <circle cx="76" cy="34" r="2.5" fill="white" />
            <circle cx="77" cy="34" r="1.5" fill="black" />
            {/* Crown feathers */}
            <path d="M68 28 L70 22 L74 30" fill="#D2691E" />
            {/* Wings */}
            <motion.path
              d="M28 45 Q5 20 2 35 Q12 22 28 40"
              fill="#6D4C41"
              animate={{ d: ['M28 45 Q5 20 2 35 Q12 22 28 40', 'M28 45 Q5 55 2 30 Q12 42 28 40', 'M28 45 Q5 20 2 35 Q12 22 28 40'] }}
              transition={{ duration: 0.25, repeat: Infinity }}
            />
            <motion.path
              d="M28 45 Q50 15 65 28 Q48 20 28 42"
              fill="#6D4C41"
              animate={{ d: ['M28 45 Q50 15 65 28 Q48 20 28 42', 'M28 45 Q50 55 65 28 Q48 40 28 42', 'M28 45 Q50 15 65 28 Q48 20 28 42'] }}
              transition={{ duration: 0.25, repeat: Infinity }}
            />
            {/* Tail */}
            <path d="M25 48 L10 55 L15 45 Z" fill="#5D4037" />
            {/* Talons */}
            <path d="M42 58 L38 68 M46 58 L44 68 M50 58 L52 68" stroke="#FFD700" strokeWidth="2" fill="none" />
            {/* Ring in talons */}
            <circle cx="43" cy="68" r="6" fill="none" stroke="#FFD700" strokeWidth="2.5" />
            <circle cx="43" cy="63" r="3.5" fill="#FF69B4" />
            <circle cx="43" cy="63" r="5" fill="none" stroke="#FFD700" strokeWidth="0.5" opacity="0.5" />
          </svg>
          {/* Feather particles on dodge */}
          <AnimatePresence>
            {taps > 0 && (
              <>
                {Array.from({ length: 3 }).map((_, i) => (
                  <motion.div
                    key={`${taps}-${i}`}
                    initial={{ opacity: 1, x: 0, y: 0 }}
                    animate={{ opacity: 0, x: Math.random() * 60 - 30, y: Math.random() * 40 + 20, rotate: Math.random() * 360 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute"
                    style={{ left: '50%', top: '50%' }}
                  >
                    <svg width="10" height="6" viewBox="0 0 10 6">
                      <ellipse cx="5" cy="3" rx="4" ry="2" fill="#8B6914" opacity="0.6" />
                    </svg>
                  </motion.div>
                ))}
              </>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Escape message */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="glass-strong px-10 py-8 text-center">
              <p className="text-2xl font-bold text-gray-700">The eagle got away... 🦅💨</p>
              <p className="text-sm text-gray-500 mt-2">Maybe next time!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
