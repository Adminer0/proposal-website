'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { SITE_CONFIG } from '@/config';
import type { SceneId } from '@/types';

import Scene1Cake from '@/components/scenes/Scene1Cake';
import Scene2CakeInteraction from '@/components/scenes/Scene2CakeInteraction';
import Scene3ParkWalk from '@/components/scenes/Scene3ParkWalk';
import Scene4Proposal from '@/components/scenes/Scene4Proposal';
import Scene5RingChase from '@/components/scenes/Scene5RingChase';
import Scene6Comfort from '@/components/scenes/Scene6Comfort';
import Scene7Proposal from '@/components/scenes/Scene7Proposal';
import FinalScene from '@/components/scenes/FinalScene';

type Role = 'admin' | 'user' | null;

const SCENES: { id: SceneId; name: string; emoji: string }[] = [
  { id: 'scene1', name: 'Birthday Cake', emoji: '🎂' },
  { id: 'scene2', name: 'Cake Interaction', emoji: '🍰' },
  { id: 'scene3', name: 'Park Walk', emoji: '🌅' },
  { id: 'scene4', name: 'Proposal', emoji: '💍' },
  { id: 'scene5', name: 'Ring Chase', emoji: '🦅' },
  { id: 'scene6', name: 'Comfort', emoji: '🛋️' },
  { id: 'scene7', name: 'The Question', emoji: '❤️' },
  { id: 'final', name: 'Starry Ending', emoji: '⭐' },
];

/** Bypass page — password-protected review mode with live preview */
export default function BypassPage() {
  const [role, setRole] = useState<Role>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [adminPasswords, setAdminPasswords] = useState<string[]>([]);
  const [userPasswords, setUserPasswords] = useState<string[]>([]);
  const [usedPasswords, setUsedPasswords] = useState<string[]>([]);
  const [newPw, setNewPw] = useState('');
  const [newPwRole, setNewPwRole] = useState<'admin' | 'user'>('user');
  const [showManage, setShowManage] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);

  // Preview state
  const [viewMode, setViewMode] = useState<'dashboard' | 'preview'>('dashboard');
  const [currentScene, setCurrentScene] = useState(0);

  // Load state
  useEffect(() => {
    const storedAdmin = localStorage.getItem('bypass_admin_pws');
    const storedUser = localStorage.getItem('bypass_user_pws');
    const storedUsed = localStorage.getItem('bypass_used_pws');
    const storedRole = localStorage.getItem('bypass_role') as Role;

    setAdminPasswords(storedAdmin ? JSON.parse(storedAdmin) : [...SITE_CONFIG.ADMIN_PASSWORDS]);
    setUserPasswords(storedUser ? JSON.parse(storedUser) : [...SITE_CONFIG.USER_PASSWORDS]);
    setUsedPasswords(storedUsed ? JSON.parse(storedUsed) : []);

    if (storedRole) setRole(storedRole);
  }, []);

  // Countdown for users
  useEffect(() => {
    if (role !== 'user' || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { handleLogout(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [role, timeLeft]);

  const handleLogin = () => {
    const pw = password.trim();
    if (!pw) return;

    if (adminPasswords.includes(pw)) {
      setRole('admin');
      localStorage.setItem('bypass_role', 'admin');
      localStorage.setItem('bypass_auth', 'true');
      setError('');
      return;
    }

    if (userPasswords.includes(pw)) {
      if (usedPasswords.includes(pw)) {
        setError('This password has already been used and expired.');
        setTimeout(() => setError(''), 3000);
        return;
      }
      const updatedUsed = [...usedPasswords, pw];
      setUsedPasswords(updatedUsed);
      localStorage.setItem('bypass_used_pws', JSON.stringify(updatedUsed));
      setRole('user');
      localStorage.setItem('bypass_role', 'user');
      localStorage.setItem('bypass_auth', 'true');
      setError('');
      return;
    }

    setError('Invalid password');
    setTimeout(() => setError(''), 2000);
  };

  const handleLogout = () => {
    setRole(null);
    setPassword('');
    setTimeLeft(300);
    setViewMode('dashboard');
    setCurrentScene(0);
    localStorage.removeItem('bypass_role');
    localStorage.removeItem('bypass_auth');
  };

  const addPassword = () => {
    const pw = newPw.trim();
    if (!pw) return;
    if (newPwRole === 'admin') {
      if (adminPasswords.includes(pw)) return;
      const updated = [...adminPasswords, pw];
      setAdminPasswords(updated);
      localStorage.setItem('bypass_admin_pws', JSON.stringify(updated));
    } else {
      if (userPasswords.includes(pw)) return;
      const updated = [...userPasswords, pw];
      setUserPasswords(updated);
      localStorage.setItem('bypass_user_pws', JSON.stringify(updated));
    }
    setNewPw('');
  };

  const removePassword = (pw: string, pwRole: 'admin' | 'user') => {
    if (pwRole === 'admin') {
      const updated = adminPasswords.filter(p => p !== pw);
      setAdminPasswords(updated);
      localStorage.setItem('bypass_admin_pws', JSON.stringify(updated));
    } else {
      const updated = userPasswords.filter(p => p !== pw);
      setUserPasswords(updated);
      localStorage.setItem('bypass_user_pws', JSON.stringify(updated));
    }
  };

  const clearExpired = () => {
    setUsedPasswords([]);
    localStorage.removeItem('bypass_used_pws');
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const handleSceneComplete = useCallback(() => {
    if (currentScene < SCENES.length - 1) setCurrentScene(prev => prev + 1);
  }, [currentScene]);

  // ─── Login ───
  if (!role) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)' }}>
        <GlassCard strong className="p-8 w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold text-white mb-2">🔒 Review Mode</h1>
          <p className="text-white/60 text-sm mb-6">Enter your review password</p>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} placeholder="Password" className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:border-white/40 mb-3" />
          <AnimatePresence>{error && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-400 text-sm mb-3">{error}</motion.p>}</AnimatePresence>
          <Button variant="primary" onClick={handleLogin} className="w-full">Enter</Button>
          <p className="text-white/30 text-xs mt-4">User passwords expire after one use.</p>
        </GlassCard>
      </motion.div>
    );
  }

  // ─── Preview Mode (full interactive website) ───
  if (viewMode === 'preview') {
    return (
      <div className="fixed inset-0">
        {/* Top bar overlay */}
        <div className="fixed top-0 left-0 right-0 z-[300] flex items-center justify-between px-4 py-2" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 100%)' }}>
          <button onClick={() => { setViewMode('dashboard'); setCurrentScene(0); }} className="text-white/80 hover:text-white text-sm flex items-center gap-1">
            ← Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <span className="text-white/50 text-xs">Scene {currentScene + 1}/{SCENES.length}</span>
            {role === 'user' && <span className="text-amber-400/80 font-mono text-xs">⏱ {formatTime(timeLeft)}</span>}
          </div>
        </div>

        {/* Scene navigator (bottom) */}
        <div className="fixed bottom-0 left-0 right-0 z-[300] flex justify-center gap-1.5 px-4 py-3" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.6) 0%, transparent 100%)' }}>
          {SCENES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrentScene(i)}
              className={`px-2.5 py-1 rounded-full text-xs transition-all ${
                i === currentScene ? 'bg-white text-gray-900 font-semibold' : 'bg-white/15 text-white/70 hover:bg-white/25'
              }`}
            >
              {s.emoji}
            </button>
          ))}
        </div>

        {/* Scene renderer */}
        <AnimatePresence mode="wait">
          {currentScene === 0 && <Scene1Cake key="s1" onComplete={handleSceneComplete} />}
          {currentScene === 1 && <Scene2CakeInteraction key="s2" onComplete={handleSceneComplete} />}
          {currentScene === 2 && <Scene3ParkWalk key="s3" onComplete={handleSceneComplete} />}
          {currentScene === 3 && <Scene4Proposal key="s4" onComplete={handleSceneComplete} />}
          {currentScene === 4 && <Scene5RingChase key="s5" onComplete={handleSceneComplete} />}
          {currentScene === 5 && <Scene6Comfort key="s6" onComplete={handleSceneComplete} />}
          {currentScene === 6 && <Scene7Proposal key="s7" onComplete={handleSceneComplete} />}
          {currentScene === 7 && <FinalScene key="final" onComplete={() => { setViewMode('dashboard'); setCurrentScene(0); }} />}
        </AnimatePresence>
      </div>
    );
  }

  // ─── Dashboard ───
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 overflow-auto p-4" style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)' }}>
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">
              {role === 'admin' ? '🎬 Admin Dashboard' : '🎬 Review Mode'}
            </h1>
            <span className={`text-xs px-2 py-0.5 rounded-full ${role === 'admin' ? 'text-emerald-400 bg-emerald-400/10' : 'text-amber-400 bg-amber-400/10'}`}>
              {role === 'admin' ? 'Admin' : 'One-Time'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {role === 'user' && <span className="text-white/60 font-mono text-sm">⏱ {formatTime(timeLeft)}</span>}
            {role === 'admin' && <Button variant="secondary" onClick={() => setShowManage(!showManage)}>{showManage ? 'Hide' : '⚙️ Manage'}</Button>}
            <Button variant="ghost" onClick={handleLogout}>Logout</Button>
          </div>
        </div>

        {/* User warning */}
        {role === 'user' && (
          <GlassCard className="p-3 mb-6 border-amber-500/20">
            <p className="text-amber-300/80 text-sm text-center">⚠️ One-time preview. This password expires after your session.</p>
          </GlassCard>
        )}

        {/* Admin password management */}
        {role === 'admin' && (
          <AnimatePresence>
            {showManage && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-6">
                <GlassCard className="p-5">
                  <h2 className="text-white font-semibold mb-4">Password Management</h2>
                  <div className="flex gap-2 mb-5">
                    <input value={newPw} onChange={e => setNewPw(e.target.value)} onKeyDown={e => e.key === 'Enter' && addPassword()} placeholder="New password" className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder-white/40 outline-none" />
                    <select value={newPwRole} onChange={e => setNewPwRole(e.target.value as 'admin' | 'user')} className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm outline-none">
                      <option value="user" className="bg-gray-800">User (one-time)</option>
                      <option value="admin" className="bg-gray-800">Admin</option>
                    </select>
                    <Button variant="primary" onClick={addPassword} className="text-sm px-4">Add</Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-emerald-400 text-sm font-medium mb-2">🔑 Admin</h3>
                      {adminPasswords.map(pw => (
                        <div key={pw} className="flex items-center justify-between bg-emerald-500/5 border border-emerald-500/10 rounded-lg px-3 py-1.5 mb-1">
                          <span className="text-white/80 font-mono text-xs">{pw}</span>
                          <button onClick={() => removePassword(pw, 'admin')} className="text-red-400 hover:text-red-300 text-xs">✕</button>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-amber-400 text-sm font-medium">🎟️ Users</h3>
                        {usedPasswords.length > 0 && <button onClick={clearExpired} className="text-xs text-white/40 hover:text-white/60 underline">Clear {usedPasswords.length} expired</button>}
                      </div>
                      {userPasswords.map(pw => {
                        const isUsed = usedPasswords.includes(pw);
                        return (
                          <div key={pw} className={`flex items-center justify-between rounded-lg px-3 py-1.5 mb-1 border ${isUsed ? 'bg-red-500/5 border-red-500/10' : 'bg-amber-500/5 border-amber-500/10'}`}>
                            <span className={`font-mono text-xs ${isUsed ? 'text-white/30 line-through' : 'text-white/80'}`}>{pw}</span>
                            {isUsed && <span className="text-[10px] text-red-400 bg-red-400/10 px-1 py-0.5 rounded mr-1">expired</span>}
                            <button onClick={() => removePassword(pw, 'user')} className="text-red-400 hover:text-red-300 text-xs">✕</button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-3 mt-3 border-t border-white/10">
                    <div className="text-center"><p className="text-xl font-bold text-emerald-400">{adminPasswords.length}</p><p className="text-xs text-white/40">Admin</p></div>
                    <div className="text-center"><p className="text-xl font-bold text-amber-400">{userPasswords.length - usedPasswords.length}</p><p className="text-xs text-white/40">Active</p></div>
                    <div className="text-center"><p className="text-xl font-bold text-red-400">{usedPasswords.length}</p><p className="text-xs text-white/40">Expired</p></div>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Preview CTA */}
        <GlassCard strong className="p-6 mb-6 text-center">
          <p className="text-white text-lg font-semibold mb-2">Preview the Experience</p>
          <p className="text-white/50 text-sm mb-4">Walk through the full interactive story as the recipient would see it.</p>
          <Button variant="primary" onClick={() => { setViewMode('preview'); setCurrentScene(0); }} className="text-lg px-8 py-4">
            ▶ Start Preview
          </Button>
        </GlassCard>

        {/* Scene list */}
        <div className="grid gap-3">
          {SCENES.map((s, i) => (
            <GlassCard key={i} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{s.emoji}</span>
                  <div>
                    <h3 className="text-white font-semibold">Scene {i + 1}: {s.name}</h3>
                    <p className="text-white/40 text-xs">Click to jump to this scene</p>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => { setViewMode('preview'); setCurrentScene(i); }} className="text-sm">
                  Play →
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>

        <p className="text-center text-white/30 text-xs mt-8">This page is hidden from navigation and search engines.</p>
      </div>
    </motion.div>
  );
}
