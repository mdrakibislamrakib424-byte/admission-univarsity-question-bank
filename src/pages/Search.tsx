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
    <div className="pb-24">
      <Header title="খুঁজো" />
      <main className="mx-auto max-w-lg px-4 py-4">
        <input
          autoFocus
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="যেমন: বঙ্কিমচন্দ্র, Preposition, সন্ধি..."
          className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-800 outline-none focus:border-amber dark:border-ink-700/50 dark:bg-ink-800 dark:text-ink-100"
        />

        {query && (
          <p className="mt-3 text-sm text-ink-500">{results.length}টি ফলাফল</p>
        )}

        <ul className="mt-2 divide-y divide-ink-200 overflow-hidden rounded-xl border border-ink-200 dark:divide-ink-700/40 dark:border-ink-700/40">
          {results.map(q => (
            <li key={q.id}>
              <button
                onClick={() => navigate(`/practice?ids=${q.id}`)}
                className="flex w-full flex-col items-start gap-1 bg-white px-4 py-3 text-left dark:bg-ink-800"
              >
                <span className="text-xs text-ink-400">{q.university} · {q.subject} · {q.chapter}</span>
                <span className="line-clamp-2 text-sm text-ink-800 dark:text-ink-100">{q.question}</span>
              </button>
            </li>
          ))}
        </ul>

        {query && results.length === 0 && (
          <p className="mt-8 text-center text-sm text-ink-400">কোনো প্রশ্ন পাওয়া যায়নি।</p>
        )}
      </main>
    </div>
  );
};
