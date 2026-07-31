'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  strong?: boolean;
}

/** Reusable glassmorphism card */
export default function GlassCard({ children, className = '', strong = false }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`${strong ? 'glass-strong' : 'glass'} ${className}`}
    >
      {children}
    </motion.div>
  );
}
