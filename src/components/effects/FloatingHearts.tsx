'use client';

import { useEffect, useRef } from 'react';
import { SITE_CONFIG } from '@/config';

interface FloatingHeartsProps {
  active: boolean;
  count?: number;
}

/** Hearts rising from the bottom with random paths */
export default function FloatingHearts({ active, count = 20 }: FloatingHeartsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;
    const container = containerRef.current;
    const hearts: HTMLDivElement[] = [];

    for (let i = 0; i < count; i++) {
      const heart = document.createElement('div');
      heart.innerHTML = '❤️';
      heart.style.cssText = `
        position: absolute;
        bottom: -40px;
        left: ${Math.random() * 100}%;
        font-size: ${16 + Math.random() * 24}px;
        opacity: 0;
        pointer-events: none;
        animation: heart-float ${3 + Math.random() * 4}s ease-out ${Math.random() * 2}s forwards;
      `;
      container.appendChild(heart);
      hearts.push(heart);
    }

    // Add the keyframes if not already present
    if (!document.getElementById('heart-float-style')) {
      const style = document.createElement('style');
      style.id = 'heart-float-style';
      style.textContent = `
        @keyframes heart-float {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0.8; }
          25% { transform: translateY(-25vh) translateX(${20}px) rotate(15deg); opacity: 1; }
          50% { transform: translateY(-50vh) translateX(-${15}px) rotate(-10deg); opacity: 0.7; }
          75% { transform: translateY(-75vh) translateX(${25}px) rotate(20deg); opacity: 0.4; }
          100% { transform: translateY(-105vh) translateX(-${10}px) rotate(-5deg); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    return () => { hearts.forEach(h => h.remove()); };
  }, [active, count]);

  if (!active) return null;

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-40 overflow-hidden" />
  );
}
