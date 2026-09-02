// src/pages/EnglishSection.tsx
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { useAppData } from '../context/AppDataContext';
import { englishTopics } from '../data/topics';

export const EnglishSection: React.FC = () => {
  const { questions } = useAppData();
  const englishQuestions = useMemo(() => questions.filter(q => q.subject === 'English'), [questions]);

  const topicCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const q of englishQuestions) {
      map.set(q.chapter, (map.get(q.chapter) || 0) + 1);
    }
    return englishTopics.map(t => ({ topic: t, count: map.get(t) || 0 }));
  }, [englishQuestions]);

  return (
    <div className="pb-24">
      <Header title="English" showBack />
      <main className="mx-auto max-w-lg space-y-5 px-4 py-5">
        <section className="rounded-2xl border border-ink-200 bg-white p-4 dark:border-ink-700/40 dark:bg-ink-800">
          <p className="text-sm text-ink-500">মোট প্রশ্ন</p>
          <p className="text-2xl font-bold text-ink-900 dark:text-ink-100">{englishQuestions.length}টি</p>
          <Link
            to={`/practice?subject=${encodeURIComponent('English')}`}
            className="mt-3 block rounded-full bg-amber py-2.5 text-center text-sm font-semibold text-ink-950"
          >
            সব English প্রশ্ন প্র্যাকটিস করো
          </Link>
        </section>

        <section>
          <h2 className="mb-2 text-sm font-semibold text-ink-700 dark:text-ink-200">টপিক অনুযায়ী</h2>
          <div className="grid grid-cols-2 gap-2">
            {topicCounts.map(({ topic, count }) => (
              <Link
                key={topic}
                to={`/practice?subject=${encodeURIComponent('English')}&chapter=${encodeURIComponent(topic)}`}
                className="rounded-xl border border-ink-200 bg-white p-3 text-sm dark:border-ink-700/40 dark:bg-ink-800"
              >
                <p className="font-medium text-ink-800 dark:text-ink-100">{topic}</p>
                <p className="text-xs text-ink-400">{count}টি প্রশ্ন</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
