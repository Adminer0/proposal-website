'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { SITE_CONFIG } from '@/config';

type Role = 'admin' | 'user' | null;

/** Bypass page — password-protected review mode with admin/user roles */
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
  const [viewedOnce, setViewedOnce] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 min session for users

  // Load state from localStorage
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

  // Countdown timer for user sessions
  useEffect(() => {
    if (role !== 'user' || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [role, timeLeft]);

  const handleLogin = () => {
    const pw = password.trim();
    if (!pw) return;

    // Check admin passwords
    if (adminPasswords.includes(pw)) {
      setRole('admin');
      localStorage.setItem('bypass_role', 'admin');
      localStorage.setItem('bypass_auth', 'true');
      setError('');
      return;
    }

    // Check user passwords (must not be used)
    if (userPasswords.includes(pw)) {
      if (usedPasswords.includes(pw)) {
        setError('This password has already been used and expired.');
        setTimeout(() => setError(''), 3000);
        return;
      }
      // Mark as used — single use only
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
    setViewedOnce(false);
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

  // ─── Login Screen ───
  if (!role) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 flex items-center justify-center p-4"
        style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)' }}
      >
        <GlassCard strong className="p-8 w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold text-white mb-2">🔒 Review Mode</h1>
          <p className="text-white/60 text-sm mb-6">Enter your review password</p>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:border-white/40 mb-3"
          />
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-400 text-sm mb-3"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
          <Button variant="primary" onClick={handleLogin} className="w-full">
            Enter
          </Button>
          <p className="text-white/30 text-xs mt-4">
            User passwords expire after one use.
          </p>
        </GlassCard>
      </motion.div>
    );
  }

  // ─── User View (one-time, limited) ───
  if (role === 'user') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 overflow-auto p-4"
        style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)' }}
      >
        <div className="max-w-2xl mx-auto">
          {/* Header with timer */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">🎬 Review Mode</h1>
              <span className="text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">One-Time Access</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white/60 font-mono text-sm">⏱ {formatTime(timeLeft)}</span>
              <Button variant="ghost" onClick={handleLogout} className="text-sm">Logout</Button>
            </div>
          </div>

          {/* Warning banner */}
          <GlassCard className="p-3 mb-6 border-amber-500/20">
            <p className="text-amber-300/80 text-sm text-center">
              ⚠️ This is a one-time preview. Your password has expired after this session.
            </p>
          </GlassCard>

          {/* Scene preview cards — view only */}
          <div className="grid gap-4">
            {['Birthday Cake', 'Cake Interaction', 'Park Walk', 'Proposal', 'Ring Chase', 'Comfort', 'The Question', 'Starry Ending'].map((name, i) => (
              <GlassCard key={i} className="p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{['🎂', '🍰', '🌅', '💍', '🦅', '🛋️', '❤️', '⭐'][i]}</span>
                  <div>
                    <h3 className="text-white font-semibold">Scene {i + 1}: {name}</h3>
                    <p className="text-white/50 text-sm">Scene component preview</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          <p className="text-center text-white/30 text-xs mt-8">
            This page is hidden from navigation and search engines.
          </p>
        </div>
      </motion.div>
    );
  }

  // ─── Admin View (full access) ───
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 overflow-auto p-4"
      style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)' }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">🎬 Admin Dashboard</h1>
            <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">Full Access</span>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowManage(!showManage)}>
              {showManage ? 'Hide' : '⚙️ Manage Passwords'}
            </Button>
            <Button variant="ghost" onClick={handleLogout}>Logout</Button>
          </div>
        </div>

        {/* Password Management Panel */}
        <AnimatePresence>
          {showManage && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <GlassCard className="p-5">
                <h2 className="text-white font-semibold mb-4">Password Management</h2>

                {/* Add new password */}
                <div className="flex gap-2 mb-5">
                  <input
                    value={newPw}
                    onChange={e => setNewPw(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addPassword()}
                    placeholder="New password"
                    className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder-white/40 outline-none"
                  />
                  <select
                    value={newPwRole}
                    onChange={e => setNewPwRole(e.target.value as 'admin' | 'user')}
                    className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm outline-none"
                  >
                    <option value="user" className="bg-gray-800">User (one-time)</option>
                    <option value="admin" className="bg-gray-800">Admin</option>
                  </select>
                  <Button variant="primary" onClick={addPassword} className="text-sm px-4">Add</Button>
                </div>

                {/* Admin passwords */}
                <div className="mb-4">
                  <h3 className="text-emerald-400 text-sm font-medium mb-2">🔑 Admin Passwords</h3>
                  <div className="space-y-1.5">
                    {adminPasswords.map(pw => (
                      <div key={pw} className="flex items-center justify-between bg-emerald-500/5 border border-emerald-500/10 rounded-lg px-3 py-2">
                        <span className="text-white/80 font-mono text-sm">{pw}</span>
                        <button onClick={() => removePassword(pw, 'admin')} className="text-red-400 hover:text-red-300 text-sm ml-2">✕</button>
                      </div>
                    ))}
                    {adminPasswords.length === 0 && <p className="text-white/30 text-xs">No admin passwords</p>}
                  </div>
                </div>

                {/* User passwords */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-amber-400 text-sm font-medium">🎟️ User Passwords (one-time)</h3>
                    {usedPasswords.length > 0 && (
                      <button onClick={clearExpired} className="text-xs text-white/40 hover:text-white/60 underline">
                        Clear {usedPasswords.length} expired
                      </button>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    {userPasswords.map(pw => {
                      const isUsed = usedPasswords.includes(pw);
                      return (
                        <div key={pw} className={`flex items-center justify-between rounded-lg px-3 py-2 border ${isUsed ? 'bg-red-500/5 border-red-500/10' : 'bg-amber-500/5 border-amber-500/10'}`}>
                          <div className="flex items-center gap-2">
                            <span className={`font-mono text-sm ${isUsed ? 'text-white/30 line-through' : 'text-white/80'}`}>{pw}</span>
                            {isUsed && <span className="text-xs text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded">expired</span>}
                          </div>
                          <button onClick={() => removePassword(pw, 'user')} className="text-red-400 hover:text-red-300 text-sm ml-2">✕</button>
                        </div>
                      );
                    })}
                    {userPasswords.length === 0 && <p className="text-white/30 text-xs">No user passwords</p>}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-400">{adminPasswords.length}</p>
                    <p className="text-xs text-white/40">Admin</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-amber-400">{userPasswords.length - usedPasswords.length}</p>
                    <p className="text-xs text-white/40">Active</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-400">{usedPasswords.length}</p>
                    <p className="text-xs text-white/40">Expired</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scene preview cards */}
        <div className="grid gap-4">
          {['Birthday Cake', 'Cake Interaction', 'Park Walk', 'Proposal', 'Ring Chase', 'Comfort', 'The Question', 'Starry Ending'].map((name, i) => (
            <GlassCard key={i} className="p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{['🎂', '🍰', '🌅', '💍', '🦅', '🛋️', '❤️', '⭐'][i]}</span>
                <div>
                  <h3 className="text-white font-semibold">Scene {i + 1}: {name}</h3>
                  <p className="text-white/50 text-sm">Scene component preview</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        <p className="text-center text-white/30 text-xs mt-8">
          This page is hidden from navigation and search engines.
        </p>
      </div>
    </motion.div>
  );
}
