import React, { useMemo, useState } from 'react';
import { Header } from '../components/Header';
import { useAppData } from '../context/AppDataContext';
import { getPredictedQuestions } from '../utils/predictions';

export const Predictions: React.FC = () => {
  const { questions, addToRevision, toggleBookmark, isBookmarked } = useAppData();
  const [university, setUniversity] = useState('');
  const [subject, setSubject] = useState('');

  const universities = useMemo(() => Array.from(new Set(questions.map(q => q.university))).sort(), [questions]);
  const subjects = useMemo(() => Array.from(new Set(questions.map(q => q.subject))).sort(), [questions]);

  const predicted = useMemo(
    () => getPredictedQuestions(questions, { university: university || undefined, subject: subject || undefined, limit: 40 }),
    [questions, university, subject]
  );

  return (
    <div className="min-h-screen bg-paper pb-24 dark:bg-ink-900">
      <Header title="🔮 প্রেডিক্টেড প্রশ্ন" showBack />
      <main className="mx-auto max-w-lg space-y-4 px-4 py-5">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-ink-900 to-ink-700 p-5 text-white dark:from-ink-800 dark:to-ink-950">
          <p className="text-2xl">📈</p>
          <p className="mt-1 text-sm font-semibold">ডেটা-ভিত্তিক র‍্যাংকিং</p>
          <p className="mt-1 text-xs leading-relaxed opacity-80">
            এটা AI-এর অনুমান না — কোন প্রশ্ন বারবার ও সাম্প্রতিক বছরগুলোতেও এসেছে তার ভিত্তিতে এই তালিকা বানানো হয়েছে।
          </p>
        </div>

        <div className="flex gap-2">
          <select
            value={university}
            onChange={e => setUniversity(e.target.value)}
            className="flex-1 rounded-2xl border border-ink-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber dark:border-ink-700/50 dark:bg-ink-800"
          >
            <option value="">সব বিশ্ববিদ্যালয়</option>
            {universities.map(u => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
          <select
            value={subject}
            onChange={e => setSubject(e.target.value)}
            className="flex-1 rounded-2xl border border-ink-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber dark:border-ink-700/50 dark:bg-ink-800"
          >
            <option value="">সব বিষয়</option>
            {subjects.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {predicted.length === 0 && (
          <div className="mt-10 flex flex-col items-center gap-2 text-center">
            <span className="text-4xl">🔍</span>
            <p className="text-sm text-ink-400">এই ফিল্টারে যথেষ্ট repeat হওয়া প্রশ্ন পাওয়া যায়নি।</p>
          </div>
        )}

        <ul className="space-y-2">
          {predicted.map(({ question: q, reason }, idx) => (
            <li key={q.id} className="rounded-2xl border border-ink-200 bg-white p-4 shadow-sm dark:border-ink-700/40 dark:bg-ink-800">
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber/15 text-xs font-bold text-amber-dark dark:text-amber">
                  {idx + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-ink-400">{q.university}{q.unit ? ` ${q.unit}` : ''} · {q.year} · {q.subject} / {q.chapter}</p>
                  <p className="mt-1 text-sm text-ink-800 dark:text-ink-100">{q.question}</p>
                  <p className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-amber/10 px-2.5 py-1 text-xs text-amber-dark dark:text-amber">
                    📈 {reason}
                  </p>
                  <div className="mt-2.5 flex gap-4">
                    <button onClick={() => toggleBookmark(q.id)} className="text-xs text-ink-400 hover:text-amber">
                      {isBookmarked(q.id) ? '⭐ সেভ করা আছে' : '☆ সেভ করো'}
                    </button>
                    <button onClick={() => addToRevision(q.id)} className="text-xs text-ink-400 hover:text-amber">
                      🧠 মুখস্থ তালিকায় যোগ করো
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};
