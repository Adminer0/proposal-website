'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import MaleCharacter from '@/components/characters/MaleCharacter';
import FemaleCharacter from '@/components/characters/FemaleCharacter';

interface Props { onComplete: () => void; }

/** Scene 4 — Eagle steals the ring */
export default function Scene4Proposal({ onComplete }: Props) {
  const [phase, setPhase] = useState<'walk' | 'kneel' | 'ring' | 'eagle' | 'surprise'>('walk');
  const eagleRef = useRef<SVGGElement>(null);
  const ringBoxRef = useRef<SVGGElement>(null);
  const hasCompleted = useRef(false);

  // Sequence
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    timers.push(setTimeout(() => setPhase('kneel'), 1500));
    timers.push(setTimeout(() => setPhase('ring'), 3000));
    timers.push(setTimeout(() => setPhase('eagle'), 5000));
    timers.push(setTimeout(() => setPhase('surprise'), 6500));
    timers.push(setTimeout(() => {
      if (!hasCompleted.current) { hasCompleted.current = true; onComplete(); }
    }, 8500));
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  // Eagle animation
  useEffect(() => {
    if (phase !== 'eagle' || !eagleRef.current) return;
    gsap.fromTo(eagleRef.current,
      { x: window.innerWidth + 100, y: -100, scale: 0.5 },
      { x: 130, y: 100, scale: 1, duration: 1, ease: 'power2.in' }
    );
  }, [phase]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #FFB347 0%, #FF6B8A 30%, #C471ED 60%, #7B68EE 100%)' }}
    >
      {/* Sun */}
      <div className="absolute" style={{ top: '15%', left: '50%', transform: 'translateX(-50%)' }}>
        <div className="w-20 h-20 rounded-full" style={{ background: 'radial-gradient(circle, #FFD700, #FF8C00)', boxShadow: '0 0 60px 20px rgba(255,200,0,0.3)' }} />
      </div>

      {/* Hills */}
      <svg className="absolute bottom-0 w-full" height="200" viewBox="0 0 100 200" preserveAspectRatio="none">
        <path d="M0 80 Q20 40 40 70 Q60 30 80 60 Q90 50 100 70 L100 200 L0 200 Z" fill="#4CAF50" opacity="0.6" />
        <path d="M0 100 Q25 60 50 90 Q75 50 100 80 L100 200 L0 200 Z" fill="#66BB6A" opacity="0.7" />
        <path d="M0 130 Q30 100 60 120 Q80 90 100 110 L100 200 L0 200 Z" fill="#81C784" opacity="0.8" />
      </svg>

      {/* Characters */}
      <div className="absolute" style={{ bottom: '18%', left: '35%', display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
        <MaleCharacter pose={phase === 'kneel' || phase === 'ring' || phase === 'eagle' ? 'kneeling' : phase === 'surprise' ? 'surprised' : 'happy'} className="w-16 h-24" />
        <FemaleCharacter pose={phase === 'surprise' ? 'surprised' : 'happy'} className="w-16 h-24" />
      </div>

      {/* Ring box */}
      <AnimatePresence>
        {(phase === 'ring' || phase === 'eagle') && (
          <motion.div
            ref={ringBoxRef as any}
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute"
            style={{ bottom: '35%', left: '42%' }}
          >
            <svg width="60" height="50" viewBox="0 0 60 50">
              {/* Box */}
              <rect x="10" y="20" width="40" height="25" rx="4" fill="#8B4513" />
              <rect x="10" y="20" width="40" height="8" rx="3" fill="#A0522D" />
              {/* Lid open */}
              <rect x="8" y="10" width="44" height="12" rx="3" fill="#A0522D" transform="rotate(-15 30 20)" />
              {/* Ring */}
              <circle cx="30" cy="25" r="8" fill="none" stroke="#FFD700" strokeWidth="2" />
              <circle cx="30" cy="18" r="4" fill="#FF69B4" />
              {/* Sparkle */}
              <motion.circle
                cx="30" cy="18" r="12"
                fill="none" stroke="#FFD700" strokeWidth="1"
                animate={{ r: [8, 16, 8], opacity: [0.8, 0, 0.8] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Eagle */}
      <AnimatePresence>
        {phase === 'eagle' && (
          <motion.div
            initial={{ x: '100vw', y: '-10vh' }}
            animate={{ x: '35vw', y: '25vh' }}
            exit={{ x: '-20vw', y: '-30vh' }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="fixed z-20"
          >
            <svg width="100" height="80" viewBox="0 0 100 80">
              {/* Body */}
              <ellipse cx="50" cy="45" rx="20" ry="12" fill="#8B4513" />
              {/* Head */}
              <circle cx="70" cy="38" r="10" fill="#A0522D" />
              {/* Beak */}
              <polygon points="80,38 90,42 80,44" fill="#FFD700" />
              {/* Eye */}
              <circle cx="74" cy="36" r="2" fill="black" />
              {/* Wings - animated */}
              <motion.path
                d="M30 45 Q10 20 5 35 Q15 25 30 40"
                fill="#6D4C41"
                animate={{ d: ['M30 45 Q10 20 5 35 Q15 25 30 40', 'M30 45 Q10 50 5 30 Q15 40 30 40', 'M30 45 Q10 20 5 35 Q15 25 30 40'] }}
                transition={{ duration: 0.3, repeat: Infinity }}
              />
              <motion.path
                d="M30 45 Q50 20 60 30 Q45 25 30 42"
                fill="#6D4C41"
                animate={{ d: ['M30 45 Q50 20 60 30 Q45 25 30 42', 'M30 45 Q50 50 60 30 Q45 40 30 42', 'M30 45 Q50 20 60 30 Q45 25 30 42'] }}
                transition={{ duration: 0.3, repeat: Infinity }}
              />
              {/* Talons */}
              <path d="M45 55 L40 65 M48 55 L46 65 M50 55 L52 65" stroke="#FFD700" strokeWidth="1.5" fill="none" />
              {/* Ring in talons */}
              <circle cx="45" cy="65" r="5" fill="none" stroke="#FFD700" strokeWidth="2" />
              <circle cx="45" cy="61" r="3" fill="#FF69B4" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Surprise text */}
      <AnimatePresence>
        {phase === 'surprise' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-1/4 left-0 right-0 text-center"
          >
            <p className="text-3xl font-bold text-white drop-shadow-lg">😱 The eagle took the ring!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
