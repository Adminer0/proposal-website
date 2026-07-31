'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import MaleCharacter from '@/components/characters/MaleCharacter';
import FemaleCharacter from '@/components/characters/FemaleCharacter';
import Button from '@/components/ui/Button';

interface Props { onComplete: () => void; }

/** Scene 6 — Comfort scene in cozy room */
export default function Scene6Comfort({ onComplete }: Props) {
  const [showQuestion, setShowQuestion] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const lampRef = useRef<SVGGElement>(null);
  const hasCompleted = useRef(false);

  // Lamp glow animation
  useEffect(() => {
    if (!lampRef.current) return;
    gsap.to(lampRef.current, { opacity: 0.9, duration: 1, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  }, []);

  // Show question after 3s
  useEffect(() => {
    const t = setTimeout(() => setShowQuestion(true), 3000);
    return () => clearTimeout(t);
  }, []);

  const handleAnswer = (yes: boolean) => {
    if (yes) {
      setAnswered(true);
      setCelebrating(true);
      setTimeout(() => {
        if (!hasCompleted.current) { hasCompleted.current = true; onComplete(); }
      }, 2500);
    } else {
      setShowQuestion(false);
      setTimeout(() => setShowQuestion(true), 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #FFF8E1 0%, #FFE0B2 50%, #FFCCBC 100%)' }}
    >
      {/* Room background */}
      {/* Wall */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #FFF8E1 0%, #FFE0B2 60%)' }} />
      {/* Floor */}
      <div className="absolute bottom-0 w-full h-1/3" style={{ background: 'linear-gradient(180deg, #D7CCC8, #BCAAA4)' }} />
      {/* Baseboard */}
      <div className="absolute w-full" style={{ bottom: '33.3%', height: '8px', background: '#8D6E63' }} />

      {/* Window */}
      <div className="absolute" style={{ top: '10%', right: '10%' }}>
        <svg width="80" height="100" viewBox="0 0 80 100">
          <rect x="0" y="0" width="80" height="100" rx="4" fill="#87CEEB" opacity="0.5" />
          <rect x="0" y="0" width="80" height="100" rx="4" fill="none" stroke="#8D6E63" strokeWidth="4" />
          <line x1="40" y1="0" x2="40" y2="100" stroke="#8D6E63" strokeWidth="3" />
          <line x1="0" y1="50" x2="80" y2="50" stroke="#8D6E63" strokeWidth="3" />
          {/* Curtain left */}
          <path d="M-5 0 Q10 25 -5 50 Q10 75 -5 100" fill="#E8B4B8" opacity="0.6" />
          {/* Curtain right */}
          <path d="M85 0 Q70 25 85 50 Q70 75 85 100" fill="#E8B4B8" opacity="0.6" />
        </svg>
      </div>

      {/* Bookshelf */}
      <div className="absolute" style={{ top: '15%', left: '8%' }}>
        <svg width="60" height="80" viewBox="0 0 60 80">
          <rect x="0" y="0" width="60" height="80" fill="#8D6E63" rx="3" />
          <rect x="3" y="3" width="54" height="22" fill="#A1887F" />
          <rect x="3" y="28" width="54" height="22" fill="#A1887F" />
          <rect x="3" y="53" width="54" height="22" fill="#A1887F" />
          {/* Books */}
          {[[8,5,8,18,'#E57373'],[18,5,6,18,'#64B5F6'],[26,5,7,18,'#81C784'],[35,5,8,18,'#FFB74D'],[45,5,6,18,'#BA68C8']].map(([x,y,w,h,c],i) => (
            <rect key={i} x={x} y={y} width={w} height={h} rx="1" fill={c as string} />
          ))}
          {[[8,30,7,18,'#4FC3F7'],[17,30,8,18,'#FF8A65'],[27,30,6,18,'#AED581'],[35,30,8,18,'#F06292'],[45,30,6,18,'#7986CB']].map(([x,y,w,h,c],i) => (
            <rect key={i} x={x} y={y} width={w} height={h} rx="1" fill={c as string} />
          ))}
        </svg>
      </div>

      {/* Lamp */}
      <div className="absolute" style={{ top: '25%', left: '25%' }}>
        <svg width="30" height="60" viewBox="0 0 30 60">
          <rect x="13" y="30" width="4" height="30" rx="1" fill="#8D6E63" />
          <ellipse cx="15" cy="58" rx="10" ry="3" fill="#8D6E63" />
          <g ref={lampRef}>
            <path d="M5 30 Q15 10 25 30" fill="#FFD54F" opacity="0.7" />
            <circle cx="15" cy="20" r="15" fill="#FFD54F" opacity="0.15" />
          </g>
        </svg>
      </div>

      {/* Picture frame */}
      <div className="absolute" style={{ top: '12%', left: '45%' }}>
        <svg width="50" height="40" viewBox="0 0 50 40">
          <rect x="0" y="0" width="50" height="40" rx="2" fill="#8D6E63" />
          <rect x="3" y="3" width="44" height="34" fill="#FFE0B2" />
          <circle cx="25" cy="18" r="8" fill="none" stroke="#E8B4B8" strokeWidth="1" />
          <path d="M15 30 Q25 20 35 30" fill="#81C784" opacity="0.5" />
        </svg>
      </div>

      {/* Sofa */}
      <div className="absolute" style={{ bottom: '10%', left: '50%', transform: 'translateX(-50%)' }}>
        <svg width="220" height="100" viewBox="0 0 220 100">
          {/* Sofa back */}
          <rect x="10" y="10" width="200" height="50" rx="15" fill="#E8B4B8" />
          {/* Sofa seat */}
          <rect x="5" y="45" width="210" height="35" rx="10" fill="#F48FB1" />
          {/* Arm left */}
          <rect x="0" y="20" width="25" height="60" rx="10" fill="#E8B4B8" />
          {/* Arm right */}
          <rect x="195" y="20" width="25" height="60" rx="10" fill="#E8B4B8" />
          {/* Cushion lines */}
          <line x1="75" y1="50" x2="75" y2="75" stroke="#E8B4B8" strokeWidth="2" />
          <line x1="145" y1="50" x2="145" y2="75" stroke="#E8B4B8" strokeWidth="2" />
          {/* Legs */}
          <rect x="20" y="80" width="8" height="15" rx="2" fill="#8D6E63" />
          <rect x="192" y="80" width="8" height="15" rx="2" fill="#8D6E63" />
        </svg>
      </div>

      {/* Characters on sofa */}
      <div className="absolute" style={{ bottom: '15%', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '20px', alignItems: 'flex-end' }}>
        <MaleCharacter pose={celebrating ? 'happy' : 'sitting'} className="w-14 h-20" />
        <FemaleCharacter pose={celebrating ? 'happy' : 'sad'} className="w-14 h-20" />
      </div>

      {/* Comforting text */}
      <AnimatePresence>
        {!showQuestion && !answered && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute text-center w-full px-4"
            style={{ top: '8%' }}
          >
            <span className="text-lg text-gray-600 italic">*comforting her gently*</span>
          </motion.p>
        )}
      </AnimatePresence>

      {/* Question dialog */}
      <AnimatePresence>
        {showQuestion && !answered && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute glass-strong px-8 py-6 text-center"
            style={{ top: '10%', left: '50%', transform: 'translateX(-50%)' }}
          >
            <p className="text-xl font-semibold text-gray-700 mb-4">Are you okay now? 💕</p>
            <div className="flex gap-4 justify-center">
              <Button variant="primary" onClick={() => handleAnswer(true)}>Yes ❤️</Button>
              <Button variant="secondary" onClick={() => handleAnswer(false)}>Not yet...</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Celebration */}
      <AnimatePresence>
        {celebrating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute text-center w-full"
            style={{ top: '5%' }}
          >
            <p className="text-2xl font-bold text-dreamy">Yay! 💕</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
