// src/pages/Register.tsx
import React, { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';

export const Register: React.FC = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 6) s++;
    if (password.length >= 10) s++;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) s++;
    return s; // 0-3
  }, [password]);

  const strengthLabel = ['খুবই দুর্বল', 'দুর্বল', 'ভালো', 'শক্তিশালী'][strength];
  const strengthColor = ['bg-brick', 'bg-amber', 'bg-amber', 'bg-leaf'][strength];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('সব ঘর পূরণ করো।');
      return;
    }
    if (password.length < 6) {
      setError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      return;
    }
    setLoading(true);
    setError(null);
    const err = await signUp(email, password, name);
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-paper pb-24 dark:bg-ink-900">
      <Header title="নতুন অ্যাকাউন্ট" showBack />
      <main className="mx-auto max-w-lg px-4 py-6">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-leaf to-leaf-dark text-4xl shadow-lg shadow-leaf/20">
            🎓
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-ink-900 dark:text-ink-100">যাত্রা শুরু করো</h1>
          <p className="mt-1 text-sm text-ink-500">প্রগ্রেস ট্র্যাক করো, লিডারবোর্ডে জায়গা করে নাও</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-ink-200 bg-white p-5 shadow-sm dark:border-ink-700/40 dark:bg-ink-800">
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-ink-700 dark:text-ink-200">
              <span>🧑</span> নাম
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full rounded-2xl border border-ink-200 bg-paper px-4 py-3 text-sm outline-none transition-colors focus:border-leaf focus:ring-2 focus:ring-leaf/20 dark:border-ink-700/50 dark:bg-ink-900 dark:text-ink-100"
              placeholder="তোমার নাম"
            />
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-ink-700 dark:text-ink-200">
              <span>📧</span> ইমেইল
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-ink-200 bg-paper px-4 py-3 text-sm outline-none transition-colors focus:border-leaf focus:ring-2 focus:ring-leaf/20 dark:border-ink-700/50 dark:bg-ink-900 dark:text-ink-100"
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
                className="w-full rounded-2xl border border-ink-200 bg-paper px-4 py-3 pr-12 text-sm outline-none transition-colors focus:border-leaf focus:ring-2 focus:ring-leaf/20 dark:border-ink-700/50 dark:bg-ink-900 dark:text-ink-100"
                placeholder="কমপক্ষে ৬ অক্ষর"
              />
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-ink-400"
              >
                {showPassword ? '🙈 লুকাও' : '👁️ দেখো'}
              </button>
            </div>
            {password && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full ${i < strength ? strengthColor : 'bg-ink-100 dark:bg-ink-700'}`} />
                  ))}
                </div>
                <p className="mt-1 text-xs text-ink-400">পাসওয়ার্ডের শক্তি: {strengthLabel}</p>
              </div>
            )}
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
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-leaf to-leaf-dark py-3 text-sm font-semibold text-white shadow-md shadow-leaf/30 transition-transform active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                তৈরি হচ্ছে...
              </>
            ) : (
              'অ্যাকাউন্ট বানাও'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          আগে থেকেই অ্যাকাউন্ট আছে?{' '}
          <Link to="/login" className="font-semibold text-amber-dark dark:text-amber">
            লগইন করো
          </Link>
        </p>
      </main>
    </div>
  );
};
