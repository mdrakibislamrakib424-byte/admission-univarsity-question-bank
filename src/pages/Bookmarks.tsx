import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { useAppData } from '../context/AppDataContext';
import { exportQuestionsAsPDF } from '../utils/printExport';
import { Question } from '../types';

export const Bookmarks: React.FC = () => {
  const { userData, questions } = useAppData();
  const saved = userData.bookmarks.map(id => questions.find(q => q.id === id)).filter(Boolean) as Question[];

  return (
    <div className="min-h-screen bg-paper pb-24 dark:bg-ink-900">
      <Header title="🔖 সেভ করা প্রশ্ন" showBack />
      <main className="mx-auto max-w-lg px-4 py-5">
        {saved.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-2 text-center">
            <span className="text-5xl">📌</span>
            <p className="text-sm text-ink-400">এখনো কোনো প্রশ্ন সেভ করোনি।</p>
            <p className="text-xs text-ink-300">প্র্যাকটিসের সময় ⭐ আইকনে চাপলে প্রশ্ন এখানে জমা হবে।</p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber/15 to-transparent p-4">
              <span className="text-3xl">🔖</span>
              <div>
                <p className="font-semibold text-ink-800 dark:text-ink-100">{saved.length}টি প্রশ্ন সেভ করা আছে</p>
                <p className="text-xs text-ink-400">যেকোনো সময় রিভিশন দাও</p>
              </div>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-2">
              <Link
                to="/practice?mode=bookmarks"
                className="rounded-full bg-amber py-2.5 text-center text-sm font-semibold text-ink-950 transition-transform active:scale-[0.98]"
              >
                ▶️ প্র্যাকটিস করো
              </Link>
              <button
                onClick={() => exportQuestionsAsPDF(saved, 'সেভ করা প্রশ্ন')}
                className="rounded-full border border-ink-200 py-2.5 text-center text-sm font-semibold text-ink-700 transition-transform active:scale-[0.98] dark:border-ink-700/50 dark:text-ink-200"
              >
                📄 PDF করো
              </button>
            </div>

            <ul className="space-y-2">
              {saved.map(q => (
                <li key={q.id}>
                  <Link
                    to={`/practice?ids=${q.id}`}
                    className="flex flex-col gap-1.5 rounded-2xl border border-ink-200 bg-white px-4 py-3.5 shadow-sm transition-transform active:scale-[0.98] dark:border-ink-700/40 dark:bg-ink-800"
                  >
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="rounded-full bg-amber/15 px-2 py-0.5 text-[11px] font-medium text-amber-dark dark:text-amber">
                        {q.university}
                      </span>
                      <span className="text-[11px] text-ink-400">{q.subject} · {q.chapter}</span>
                    </div>
                    <span className="line-clamp-2 text-sm text-ink-800 dark:text-ink-100">{q.question}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
};
