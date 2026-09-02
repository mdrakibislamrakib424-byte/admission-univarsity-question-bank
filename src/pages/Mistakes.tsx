import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { useAppData } from '../context/AppDataContext';
import { exportQuestionsAsPDF } from '../utils/printExport';
import { Question } from '../types';

export const Mistakes: React.FC = () => {
  const { userData, questions } = useAppData();
  const mistakeQuestions = userData.mistakes.map(id => questions.find(q => q.id === id)).filter(Boolean) as Question[];

  return (
    <div className="min-h-screen bg-paper pb-24 dark:bg-ink-900">
      <Header title="❌ আমার ভুলগুলো" showBack />
      <main className="mx-auto max-w-lg px-4 py-5">
        {mistakeQuestions.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-2 text-center">
            <span className="text-5xl">🎉</span>
            <p className="text-sm font-medium text-ink-700 dark:text-ink-200">এখনো কোনো ভুল নেই — চালিয়ে যাও!</p>
            <p className="text-xs text-ink-400">প্র্যাকটিস করলে ভুল প্রশ্নগুলো এখানে জমা হবে, রিভিশনের জন্য।</p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-brick/15 to-transparent p-4">
              <span className="text-3xl">🎯</span>
              <div>
                <p className="font-semibold text-ink-800 dark:text-ink-100">{mistakeQuestions.length}টি প্রশ্নে ভুল হয়েছিল</p>
                <p className="text-xs text-ink-400">এগুলো আবার করলে দুর্বলতা কমে যাবে</p>
              </div>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-2">
              <Link
                to="/practice?mode=mistakes"
                className="rounded-full bg-amber py-2.5 text-center text-sm font-semibold text-ink-950 transition-transform active:scale-[0.98]"
              >
                🔁 আবার প্র্যাকটিস
              </Link>
              <button
                onClick={() => exportQuestionsAsPDF(mistakeQuestions, 'আমার ভুলগুলো')}
                className="rounded-full border border-ink-200 py-2.5 text-center text-sm font-semibold text-ink-700 transition-transform active:scale-[0.98] dark:border-ink-700/50 dark:text-ink-200"
              >
                📄 PDF করো
              </button>
            </div>

            <ul className="space-y-2">
              {mistakeQuestions.map(q => (
                <li key={q.id}>
                  <Link
                    to={`/practice?ids=${q.id}`}
                    className="flex flex-col gap-1.5 rounded-2xl border border-brick/20 bg-white px-4 py-3.5 shadow-sm transition-transform active:scale-[0.98] dark:border-brick/20 dark:bg-ink-800"
                  >
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="rounded-full bg-brick/10 px-2 py-0.5 text-[11px] font-medium text-brick-dark dark:text-brick">
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
