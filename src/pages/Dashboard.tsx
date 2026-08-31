import React from 'react';
import { Header } from '../components/Header';
import { useAppData } from '../context/AppDataContext';

export const Dashboard: React.FC = () => {
  const { stats, userData, weakTopics } = useAppData();

  return (
    <div className="pb-24">
      <Header title="অগ্রগতি" />
      <main className="mx-auto max-w-lg space-y-6 px-4 py-5">
        <section className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-ink-200 bg-white p-3 text-center dark:border-ink-700/50 dark:bg-ink-800">
            <p className="text-xl font-semibold text-ink-900 dark:text-ink-100">{stats.totalAttempts}</p>
            <p className="text-xs text-ink-400">মোট প্রশ্ন</p>
          </div>
          <div className="rounded-xl border border-ink-200 bg-white p-3 text-center dark:border-ink-700/50 dark:bg-ink-800">
            <p className="text-xl font-semibold text-leaf-dark dark:text-leaf">{stats.accuracy}%</p>
            <p className="text-xs text-ink-400">Accuracy</p>
          </div>
          <div className="rounded-xl border border-ink-200 bg-white p-3 text-center dark:border-ink-700/50 dark:bg-ink-800">
            <p className="text-xl font-semibold text-amber-dark dark:text-amber">🔥 {userData.streak.count}</p>
            <p className="text-xs text-ink-400">দিনের streak</p>
          </div>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg text-ink-900 dark:text-ink-100">দুর্বল বিষয় বিশ্লেষণ</h2>
          {weakTopics.length === 0 && (
            <p className="text-sm text-ink-400">প্র্যাকটিস শুরু করলে এখানে তোমার দুর্বল বিষয় দেখা যাবে।</p>
          )}
          <div className="space-y-2">
            {weakTopics.map(t => {
              const color = t.accuracy >= 80 ? 'bg-leaf' : t.accuracy >= 60 ? 'bg-amber' : 'bg-brick';
              const emoji = t.accuracy >= 80 ? '✅' : t.accuracy >= 60 ? '⚠️' : '🔴';
              return (
                <div key={t.subject} className="rounded-lg border border-ink-200 bg-white p-3 dark:border-ink-700/50 dark:bg-ink-800">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink-800 dark:text-ink-100">{t.subject}</span>
                    <span className="text-ink-500">{emoji} {t.accuracy}% ({t.attempts}টি)</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-ink-700">
                    <div className={`h-full ${color}`} style={{ width: `${t.accuracy}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          {weakTopics[0] && (
            <p className="mt-3 rounded-lg bg-brick/10 p-3 text-sm text-brick-dark dark:text-brick">
              তোমার সবচেয়ে দুর্বল অংশ: <b>{weakTopics[0].subject}</b> — এখানে বেশি প্র্যাকটিস করো।
            </p>
          )}
        </section>
      </main>
    </div>
  );
};
