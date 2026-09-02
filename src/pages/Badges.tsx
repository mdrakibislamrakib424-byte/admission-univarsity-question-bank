import React from 'react';
import { Header } from '../components/Header';
import { useAppData } from '../context/AppDataContext';
import { BADGES } from '../utils/badges';

export const Badges: React.FC = () => {
  const { userData } = useAppData();
  const earnedSet = new Set(userData.earnedBadges);
  const earnedCount = userData.earnedBadges.length;
  const totalCount = BADGES.length;
  const pct = totalCount ? Math.round((earnedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-paper pb-24 dark:bg-ink-900">
      <Header title="🏅 ব্যাজ" showBack />
      <main className="mx-auto max-w-lg space-y-6 px-4 py-5">
        {/* প্রগ্রেস হিরো */}
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-amber via-amber to-amber-dark p-6 text-center text-ink-950 shadow-lg shadow-amber/30">
          <p className="text-5xl">🏆</p>
          <p className="mt-2 text-3xl font-bold">{earnedCount} / {totalCount}</p>
          <p className="text-sm opacity-80">ব্যাজ অর্জিত হয়েছে</p>
          <div className="mx-auto mt-4 h-2.5 w-full max-w-xs overflow-hidden rounded-full bg-ink-950/15">
            <div className="h-full rounded-full bg-ink-950/70 transition-all duration-700" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-1.5 text-xs opacity-70">{pct}% সম্পূর্ণ</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {BADGES.map(b => {
            const earned = earnedSet.has(b.id);
            return (
              <div
                key={b.id}
                className={`relative overflow-hidden rounded-2xl border p-4 text-center transition-transform ${
                  earned
                    ? 'border-amber/50 bg-gradient-to-b from-amber/15 to-transparent shadow-sm active:scale-95'
                    : 'border-dashed border-ink-200 bg-white dark:border-ink-700/50 dark:bg-ink-800'
                }`}
              >
                {earned && (
                  <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-leaf text-[10px] text-white">
                    ✓
                  </span>
                )}
                <p className={`text-4xl ${earned ? '' : 'opacity-25 grayscale'}`}>{b.icon}</p>
                <p className={`mt-2 text-sm font-semibold ${earned ? 'text-ink-800 dark:text-ink-100' : 'text-ink-400'}`}>
                  {b.label}
                </p>
                <p className="mt-0.5 text-xs text-ink-400">{b.description}</p>
                {!earned && <p className="mt-1.5 text-[10px] font-medium uppercase tracking-wide text-ink-300">🔒 লকড</p>}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
