import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { useAppData } from '../context/AppDataContext';
import { todayStr } from '../utils/storage';
import { ExamCountdown } from '../components/ExamCountdown';

const UNIVERSITIES = ['DU', 'RU', 'CU', 'JU', 'JnU', 'KU', 'SUST', 'GST'];

export const Home: React.FC = () => {
  const { questions, stats, userData, dueRevisionItems } = useAppData();

  const subjects = useMemo(() => {
    const map = new Map<string, number>();
    for (const q of questions) map.set(q.subject, (map.get(q.subject) || 0) + 1);
    return Array.from(map.entries());
  }, [questions]);

  const dailyIds = useMemo(() => {
    const dc = userData.dailyChallenge;
    if (dc && dc.date === todayStr()) return dc.questionIds;
    // deterministic-ish daily pick
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(10, shuffled.length)).map(q => q.id);
  }, [questions, userData.dailyChallenge]);

  return (
    <div className="pb-24">
      <Header title="প্রশ্নব্যাংক" />
      <main className="mx-auto max-w-lg space-y-6 px-4 py-5">
        <section>
          <p className="font-display text-2xl leading-snug text-ink-900 dark:text-ink-100">
            আজ কী পড়বে?
          </p>
          <p className="mt-1 text-sm text-ink-500">
            আজকে তুমি {stats.todayAttempts}টি প্রশ্ন করেছো, সঠিক {stats.todayCorrect}টি।
          </p>
        </section>

        <Link
          to="/practice?mode=daily"
          className="block rounded-2xl bg-gradient-to-br from-amber to-amber-dark p-5 text-ink-950 shadow-md"
        >
          <p className="text-xs font-semibold uppercase tracking-wide opacity-80">আজকের চ্যালেঞ্জ</p>
          <p className="mt-1 font-display text-xl">{dailyIds.length} প্রশ্ন · ১০ মিনিট</p>
          <p className="mt-1 text-sm opacity-90">শেষ করলে তোমার streak বাড়বে 🔥</p>
        </Link>

        <ExamCountdown />

        {dueRevisionItems.length > 0 && (
          <Link
            to="/memorization"
            className="flex items-center justify-between rounded-2xl border border-leaf/40 bg-leaf/10 p-4"
          >
            <div>
              <p className="font-medium text-leaf-dark dark:text-leaf">🧠 আজকের রিভিশন রেডি</p>
              <p className="text-sm text-ink-500">{dueRevisionItems.length}টি প্রশ্ন মনে করার সময় হয়েছে</p>
            </div>
            <span className="text-leaf-dark dark:text-leaf">→</span>
          </Link>
        )}

        <section>
          <h2 className="mb-2 font-display text-lg text-ink-900 dark:text-ink-100">বিশ্ববিদ্যালয় অনুযায়ী</h2>
          <div className="grid grid-cols-4 gap-2">
            {UNIVERSITIES.map(u => (
              <Link
                key={u}
                to={`/browse?university=${u}`}
                className="flex flex-col items-center justify-center rounded-xl border border-ink-200 bg-white py-3 text-sm font-semibold text-ink-700 hover:border-amber dark:border-ink-700/50 dark:bg-ink-800 dark:text-ink-200"
              >
                {u}
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg text-ink-900 dark:text-ink-100">বিষয় অনুযায়ী</h2>
          <ul className="divide-y divide-ink-200 overflow-hidden rounded-xl border border-ink-200 dark:divide-ink-700/40 dark:border-ink-700/40">
            {subjects.map(([subject, count]) => (
              <li key={subject}>
                <Link
                  to={`/browse?subject=${encodeURIComponent(subject)}`}
                  className="flex items-center justify-between border-l-4 border-transparent bg-white px-4 py-3 hover:border-amber dark:bg-ink-800"
                >
                  <span className="text-ink-800 dark:text-ink-100">{subject}</span>
                  <span className="text-xs text-ink-400">{count}টি প্রশ্ন</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="grid grid-cols-2 gap-3">
          <Link to="/mistakes" className="rounded-xl border border-ink-200 bg-white p-4 dark:border-ink-700/50 dark:bg-ink-800">
            <p className="text-2xl">❌</p>
            <p className="mt-1 text-sm font-medium text-ink-800 dark:text-ink-100">আমার ভুলগুলো</p>
            <p className="text-xs text-ink-400">{userData.mistakes.length}টি</p>
          </Link>
          <Link to="/bookmarks" className="rounded-xl border border-ink-200 bg-white p-4 dark:border-ink-700/50 dark:bg-ink-800">
            <p className="text-2xl">🔖</p>
            <p className="mt-1 text-sm font-medium text-ink-800 dark:text-ink-100">সেভ করা প্রশ্ন</p>
            <p className="text-xs text-ink-400">{userData.bookmarks.length}টি</p>
          </Link>
        </section>
      </main>
    </div>
  );
};

