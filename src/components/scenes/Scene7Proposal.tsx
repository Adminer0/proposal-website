'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MaleCharacter from '@/components/characters/MaleCharacter';
import Confetti from '@/components/effects/Confetti';
import Fireworks from '@/components/effects/Fireworks';
import FloatingHearts from '@/components/effects/FloatingHearts';
import Sparkles from '@/components/effects/Sparkles';
import Button from '@/components/ui/Button';

interface Props { onComplete: () => void; }

/** Scene 7 — The real proposal */
export default function Scene7Proposal({ onComplete }: Props) {
  const [text, setText] = useState('');
  const [showButtons, setShowButtons] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [rejectMsg, setRejectMsg] = useState('');
  const hasCompleted = useRef(false);
  const fullText = 'Will you be my girlfriend? 💍';

  // Typewriter effect
  useEffect(() => {
    if (rejected) return;
    let i = 0;
    setText('');
    const interval = setInterval(() => {
      setText(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) {
        clearInterval(interval);
        setTimeout(() => setShowButtons(true), 500);
      }
    }, 80);
    return () => clearInterval(interval);
  }, [rejected]);

  const handleNo = () => {
    setShowButtons(false);
    setRejectMsg(['Think again! 😄', 'Are you sure? 🥺', 'One more chance? 💕', 'Pretty please? 🌹'][Math.floor(Math.random() * 4)]);
    setRejected(true);
    setTimeout(() => {
      setRejected(false);
      setRejectMsg('');
    }, 2000);
  };

  const handleYes = () => {
    setAccepted(true);
    setShowButtons(false);
    setTimeout(() => {
      if (!hasCompleted.current) { hasCompleted.current = true; onComplete(); }
    }, 6000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #FFE0EC 0%, #FFC1CC 30%, #FFB3BA 60%, #FFD1DC 100%)' }}
    >
      {/* Background hearts */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl opacity-20"
          style={{ left: `${5 + Math.random() * 90}%`, top: `${5 + Math.random() * 90}%` }}
          animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5] }}
          transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: i * 0.3 }}
        >
          ❤️
        </motion.div>
      ))}

      {/* Character */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
      >
        <MaleCharacter pose={accepted ? 'happy' : 'standing'} className="w-24 h-36" />
      </motion.div>

      {/* Typewriter text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-center px-4"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-dreamy min-h-[3rem]">
          {text}
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="inline-block ml-0.5"
          >|</motion.span>
        </h1>
      </motion.div>

      {/* Buttons */}
      <AnimatePresence>
        {showButtons && !accepted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex gap-4 mt-8"
          >
            <Button variant="primary" onClick={handleYes} className="text-xl px-10 py-4 shadow-[0_0_30px_rgba(255,107,138,0.5)]">
              Yes ❤️
            </Button>
            <Button variant="secondary" onClick={handleNo}>
              No
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reject message */}
      <AnimatePresence>
        {rejectMsg && (
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4 text-xl text-gray-600"
          >
            {rejectMsg}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Accepted celebration */}
      <AnimatePresence>
        {accepted && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="absolute text-center"
            style={{ bottom: '15%' }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-dreamy drop-shadow-lg">
              She said YES! 🎉❤️
            </h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Effects */}
      <Fireworks active={accepted} duration={5000} />
      <Confetti active={accepted} duration={4000} />
      <FloatingHearts active={accepted} count={25} />
      <Sparkles active={accepted} count={40} />

      {/* Romantic music placeholder */}
      <audio autoPlay loop muted={false}>
        <source src="/audio/romantic.mp3" type="audio/mpeg" />
      </audio>
    </motion.div>
  );
}
