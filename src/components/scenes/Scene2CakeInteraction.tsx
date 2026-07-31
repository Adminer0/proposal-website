'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

interface Scene2CakeInteractionProps {
  onComplete: () => void;
}

const TOTAL_SLICES = 8;

/* ── Pastel slice colors ── */
const SLICE_COLORS = [
  '#FFB3BA', '#BAE1FF', '#BAFFC9', '#FFFFBA',
  '#E8BAFF', '#FFD9BA', '#FFC8DD', '#BDE0FE',
];

/* ── Generate pie slice SVG path ── */
function pieSlicePath(index: number, total: number, cx: number, cy: number, r: number): string {
  const anglePerSlice = (2 * Math.PI) / total;
  const startAngle = index * anglePerSlice - Math.PI / 2;
  const endAngle = startAngle + anglePerSlice;
  const gap = 0.02; // tiny gap between slices

  const x1 = cx + r * Math.cos(startAngle + gap);
  const y1 = cy + r * Math.sin(startAngle + gap);
  const x2 = cx + r * Math.cos(endAngle - gap);
  const y2 = cy + r * Math.sin(endAngle - gap);

  return `M${cx},${cy} L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`;
}

/* ── Floating particles ── */
function FloatingParticles() {
  const particles = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    size: 4 + Math.random() * 8,
    left: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 6 + Math.random() * 6,
    color: ['#FFB3BA', '#BAE1FF', '#BAFFC9', '#FFFFBA', '#E8BAFF', '#FFD9BA'][i % 6],
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            bottom: '-20px',
            background: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: 0.4,
          }}
        />
      ))}
    </div>
  );
}

/* ── Single Cake Slice ── */
interface SliceProps {
  index: number;
  color: string;
  onEat: (index: number) => void;
}

function CakeSlice({ index, color, onEat }: SliceProps) {
  const cx = 130;
  const cy = 130;
  const r = 110;
  const d = pieSlicePath(index, TOTAL_SLICES, cx, cy, r);

  // Sprinkle position at 60% radius, mid-angle
  const midAngle = ((index * 2 * Math.PI) / TOTAL_SLICES) - Math.PI / 2 + Math.PI / TOTAL_SLICES;
  const sprinkleX = cx + (r * 0.6) * Math.cos(midAngle);
  const sprinkleY = cy + (r * 0.6) * Math.sin(midAngle);

  return (
    <motion.g
      initial={{ scale: 1, rotate: 0, opacity: 1 }}
      exit={{
        scale: [1, 1.15, 0],
        rotate: [0, 12, -25],
        opacity: [1, 1, 0],
        transition: { duration: 0.55, ease: 'easeInOut' },
      }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onEat(index)}
      className="cursor-pointer"
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    >
      <path d={d} fill={color} stroke="#fff" strokeWidth="2.5" />
      {/* Frosting overlay */}
      <path d={d} fill="url(#frosting)" opacity="0.3" />
      {/* Sprinkle */}
      <circle cx={sprinkleX} cy={sprinkleY} r="3.5" fill="#fff" opacity="0.5" />
    </motion.g>
  );
}

/* ── Main Component ── */
export default function Scene2CakeInteraction({ onComplete }: Scene2CakeInteractionProps) {
  const [slices, setSlices] = useState<number[]>(() =>
    Array.from({ length: TOTAL_SLICES }, (_, i) => i)
  );
  const [showLoveMsg, setShowLoveMsg] = useState(false);
  const cakeRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLHeadingElement>(null);

  const remaining = slices.length;

  /* ── Entrance animation ── */
  useEffect(() => {
    if (cakeRef.current) {
      gsap.fromTo(
        cakeRef.current,
        { scale: 0.6, opacity: 0, rotation: -10 },
        { scale: 1, opacity: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.4)' }
      );
    }
  }, []);

  /* ── When 1 slice left → show love message + auto-advance ── */
  useEffect(() => {
    if (remaining === 1 && !showLoveMsg) {
      setShowLoveMsg(true);
    }
  }, [remaining, showLoveMsg]);

  /* ── Auto-advance 2s after love message appears ── */
  useEffect(() => {
    if (!showLoveMsg) return;
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);
    return () => clearTimeout(timer);
  }, [showLoveMsg, onComplete]);

  /* ── Animate love message entrance ── */
  useEffect(() => {
    if (showLoveMsg && messageRef.current) {
      gsap.fromTo(
        messageRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }
      );
    }
  }, [showLoveMsg]);

  /* ── Eat slice handler ── */
  const handleEat = useCallback((index: number) => {
    // Don't allow eating the last slice — it's reserved for the love message
    if (slices.length <= 1) return;
    setSlices((prev) => prev.filter((s) => s !== index));
  }, [slices.length]);

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #fce4ec 0%, #f3e5f5 30%, #e8eaf6 60%, #e0f7fa 100%)',
      }}
    >
      <FloatingParticles />

      {/* Title */}
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-xl font-semibold text-dreamy mb-4 z-10"
      >
        🍰 Tap a slice to eat it!
      </motion.p>

      {/* Cake SVG */}
      <div ref={cakeRef} className="relative z-10" style={{ opacity: 0 }}>
        <svg viewBox="0 0 260 260" width="260" height="260" className="drop-shadow-lg">
          <defs>
            <radialGradient id="frosting" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Plate */}
          <ellipse cx="130" cy="245" rx="120" ry="14" fill="#F5E6D3" opacity="0.5" />

          {/* Cake body background */}
          <circle cx="130" cy="130" r="110" fill="#FFF5F5" stroke="#F5E6D3" strokeWidth="3" />

          {/* Cake side (3D effect) */}
          <ellipse cx="130" cy="220" rx="110" ry="18" fill="#FFD9BA" opacity="0.4" />

          {/* Slices */}
          <AnimatePresence>
            {slices.map((i) => (
              <CakeSlice
                key={i}
                index={i}
                color={SLICE_COLORS[i]}
                onEat={handleEat}
              />
            ))}
          </AnimatePresence>

          {/* Center decoration */}
          <circle cx="130" cy="130" r="12" fill="#FF6B8A" opacity="0.7" />
          <text x="130" y="135" textAnchor="middle" fontSize="14" fill="#fff">🎂</text>
        </svg>
      </div>

      {/* Counter */}
      <motion.div
        className="glass px-6 py-3 rounded-full z-10 mt-4"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 0.3 }}
        key={remaining}
      >
        <span className="text-lg font-semibold text-gray-600">
          Slices remaining:{' '}
          <span className="text-dreamy font-bold">{remaining}</span>
        </span>
      </motion.div>

      {/* Love message overlay */}
      <AnimatePresence>
        {showLoveMsg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center z-20"
            style={{
              background: 'rgba(255,255,255,0.55)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <h1
              ref={messageRef}
              className="text-dreamy text-3xl md:text-4xl font-bold text-center px-6"
              style={{ opacity: 0 }}
            >
              Send the last piece to someone you love ❤️
              <motion.span
                className="inline-block ml-2"
                animate={{ scale: [1, 1.3, 1, 1.3, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                💕
              </motion.span>
            </h1>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
