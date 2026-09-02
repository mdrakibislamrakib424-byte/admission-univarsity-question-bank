// src/pages/ExamList.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../hooks/useSubscription';

interface ExamRow {
  id: string;
  title: string;
  duration_minutes: number;
  question_ids: string[];
}

export const ExamList: React.FC = () => {
  const { user } = useAuth();
  const { isSubscribed, loading: subLoading } = useSubscription();
  const [exams, setExams] = useState<ExamRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('exams')
      .select('id, title, duration_minutes, question_ids')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setExams(data || []);
        setLoading(false);
      });
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-paper pb-24 dark:bg-ink-900">
        <Header title="📝 এক্সাম" showBack />
        <main className="mx-auto max-w-lg px-4 py-14 text-center">
          <p className="text-4xl">🔐</p>
          <p className="mt-3 text-sm text-ink-500">
            এক্সাম দিতে <Link to="/login" className="font-semibold text-amber-dark dark:text-amber">লগইন করো</Link>।
          </p>
        </main>
      </div>
    );
  }

  if (!subLoading && !isSubscribed) {
    return (
      <div className="min-h-screen bg-paper pb-24 dark:bg-ink-900">
        <Header title="📝 এক্সাম" showBack />
        <main className="mx-auto max-w-lg px-4 py-10 text-center">
          <div className="rounded-3xl bg-gradient-to-br from-ink-900 to-ink-700 p-8 text-white dark:from-ink-800 dark:to-ink-950">
            <p className="text-5xl">👑</p>
            <p className="mt-3 font-display text-lg font-bold">এক্সাম শুধু প্রিমিয়াম মেম্বারদের জন্য</p>
            <p className="mt-1 text-sm opacity-80">৳৮৫০ দিয়ে ৬ মাসের প্রিমিয়াম নিয়ে সব এক্সামে অংশ নাও।</p>
            <Link to="/subscription" className="mt-5 block rounded-full bg-amber py-2.5 text-sm font-semibold text-ink-950">
              👑 প্রিমিয়াম নাও
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper pb-24 dark:bg-ink-900">
      <Header title="📝 এক্সাম" showBack />
      <main className="mx-auto max-w-lg space-y-4 px-4 py-5">
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-ink-100 dark:bg-ink-800" />
            ))}
          </div>
        )}

        {!loading && exams.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-ink-200 py-14 text-center dark:border-ink-700/50">
            <span className="text-4xl">🗂️</span>
            <p className="text-sm text-ink-400">এখনো কোনো এক্সাম যোগ করা হয়নি।</p>
          </div>
        )}

        <div className="space-y-3">
          {exams.map(exam => (
            <div
              key={exam.id}
              className="overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-sm dark:border-ink-700/40 dark:bg-ink-800"
            >
              <div className="flex items-center gap-3 border-b border-ink-100 bg-gradient-to-r from-amber/10 to-transparent p-4 dark:border-ink-700/40">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber/20 text-lg">📄</span>
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink-800 dark:text-ink-100">{exam.title}</p>
                  <div className="mt-0.5 flex items-center gap-3 text-xs text-ink-400">
                    <span>📊 {exam.question_ids.length}টি প্রশ্ন</span>
                    <span>⏱️ {exam.duration_minutes} মিনিট</span>
                  </div>
                </div>
              </div>
              <div className="p-3">
                <Link
                  to={`/exam/${exam.id}`}
                  className="block rounded-full bg-amber py-2.5 text-center text-sm font-semibold text-ink-950 transition-transform active:scale-[0.98]"
                >
                  এক্সাম শুরু করো →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <Link
          to="/exam-results"
          className="flex items-center justify-center gap-1.5 rounded-2xl border border-ink-200 py-3 text-sm font-medium text-ink-600 dark:border-ink-700/50 dark:text-ink-300"
        >
          📄 আমার আগের রেজাল্ট দেখো
        </Link>
      </main>
    </div>
  );
};
