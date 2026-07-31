'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import Confetti from '@/components/effects/Confetti';
import Sparkles from '@/components/effects/Sparkles';

interface Props { onComplete: () => void; }

/** Scene 1 — Birthday cake with blowable candle */
export default function Scene1Cake({ onComplete }: Props) {
  const [blown, setBlown] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const flameRef = useRef<SVGGElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Flame flicker animation
  useEffect(() => {
    if (!flameRef.current || blown) return;
    const tl = gsap.timeline({ repeat: -1 });
    tl.to(flameRef.current, { scaleX: 0.8, scaleY: 1.1, duration: 0.15, yoyo: true, repeat: -1, transformOrigin: 'bottom center' });
    return () => { tl.kill(); };
  }, [blown]);

  // Try mic detection
  useEffect(() => {
    let analyser: AnalyserNode | null = null;
    let frame: number;
    let stream: MediaStream | null = null;

    const tryMic = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const ctx = new AudioContext();
        audioCtxRef.current = ctx;
        const source = ctx.createMediaStreamSource(stream);
        analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);

        const data = new Uint8Array(analyser.frequencyBinCount);
        const detect = () => {
          analyser!.getByteFrequencyData(data);
          const avg = data.reduce((a, b) => a + b, 0) / data.length;
          if (avg > 50 && !blown) {
            handleBlow();
            return;
          }
          frame = requestAnimationFrame(detect);
        };
        detect();
      } catch {
        setShowButton(true);
      }
    };

    tryMic();
    return () => {
      cancelAnimationFrame(frame);
      stream?.getTracks().forEach(t => t.stop());
      audioCtxRef.current?.close();
    };
  }, []);

  const handleBlow = useCallback(() => {
    setBlown(true);
    // Extinguish flame
    if (flameRef.current) {
      gsap.to(flameRef.current, { opacity: 0, scaleY: 0, duration: 0.5, ease: 'power2.in' });
    }
    // Celebration after 2s
    setTimeout(() => setCelebrating(true), 2000);
    // Complete after 7s
    setTimeout(() => onComplete(), 7000);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #fce4ec 0%, #f3e5f5 50%, #e8eaf6 100%)' }}
    >
      {/* Floating particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            width: 6 + Math.random() * 8,
            height: 6 + Math.random() * 8,
            left: `${Math.random() * 100}%`,
            bottom: '-10px',
            background: ['#FFB3BA', '#BAE1FF', '#BAFFC9', '#FFFFBA', '#E8BAFF'][i % 5],
            animationDuration: `${4 + Math.random() * 6}s`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}

      {/* Cake SVG */}
      <motion.div initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', duration: 0.8 }}>
        <svg width="260" height="280" viewBox="0 0 260 280">
          {/* Cake base */}
          <rect x="30" y="180" width="200" height="60" rx="12" fill="#FFB3BA" stroke="#FF8FA3" strokeWidth="2" />
          {/* Middle layer */}
          <rect x="50" y="130" width="160" height="55" rx="10" fill="#BAE1FF" stroke="#8EC5FC" strokeWidth="2" />
          {/* Top layer */}
          <rect x="70" y="90" width="120" height="45" rx="8" fill="#BAFFC9" stroke="#8EDBA0" strokeWidth="2" />
          {/* Frosting drips */}
          <path d="M70 90 Q80 100 90 90 Q100 100 110 90 Q120 100 130 90 Q140 100 150 90 Q160 100 170 90 Q180 100 190 90" fill="none" stroke="#fff" strokeWidth="4" opacity="0.7" />
          {/* Sprinkles */}
          {[[90,100],[110,95],[130,102],[150,97],[170,100],[100,140],[120,145],[140,138],[160,142]].map(([x,y], i) => (
            <rect key={i} x={x} y={y} width="6" height="3" rx="1" fill={['#FF6B8A','#BAE1FF','#FFFFBA','#E8BAFF'][i%4]} transform={`rotate(${Math.random()*60-30} ${x+3} ${y+1.5})`} />
          ))}
          {/* Candle */}
          <rect x="125" y="50" width="10" height="45" rx="3" fill="#E8BAFF" />
          <rect x="123" y="48" width="14" height="6" rx="2" fill="#FFD9BA" />
          {/* Flame */}
          <g ref={flameRef} transform="translate(130, 40)">
            <ellipse cx="0" cy="0" rx="8" ry="14" fill="#FFD700" opacity="0.9" />
            <ellipse cx="0" cy="-2" rx="5" ry="10" fill="#FF8C00" />
            <ellipse cx="0" cy="-4" rx="3" ry="6" fill="#FF4500" />
            {/* Glow */}
            <circle cx="0" cy="0" r="20" fill="#FFD700" opacity="0.15" />
          </g>
          {/* Plate */}
          <ellipse cx="130" cy="245" rx="120" ry="12" fill="#f5f5f5" stroke="#ddd" strokeWidth="1" />
        </svg>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-xl font-semibold text-dreamy"
      >
        {blown ? '' : '✨ Make a wish and blow out the candle ✨'}
      </motion.p>

      {/* Tap fallback */}
      <AnimatePresence>
        {showButton && !blown && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleBlow}
            className="btn-primary mt-4 text-lg"
          >
            🎂 Tap to Blow the Candle
          </motion.button>
        )}
      </AnimatePresence>

      {/* Celebration */}
      <Confetti active={celebrating} duration={4000} />
      <Sparkles active={celebrating} count={30} />

      <AnimatePresence>
        {celebrating && (
          <motion.h1
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute text-4xl md:text-5xl font-bold text-dreamy mt-4"
            style={{ bottom: '20%' }}
          >
            Happy Birthday! 🎉
          </motion.h1>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
