// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const err = await signIn(email, password);
    setLoading(false);
    if (err) {
      setError(err === 'Invalid login credentials' ? 'ইমেইল বা পাসওয়ার্ড ভুল হয়েছে।' : err);
      return;
    }
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-paper pb-24 dark:bg-ink-900">
      <Header title="লগইন" showBack />
      <main className="mx-auto max-w-lg px-4 py-6">
        {/* হিরো সেকশন */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-amber to-amber-dark text-4xl shadow-lg shadow-amber/20">
            👋
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-ink-900 dark:text-ink-100">আবার স্বাগতম</h1>
          <p className="mt-1 text-sm text-ink-500">তোমার প্রোগ্রেস, লিডারবোর্ড ও এক্সাম রেজাল্টে ফিরে যাও</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-ink-200 bg-white p-5 shadow-sm dark:border-ink-700/40 dark:bg-ink-800">
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-ink-700 dark:text-ink-200">
              <span>📧</span> ইমেইল
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full rounded-2xl border border-ink-200 bg-paper px-4 py-3 text-sm outline-none transition-colors focus:border-amber focus:ring-2 focus:ring-amber/20 dark:border-ink-700/50 dark:bg-ink-900 dark:text-ink-100"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-ink-700 dark:text-ink-200">
              <span>🔒</span> পাসওয়ার্ড
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full rounded-2xl border border-ink-200 bg-paper px-4 py-3 pr-12 text-sm outline-none transition-colors focus:border-amber focus:ring-2 focus:ring-amber/20 dark:border-ink-700/50 dark:bg-ink-900 dark:text-ink-100"
                placeholder="তোমার পাসওয়ার্ড"
              />
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-ink-400"
              >
                {showPassword ? '🙈 লুকাও' : '👁️ দেখো'}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-2xl bg-brick/10 p-3 text-sm text-brick-dark dark:text-brick">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber to-amber-dark py-3 text-sm font-semibold text-ink-950 shadow-md shadow-amber/30 transition-transform active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-950 border-t-transparent" />
                লগইন হচ্ছে...
              </>
            ) : (
              'লগইন করো'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          অ্যাকাউন্ট নেই?{' '}
          <Link to="/register" className="font-semibold text-amber-dark dark:text-amber">
            নতুন অ্যাকাউন্ট বানাও
          </Link>
        </p>
      </main>
    </div>
  );
};
