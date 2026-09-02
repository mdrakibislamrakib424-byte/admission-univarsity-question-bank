// src/pages/ExamResults.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface SubmissionRow {
  id: string;
  exam_id: string;
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
  score: number;
  submitted_at: string;
  exams: { title: string } | null;
}

export const ExamResults: React.FC = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState<SubmissionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    supabase
      .from('exam_submissions')
      .select('id, exam_id, total_questions, correct_answers, wrong_answers, score, submitted_at, exams(title)')
      .eq('user_id', user.id)
      .order('submitted_at', { ascending: false })
      .then(({ data }) => {
        setRows((data as any) || []);
        setLoading(false);
      });
  }, [user]);

  const avgAccuracy = useMemo(() => {
    if (rows.length === 0) return 0;
    const total = rows.reduce((s, r) => s + r.correct_answers / r.total_questions, 0);
    return Math.round((total / rows.length) * 100);
  }, [rows]);

  const scoreColor = (pct: number) => (pct >= 70 ? 'text-leaf-dark dark:text-leaf' : pct >= 40 ? 'text-amber-dark dark:text-amber' : 'text-brick-dark dark:text-brick');

  if (!user) {
    return (
      <div className="min-h-screen bg-paper pb-24 dark:bg-ink-900">
        <Header title="আমার রেজাল্ট" showBack />
        <main className="mx-auto max-w-lg px-4 py-14 text-center">
          <p className="text-4xl">🔐</p>
          <p className="mt-3 text-sm text-ink-500">রেজাল্ট দেখতে আগে লগইন করো।</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper pb-24 dark:bg-ink-900">
      <Header title="আমার এক্সাম রেজাল্ট" showBack />
      <main className="mx-auto max-w-lg space-y-5 px-4 py-5">
        {!loading && rows.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-ink-200 bg-white p-4 text-center dark:border-ink-700/40 dark:bg-ink-800">
              <p className="text-2xl font-bold text-ink-900 dark:text-ink-100">{rows.length}</p>
              <p className="text-xs text-ink-400">মোট এক্সাম দেওয়া হয়েছে</p>
            </div>
            <div className="rounded-2xl border border-ink-200 bg-white p-4 text-center dark:border-ink-700/40 dark:bg-ink-800">
              <p className={`text-2xl font-bold ${scoreColor(avgAccuracy)}`}>{avgAccuracy}%</p>
              <p className="text-xs text-ink-400">গড় সঠিক উত্তরের হার</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-ink-100 dark:bg-ink-800" />
            ))}
          </div>
        )}

        {!loading && rows.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-ink-200 py-14 text-center dark:border-ink-700/50">
            <span className="text-4xl">📭</span>
            <p className="text-sm text-ink-400">এখনো কোনো এক্সাম দাওনি।</p>
          </div>
        )}

        <div className="space-y-3">
          {rows.map(r => {
            const pct = Math.round((r.correct_answers / r.total_questions) * 100);
            return (
              <div
                key={r.id}
                className="flex items-center gap-3 rounded-2xl border border-ink-200 bg-white p-4 shadow-sm dark:border-ink-700/40 dark:bg-ink-800"
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-paper text-sm font-bold dark:bg-ink-900 ${scoreColor(pct)}`}>
                  {pct}%
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink-800 dark:text-ink-100">{r.exams?.title || 'এক্সাম'}</p>
                  <p className="mt-0.5 text-xs text-ink-400">
                    {new Date(r.submitted_at).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <div className="mt-1 flex items-center gap-3 text-xs">
                    <span className="text-leaf-dark dark:text-leaf">✅ {r.correct_answers}</span>
                    <span className="text-brick-dark dark:text-brick">❌ {r.wrong_answers}</span>
                    <span className="text-ink-400">স্কোর {r.score.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
