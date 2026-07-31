'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { SITE_CONFIG } from '@/config';

// Prevent search indexing
export const metadata = { robots: 'noindex, nofollow' };

/** Bypass page — password-protected review mode */
export default function BypassPage() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [passwords, setPasswords] = useState<string[]>([]);
  const [newPw, setNewPw] = useState('');
  const [showManage, setShowManage] = useState(false);

  // Load auth state
  useEffect(() => {
    const stored = localStorage.getItem('bypass_auth');
    if (stored === 'true') setIsAuthed(true);
    const storedPws = localStorage.getItem('bypass_passwords');
    setPasswords(storedPws ? JSON.parse(storedPws) : [...SITE_CONFIG.REVIEW_PASSWORDS]);
  }, []);

  const handleLogin = () => {
    const validPasswords = passwords.length > 0 ? passwords : SITE_CONFIG.REVIEW_PASSWORDS;
    if (validPasswords.includes(password)) {
      setIsAuthed(true);
      localStorage.setItem('bypass_auth', 'true');
      setError('');
    } else {
      setError('Invalid password');
      setTimeout(() => setError(''), 2000);
    }
  };

  const handleLogout = () => {
    setIsAuthed(false);
    localStorage.removeItem('bypass_auth');
    setPassword('');
  };

  const addPassword = () => {
    if (newPw && !passwords.includes(newPw)) {
      const updated = [...passwords, newPw];
      setPasswords(updated);
      localStorage.setItem('bypass_passwords', JSON.stringify(updated));
      setNewPw('');
    }
  };

  const removePassword = (pw: string) => {
    const updated = passwords.filter(p => p !== pw);
    setPasswords(updated);
    localStorage.setItem('bypass_passwords', JSON.stringify(updated));
  };

  // Login screen
  if (!isAuthed) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 flex items-center justify-center p-4"
        style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)' }}
      >
        <GlassCard strong className="p-8 w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold text-white mb-2">🔒 Review Mode</h1>
          <p className="text-white/60 text-sm mb-6">Enter review password</p>
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
        </GlassCard>
      </motion.div>
    );
  }

  // Authenticated — review dashboard
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 overflow-auto p-4"
      style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)' }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">🎬 Review Mode</h1>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowManage(!showManage)}>
              {showManage ? 'Hide' : '⚙️ Manage'}
            </Button>
            <Button variant="ghost" onClick={handleLogout}>Logout</Button>
          </div>
        </div>

        {/* Password management */}
        <AnimatePresence>
          {showManage && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <GlassCard className="p-4">
                <h2 className="text-white font-semibold mb-3">Review Passwords</h2>
                <div className="space-y-2 mb-4">
                  {passwords.map(pw => (
                    <div key={pw} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                      <span className="text-white/80 font-mono text-sm">{pw}</span>
                      <button onClick={() => removePassword(pw)} className="text-red-400 hover:text-red-300 text-sm">✕</button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={newPw}
                    onChange={e => setNewPw(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addPassword()}
                    placeholder="New password"
                    className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder-white/40 outline-none"
                  />
                  <Button variant="primary" onClick={addPassword} className="text-sm px-4">Add</Button>
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
