'use client';

import { useEffect, useRef } from 'react';

interface SparklesProps {
  active: boolean;
  x?: number;
  y?: number;
  count?: number;
}

/** Sparkle particles at a point or spread across screen */
export default function Sparkles({ active, x, y, count = 20 }: SparklesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;
    const container = containerRef.current;
    const sparkles: HTMLDivElement[] = [];

    for (let i = 0; i < count; i++) {
      const sparkle = document.createElement('div');
      const posX = x !== undefined ? x + (Math.random() - 0.5) * 100 : Math.random() * 100;
      const posY = y !== undefined ? y + (Math.random() - 0.5) * 100 : Math.random() * 100;
      const size = 4 + Math.random() * 8;
      const delay = Math.random() * 1.5;
      const dur = 0.6 + Math.random() * 0.8;

      sparkle.innerHTML = '✨';
      sparkle.style.cssText = `
        position: absolute;
        left: ${posX}%;
        top: ${posY}%;
        font-size: ${size}px;
        pointer-events: none;
        animation: sparkle ${dur}s ease-in-out ${delay}s infinite;
      `;
      container.appendChild(sparkle);
      sparkles.push(sparkle);
    }

    return () => { sparkles.forEach(s => s.remove()); };
  }, [active, x, y, count]);

  if (!active) return null;
  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-40" />;
}
