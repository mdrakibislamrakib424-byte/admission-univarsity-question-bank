// src/pages/DailyLesson.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { fetchLast30DaysProgress, DailyProgressRow, todayDateStr } from '../utils/dailyProgressSync';

const DAILY_GOAL = 15;

export const DailyLesson: React.FC = () => {
  const { user } = useAuth();
  const { userData } = useAppData();
  const [rows, setRows] = useState<DailyProgressRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetchLast30DaysProgress(user.id).then(r => {
      setRows(r);
      setLoading(false);
    });
  }, [user]);

  const today = todayDateStr();
  const todayRow = rows.find(r => r.progress_date === today);
  const todayCount = todayRow?.questions_done ?? 0;
  const todayPercent = Math.min(100, Math.round((todayCount / DAILY_GOAL) * 100));

  const last30 = useMemo(() => {
    const map = new Map(rows.map(r => [r.progress_date, r]));
    const days: { date: string; count: number; label: string }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const row = map.get(key);
      days.push({ date: key, count: row?.questions_done ?? 0, label: String(d.getDate()) });
    }
    return days;
  }, [rows]);

  const intensity = (count: number) => {
    if (count === 0) return 'bg-ink-100 dark:bg-ink-800';
    if (count < 5) return 'bg-amber/30';
    if (count < 10) return 'bg-amber/60';
    if (count < DAILY_GOAL) return 'bg-leaf/60';
    return 'bg-leaf';
  };

  if (!user) {
    return (
      <div className="pb-24">
        <Header title="আজকের পড়া" showBack />
        <main className="mx-auto max-w-lg space-y-4 px-4 py-10 text-center">
          <p className="text-4xl">📅</p>
          <p className="text-sm text-ink-500">
            প্রতিদিনের পড়া তারিখসহ সেভ করতে ও নিজের progress history দেখতে{' '}
            <Link to="/login" className="font-semibold text-amber-dark dark:text-amber">লগইন করো</Link>।
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <Header title="আজকের পড়া" showBack />
      <main className="mx-auto max-w-lg space-y-6 px-4 py-5">
        {/* আজকের লক্ষ্য — বড়, স্পষ্ট রিং প্রোগ্রেস */}
        <section className="rounded-2xl border border-ink-200 bg-white p-6 text-center dark:border-ink-700/40 dark:bg-ink-800">
          <div className="relative mx-auto h-32 w-32">
            <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
              <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="10" className="text-ink-100 dark:text-ink-700" />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 52}
                strokeDashoffset={2 * Math.PI * 52 * (1 - todayPercent / 100)}
                className="text-amber transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-ink-900 dark:text-ink-100">{todayCount}</span>
              <span className="text-xs text-ink-400">/ {DAILY_GOAL} লক্ষ্য</span>
            </div>
          </div>
          <p className="mt-4 font-display text-lg text-ink-900 dark:text-ink-100">
            {todayCount >= DAILY_GOAL ? '🎉 আজকের লক্ষ্য পূরণ হয়েছে!' : `আজ আর ${Math.max(0, DAILY_GOAL - todayCount)}টি প্রশ্ন বাকি`}
          </p>
          <div className="mt-4 flex items-center justify-center gap-6 text-sm">
            <div>
              <p className="font-semibold text-amber-dark dark:text-amber">🔥 {userData.streak.count}</p>
              <p className="text-xs text-ink-400">দিনের স্ট্রিক</p>
            </div>
            <div>
              <p className="font-semibold text-leaf-dark dark:text-leaf">{todayRow?.correct_done ?? 0}</p>
              <p className="text-xs text-ink-400">আজ সঠিক</p>
            </div>
          </div>
          <Link
            to="/practice"
            className="mt-5 block rounded-full bg-amber py-2.5 text-center text-sm font-semibold text-ink-950"
          >
            {todayCount >= DAILY_GOAL ? 'আরও প্র্যাকটিস করো' : 'আজকের পড়া শুরু করো'}
          </Link>
        </section>

        {/* গত ৩০ দিনের হিটম্যাপ — GitHub contribution graph স্টাইল */}
        <section>
          <h2 className="mb-3 font-display text-base text-ink-900 dark:text-ink-100">গত ৩০ দিনের ইতিহাস</h2>
          {loading ? (
            <p className="text-sm text-ink-400">লোড হচ্ছে...</p>
          ) : (
            <div className="rounded-2xl border border-ink-200 bg-white p-4 dark:border-ink-700/40 dark:bg-ink-800">
              <div className="grid grid-cols-10 gap-1.5">
                {last30.map(d => (
                  <div
                    key={d.date}
                    title={`${d.date}: ${d.count}টি প্রশ্ন`}
                    className={`flex aspect-square items-center justify-center rounded-md text-[9px] ${intensity(d.count)} ${
                      d.date === today ? 'ring-2 ring-amber' : ''
                    }`}
                  >
                    <span className={d.count > 0 ? 'text-ink-700 dark:text-ink-900' : 'text-ink-300 dark:text-ink-600'}>
                      {d.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-ink-400">
                <span>কম</span>
                <span className="h-3 w-3 rounded bg-ink-100 dark:bg-ink-800" />
                <span className="h-3 w-3 rounded bg-amber/30" />
                <span className="h-3 w-3 rounded bg-amber/60" />
                <span className="h-3 w-3 rounded bg-leaf/60" />
                <span className="h-3 w-3 rounded bg-leaf" />
                <span>বেশি</span>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
