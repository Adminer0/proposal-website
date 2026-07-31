'use client';

import { motion } from 'framer-motion';
import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: ReactNode;
}

/** Styled button with animation variants */
export default function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const base = 'px-8 py-3.5 rounded-full font-semibold text-base cursor-pointer transition-all duration-300 inline-flex items-center justify-center gap-2';

  const variants: Record<string, string> = {
    primary: 'bg-gradient-to-r from-[#FF6B8A] to-[#FF8FA3] text-white shadow-[0_4px_20px_rgba(255,107,138,0.3)] hover:shadow-[0_6px_28px_rgba(255,107,138,0.45)]',
    secondary: 'bg-white/15 backdrop-blur-[10px] text-gray-600 border border-white/25 hover:bg-white/30',
    ghost: 'bg-transparent text-gray-500 hover:bg-white/10',
  };

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
