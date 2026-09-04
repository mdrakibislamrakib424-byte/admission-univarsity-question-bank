// src/pages/EnglishSection.tsx
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { useAppData } from '../context/AppDataContext';
import { useSubscription } from '../hooks/useSubscription';
import { englishTopics } from '../data/topics';
import { isTopicLocked } from '../utils/contentGate';
import { UpgradeBanner } from '../components/UpgradeBanner';

export const EnglishSection: React.FC = () => {
  const { questions } = useAppData();
  const { isSubscribed, loading } = useSubscription();
  const englishQuestions = useMemo(() => questions.filter(q => q.subject === 'English'), [questions]);

  const topicCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const q of englishQuestions) {
      map.set(q.chapter, (map.get(q.chapter) || 0) + 1);
    }
    return englishTopics.map(t => ({ topic: t, count: map.get(t) || 0 }));
  }, [englishQuestions]);

  return (
    <div className="min-h-screen bg-paper pb-24 dark:bg-ink-900">
      <Header title="English" showBack />
      <main className="mx-auto max-w-lg space-y-5 px-4 py-5">
        <section className="rounded-2xl border border-ink-200 bg-white p-4 dark:border-ink-700/40 dark:bg-ink-800">
          <p className="text-sm text-ink-500">মোট প্রশ্ন</p>
          <p className="text-2xl font-bold text-ink-900 dark:text-ink-100">{englishQuestions.length}টি</p>
        </section>

        {!loading && !isSubscribed && (
          <UpgradeBanner title="সব টপিক আনলক করো" subtitle="এখন শুধু ১টা টপিক ফ্রি — প্রিমিয়ামে সবগুলো খুলে যাবে" />
        )}

        <section>
          <h2 className="mb-2 text-sm font-semibold text-ink-700 dark:text-ink-200">টপিক অনুযায়ী</h2>
          <div className="grid grid-cols-2 gap-2">
            {topicCounts.map(({ topic, count }) => {
              const locked = !loading && isTopicLocked(topic, englishTopics, isSubscribed);
              const content = (
                <div
                  className={`relative rounded-xl border p-3 text-sm ${
                    locked
                      ? 'border-dashed border-ink-200 bg-ink-50 dark:border-ink-700/40 dark:bg-ink-900/40'
                      : 'border-ink-200 bg-white dark:border-ink-700/40 dark:bg-ink-800'
                  }`}
                >
                  <p className={`font-medium ${locked ? 'text-ink-400' : 'text-ink-800 dark:text-ink-100'}`}>{topic}</p>
                  <p className="text-xs text-ink-400">{locked ? '🔒 প্রিমিয়াম' : `${count}টি প্রশ্ন`}</p>
                </div>
              );
              return locked ? (
                <Link key={topic} to="/subscription">{content}</Link>
              ) : (
                <Link key={topic} to={`/practice?subject=${encodeURIComponent('English')}&chapter=${encodeURIComponent(topic)}`}>
                  {content}
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};
