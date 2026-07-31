'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props { onComplete: () => void; }

/** Final Scene — Starry sky ending */
export default function FinalScene({ onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showText, setShowText] = useState(false);
  const [showSubtext, setShowSubtext] = useState(false);

  // Starry sky
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars: { x: number; y: number; r: number; twinkleSpeed: number; phase: number }[] = [];
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        twinkleSpeed: 0.5 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let frame: number;
    const start = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - start) / 1000;

      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#0a0a2e');
      grad.addColorStop(0.5, '#1a0a3e');
      grad.addColorStop(1, '#0d1b2a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars
      for (const star of stars) {
        const alpha = 0.3 + 0.7 * Math.abs(Math.sin(elapsed * star.twinkleSpeed + star.phase));
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
        // Glow
        if (star.r > 1.5) {
          ctx.fillStyle = `rgba(200, 220, 255, ${alpha * 0.2})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Shooting star occasionally
      if (Math.sin(elapsed * 0.5) > 0.98) {
        const sx = Math.random() * canvas.width;
        const sy = Math.random() * canvas.height * 0.3;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + 80, sy + 40);
        ctx.stroke();
      }

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Show text with delays
  useEffect(() => {
    const t1 = setTimeout(() => setShowText(true), 2000);
    const t2 = setTimeout(() => setShowSubtext(true), 4500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 overflow-hidden"
    >
      <canvas ref={canvasRef} className="absolute inset-0" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        <AnimatePresence>
          {showText && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5 }}
              className="text-xl md:text-2xl text-white/90 font-serif leading-relaxed max-w-lg"
              style={{ textShadow: '0 0 20px rgba(255,255,255,0.2)' }}
            >
              &ldquo;The next available retry to fetch the wedding ring is August 12 after 8 years.&rdquo; ⭐
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showSubtext && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5 }}
              className="mt-6 text-lg text-white/60 font-serif"
            >
              Until then, every day with you is an adventure. ❤️
            </motion.p>
          )}
        </AnimatePresence>

        {/* Replay button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 7 }}
          onClick={onComplete}
          className="mt-12 px-6 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white/70 text-sm hover:bg-white/20 transition-all"
        >
          🔄 Replay
        </motion.button>
      </div>
    </motion.div>
  );
}
