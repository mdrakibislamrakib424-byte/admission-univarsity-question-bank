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
    <div className="pb-24">
      <Header title="🔮 প্রেডিক্টেড প্রশ্ন" showBack />
      <main className="mx-auto max-w-lg space-y-4 px-4 py-5">
        <p className="rounded-xl bg-paper p-3 text-xs leading-relaxed text-ink-400 dark:bg-ink-900/40">
          এটা জেনারেটিভ AI-এর অনুমান না — বরং ডেটা-ভিত্তিক র‍্যাংকিং। প্রশ্নব্যাংকে কোন প্রশ্নগুলো বারবার এসেছে ও সাম্প্রতিক
          বছরগুলোতেও এসেছে, তার ভিত্তিতে এই তালিকা বানানো হয়েছে — তাই এগুলো আবার আসার সম্ভাবনা বেশি।
        </p>

        <div className="flex gap-2">
          <select
            value={university}
            onChange={e => setUniversity(e.target.value)}
            className="flex-1 rounded-lg border border-ink-200 bg-white px-2 py-2 text-sm dark:border-ink-700/50 dark:bg-ink-800"
          >
            <option value="">সব বিশ্ববিদ্যালয়</option>
            {universities.map(u => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
          <select
            value={subject}
            onChange={e => setSubject(e.target.value)}
            className="flex-1 rounded-lg border border-ink-200 bg-white px-2 py-2 text-sm dark:border-ink-700/50 dark:bg-ink-800"
          >
            <option value="">সব বিষয়</option>
            {subjects.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {predicted.length === 0 && (
          <p className="mt-8 text-center text-sm text-ink-400">এই ফিল্টারে যথেষ্ট repeat হওয়া প্রশ্ন পাওয়া যায়নি।</p>
        )}

        <ul className="space-y-2">
          {predicted.map(({ question: q, reason }) => (
            <li key={q.id} className="rounded-xl border border-ink-200 bg-white p-4 dark:border-ink-700/50 dark:bg-ink-800">
              <p className="text-xs text-ink-400">{q.university}{q.unit ? ` ${q.unit}` : ''} · {q.year} · {q.subject} / {q.chapter}</p>
              <p className="mt-1 text-sm text-ink-800 dark:text-ink-100">{q.question}</p>
              <p className="mt-1 text-xs text-amber-dark dark:text-amber">📈 {reason}</p>
              <div className="mt-2 flex gap-4">
                <button onClick={() => toggleBookmark(q.id)} className="text-xs text-ink-400 hover:text-amber">
                  {isBookmarked(q.id) ? '⭐ সেভ করা আছে' : '☆ সেভ করো'}
                </button>
                <button onClick={() => addToRevision(q.id)} className="text-xs text-ink-400 hover:text-amber">
                  🧠 মুখস্থ তালিকায় যোগ করো
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};
