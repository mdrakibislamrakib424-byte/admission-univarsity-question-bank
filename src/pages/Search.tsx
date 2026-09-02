import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { useAppData } from '../context/AppDataContext';

export const Search: React.FC = () => {
  const { questions } = useAppData();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return questions
      .filter(item => {
        const haystack = [
          item.question,
          item.subject,
          item.chapter,
          item.university,
          item.options.join(' '),
          item.explanation.correct,
          ...(item.tags || [])
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(q);
      })
      .slice(0, 50);
  }, [query, questions]);

  return (
    <div className="min-h-screen bg-paper pb-24 dark:bg-ink-900">
      <Header title="খুঁজো" />
      <main className="mx-auto max-w-lg px-4 py-4">
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔍</span>
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="যেমন: বঙ্কিমচন্দ্র, Preposition, সন্ধি..."
            className="w-full rounded-2xl border border-ink-200 bg-white py-3.5 pl-11 pr-4 text-sm text-ink-800 shadow-sm outline-none transition-colors focus:border-amber focus:ring-2 focus:ring-amber/20 dark:border-ink-700/50 dark:bg-ink-800 dark:text-ink-100"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-ink-400"
            >
              ✕
            </button>
          )}
        </div>

        {query && (
          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm text-ink-500">
              <span className="font-semibold text-ink-800 dark:text-ink-100">{results.length}</span>টি ফলাফল
            </p>
          </div>
        )}

        <ul className="mt-3 space-y-2">
          {results.map(q => (
            <li key={q.id}>
              <button
                onClick={() => navigate(`/practice?ids=${q.id}`)}
                className="flex w-full flex-col items-start gap-1.5 rounded-2xl border border-ink-200 bg-white px-4 py-3.5 text-left shadow-sm transition-transform active:scale-[0.98] dark:border-ink-700/40 dark:bg-ink-800"
              >
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="rounded-full bg-amber/15 px-2 py-0.5 text-[11px] font-medium text-amber-dark dark:text-amber">
                    {q.university}
                  </span>
                  <span className="text-[11px] text-ink-400">{q.subject} · {q.chapter}</span>
                </div>
                <span className="line-clamp-2 text-sm text-ink-800 dark:text-ink-100">{q.question}</span>
              </button>
            </li>
          ))}
        </ul>

        {!query && (
          <div className="mt-16 flex flex-col items-center gap-2 text-center">
            <span className="text-5xl">🔎</span>
            <p className="text-sm text-ink-400">যেকোনো শব্দ, বিষয় বা বিশ্ববিদ্যালয়ের নাম লিখে খুঁজে দেখো</p>
          </div>
        )}

        {query && results.length === 0 && (
          <div className="mt-16 flex flex-col items-center gap-2 text-center">
            <span className="text-5xl">🙁</span>
            <p className="text-sm text-ink-400">"{query}" এর জন্য কোনো প্রশ্ন পাওয়া যায়নি।</p>
          </div>
        )}
      </main>
    </div>
  );
};
