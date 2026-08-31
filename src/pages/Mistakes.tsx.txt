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
    <div className="pb-24">
      <Header title="আমার ভুলগুলো" showBack />
      <main className="mx-auto max-w-lg px-4 py-5">
        {mistakeQuestions.length === 0 ? (
          <p className="mt-8 text-center text-sm text-ink-400">এখনো কোনো ভুল নেই — চালিয়ে যাও! 🎉</p>
        ) : (
          <>
            <Link
              to="/practice?mode=mistakes"
              className="mb-3 block rounded-full bg-amber py-2.5 text-center text-sm font-semibold text-ink-950"
            >
              সবগুলো আবার প্র্যাকটিস করো ({mistakeQuestions.length}টি)
            </Link>
            <button
              onClick={() => exportQuestionsAsPDF(mistakeQuestions, 'আমার ভুলগুলো')}
              className="mb-4 block w-full rounded-full border border-ink-200 py-2.5 text-center text-sm font-semibold text-ink-700 dark:border-ink-700/50 dark:text-ink-200"
            >
              📄 PDF এক্সপোর্ট করো
            </button>
            <ul className="divide-y divide-ink-200 overflow-hidden rounded-xl border border-ink-200 dark:divide-ink-700/40 dark:border-ink-700/40">
              {mistakeQuestions.map(q => (
                <li key={q.id}>
                  <Link to={`/practice?ids=${q.id}`} className="flex flex-col gap-1 bg-white px-4 py-3 dark:bg-ink-800">
                    <span className="text-xs text-ink-400">{q.university} · {q.subject} · {q.chapter}</span>
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
