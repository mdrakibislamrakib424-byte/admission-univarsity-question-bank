import React from 'react';
import { Header } from '../components/Header';
import { useAppData } from '../context/AppDataContext';
import { BADGES } from '../utils/badges';

export const Badges: React.FC = () => {
  const { userData } = useAppData();
  const earnedSet = new Set(userData.earnedBadges);

  return (
    <div className="pb-24">
      <Header title="🏅 ব্যাজ" showBack />
      <main className="mx-auto max-w-lg space-y-4 px-4 py-5">
        <p className="text-sm text-ink-500">
          তুমি {userData.earnedBadges.length} / {BADGES.length}টি ব্যাজ জিতেছো।
        </p>
        <div className="grid grid-cols-2 gap-3">
          {BADGES.map(b => {
            const earned = earnedSet.has(b.id);
            return (
              <div
                key={b.id}
                className={`rounded-xl border p-4 text-center ${
                  earned
                    ? 'border-amber/50 bg-amber/10'
                    : 'border-ink-200 bg-white opacity-50 dark:border-ink-700/50 dark:bg-ink-800'
                }`}
              >
                <p className="text-3xl">{b.icon}</p>
                <p className="mt-1 text-sm font-semibold text-ink-800 dark:text-ink-100">{b.label}</p>
                <p className="mt-0.5 text-xs text-ink-400">{b.description}</p>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
