'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import MaleCharacter from '@/components/characters/MaleCharacter';
import FemaleCharacter from '@/components/characters/FemaleCharacter';

interface Props { onComplete: () => void; }

/** Scene 3 — Sunset park walk with two characters */
export default function Scene3ParkWalk({ onComplete }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<HTMLDivElement>(null);
  const hasCompleted = useRef(false);

  useEffect(() => {
    if (!charsRef.current) return;
    // Walk characters across screen
    const tl = gsap.timeline({
      onComplete: () => {
        if (!hasCompleted.current) {
          hasCompleted.current = true;
          onComplete();
        }
      }
    });
    tl.fromTo(charsRef.current, { x: -200 }, { x: window.innerWidth + 100, duration: 10, ease: 'none' });

    // Tap to skip
    const handleTap = () => {
      if (!hasCompleted.current) {
        hasCompleted.current = true;
        tl.kill();
        onComplete();
      }
    };
    containerRef.current?.addEventListener('click', handleTap);
    return () => {
      tl.kill();
      containerRef.current?.removeEventListener('click', handleTap);
    };
  }, [onComplete]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 overflow-hidden cursor-pointer"
      style={{ background: 'linear-gradient(180deg, #FFB347 0%, #FF6B8A 30%, #C471ED 60%, #7B68EE 100%)' }}
    >
      {/* Sun */}
      <div className="absolute" style={{ top: '15%', left: '50%', transform: 'translateX(-50%)' }}>
        <div className="w-20 h-20 rounded-full" style={{ background: 'radial-gradient(circle, #FFD700, #FF8C00)', boxShadow: '0 0 60px 20px rgba(255,200,0,0.3)' }} />
      </div>

      {/* Clouds */}
      {[
        { left: '10%', top: '8%', scale: 1, dur: 20 },
        { left: '60%', top: '12%', scale: 0.8, dur: 25 },
        { left: '80%', top: '5%', scale: 0.6, dur: 18 },
      ].map((c, i) => (
        <motion.div
          key={i}
          className="absolute opacity-60"
          style={{ left: c.left, top: c.top, transform: `scale(${c.scale})` }}
          animate={{ x: [0, 30, 0] }}
          transition={{ duration: c.dur, repeat: Infinity, ease: 'linear' }}
        >
          <svg width="100" height="40" viewBox="0 0 100 40">
            <ellipse cx="50" cy="25" rx="40" ry="15" fill="white" />
            <ellipse cx="35" cy="20" rx="25" ry="12" fill="white" />
            <ellipse cx="65" cy="18" rx="20" ry="10" fill="white" />
          </svg>
        </motion.div>
      ))}

      {/* Birds */}
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top: `${10 + i * 5}%` }}
          animate={{ x: [-50, window.innerWidth + 50], y: [0, -20, 0, -15, 0] }}
          transition={{ x: { duration: 8 + i * 2, repeat: Infinity, delay: i * 3 }, y: { duration: 2, repeat: Infinity } }}
        >
          <svg width="30" height="15" viewBox="0 0 30 15">
            <path d="M0 10 Q7 0 15 8 Q23 0 30 10" fill="none" stroke="#333" strokeWidth="2" />
          </svg>
        </motion.div>
      ))}

      {/* Hills */}
      <svg className="absolute bottom-0 w-full" height="200" viewBox="0 0 100 200" preserveAspectRatio="none">
        <path d="M0 80 Q20 40 40 70 Q60 30 80 60 Q90 50 100 70 L100 200 L0 200 Z" fill="#4CAF50" opacity="0.6" />
        <path d="M0 100 Q25 60 50 90 Q75 50 100 80 L100 200 L0 200 Z" fill="#66BB6A" opacity="0.7" />
        <path d="M0 130 Q30 100 60 120 Q80 90 100 110 L100 200 L0 200 Z" fill="#81C784" opacity="0.8" />
      </svg>

      {/* Trees */}
      {[10, 25, 45, 65, 80].map((x, i) => (
        <svg key={i} className="absolute bottom-20" style={{ left: `${x}%` }} width="40" height="80" viewBox="0 0 40 80">
          <rect x="17" y="50" width="6" height="30" rx="2" fill="#8D6E63" />
          <ellipse cx="20" cy="40" rx="18" ry="22" fill="#4CAF50" opacity="0.8" />
          <ellipse cx="20" cy="32" rx="14" ry="16" fill="#66BB6A" opacity="0.6" />
        </svg>
      ))}

      {/* Flowers */}
      {[15, 30, 50, 70, 85].map((x, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: `${x}%`, bottom: '8%' }}
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 2 + i * 0.5, repeat: Infinity }}
        >
          <svg width="20" height="25" viewBox="0 0 20 25">
            <line x1="10" y1="12" x2="10" y2="25" stroke="#4CAF50" strokeWidth="2" />
            {[[10,6,4,'#FFB3BA'],[6,10,3,'#BAE1FF'],[14,10,3,'#FFFFBA'],[8,14,3,'#E8BAFF'],[12,14,3,'#BAFFC9']].map(([cx,cy,r,fill], j) => (
              <circle key={j} cx={cx} cy={cy} r={r} fill={fill as string} />
            ))}
            <circle cx="10" cy="10" r="2" fill="#FFD700" />
          </svg>
        </motion.div>
      ))}

      {/* Falling leaves */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: `${10 + Math.random() * 80}%`, top: '-5%' }}
          animate={{ y: ['0vh', '110vh'], x: [0, Math.random() * 60 - 30], rotate: [0, 360] }}
          transition={{ duration: 6 + Math.random() * 4, repeat: Infinity, delay: i * 1.5, ease: 'linear' }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12">
            <ellipse cx="6" cy="6" rx="5" ry="3" fill={['#FFB3BA', '#FFD9BA', '#FFFFBA', '#BAFFC9'][i % 4]} opacity="0.7" />
          </svg>
        </motion.div>
      ))}

      {/* Characters walking */}
      <div ref={charsRef} className="absolute" style={{ bottom: '18%', display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
        <MaleCharacter pose="walking" className="w-16 h-24" />
        <FemaleCharacter pose="walking" className="w-16 h-24" />
        {/* Hands connected */}
        <svg className="absolute" style={{ left: '55px', top: '40%' }} width="20" height="10" viewBox="0 0 20 10">
          <path d="M0 5 Q10 0 20 5" fill="none" stroke="#FFD5C2" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      {/* Tap hint */}
      <motion.p
        className="absolute bottom-6 left-0 right-0 text-center text-white/60 text-sm"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Tap to skip
      </motion.p>

      {/* Floating particles */}
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            width: 4, height: 4,
            left: `${Math.random() * 100}%`,
            bottom: '-5px',
            background: 'rgba(255,255,255,0.4)',
            animationDuration: `${5 + Math.random() * 5}s`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}
    </motion.div>
  );
}
