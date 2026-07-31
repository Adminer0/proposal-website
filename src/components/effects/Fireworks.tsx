'use client';

import { useEffect, useRef } from 'react';

interface FireworksProps {
  active: boolean;
  duration?: number;
}

/** Canvas-based fireworks with realistic physics */
export default function Fireworks({ active, duration = 5000 }: FireworksProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#FF6B8A', '#FFB3BA', '#BAE1FF', '#BAFFC9', '#FFFFBA', '#E8BAFF', '#FFD9BA', '#FF8FA3'];
    const rockets: { x: number; y: number; targetY: number; vy: number; color: string; exploded: boolean }[] = [];
    const particles: { x: number; y: number; vx: number; vy: number; color: string; alpha: number; size: number }[] = [];
    const trails: { x: number; y: number; alpha: number }[] = [];

    const launchRocket = () => {
      const x = Math.random() * canvas.width * 0.6 + canvas.width * 0.2;
      rockets.push({
        x,
        y: canvas.height,
        targetY: Math.random() * canvas.height * 0.3 + canvas.height * 0.1,
        vy: -(8 + Math.random() * 4),
        color: colors[Math.floor(Math.random() * colors.length)],
        exploded: false,
      });
    };

    const explode = (x: number, y: number, color: string) => {
      const count = 60 + Math.floor(Math.random() * 40);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
        const speed = 2 + Math.random() * 4;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: Math.random() > 0.3 ? color : colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          size: 1.5 + Math.random() * 2,
        });
      }
    };

    let frame: number;
    let rocketTimer = 0;
    const start = Date.now();

    // Launch rockets periodically
    launchRocket();
    const rocketInterval = setInterval(() => {
      if (Date.now() - start < duration) launchRocket();
    }, 600 + Math.random() * 400);

    const animate = () => {
      const elapsed = Date.now() - start;
      if (elapsed > duration + 2000) {
        cancelAnimationFrame(frame);
        clearInterval(rocketInterval);
        return;
      }

      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.y += r.vy;
        r.vy += 0.05; // gravity

        // Draw trail
        trails.push({ x: r.x, y: r.y, alpha: 0.8 });
        if (trails.length > 30) trails.shift();

        // Draw rocket
        ctx.fillStyle = r.color;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
        ctx.fill();

        // Explode at target
        if (r.y <= r.targetY || r.vy >= 0) {
          explode(r.x, r.y, r.color);
          rockets.splice(i, 1);
        }
      }

      // Draw trails
      for (let i = trails.length - 1; i >= 0; i--) {
        const t = trails[i];
        t.alpha -= 0.03;
        if (t.alpha <= 0) { trails.splice(i, 1); continue; }
        ctx.fillStyle = `rgba(255, 255, 255, ${t.alpha})`;
        ctx.beginPath();
        ctx.arc(t.x, t.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04; // gravity
        p.vx *= 0.99;
        p.alpha -= 0.012;

        if (p.alpha <= 0) { particles.splice(i, 1); continue; }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      clearInterval(rocketInterval);
    };
  }, [active, duration]);

  if (!active) return null;
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />;
}
