// src/pages/ExamTake.tsx
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import { supabase } from '../lib/supabase';
import { hasUsedFreeExam, markFreeExamUsed } from '../utils/guestLimits';

interface ExamRow {
  id: string;
  title: string;
  duration_minutes: number;
  question_ids: string[];
}

export const ExamTake: React.FC = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isSubscribed } = useSubscription();
  const { questions } = useAppData();

  const [exam, setExam] = useState<ExamRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<{ correct: number; wrong: number; skipped: number; score: number } | null>(null);
  const [startedAt] = useState(Date.now());

  // Guest হয়ে থাকলে (login নেই) আর আগে থেকেই ১টা ফ্রি এক্সাম ব্যবহার হয়ে
  // থাকলে, এবং সাবস্ক্রাইবও না থাকলে — এই পেজে ঢোকাই আটকে দাও।
  const blocked = !user && !isSubscribed && hasUsedFreeExam();

  useEffect(() => {
    if (!examId || blocked) return;
    supabase
      .from('exams')
      .select('id, title, duration_minutes, question_ids')
      .eq('id', examId)
      .single()
      .then(({ data }) => {
        setExam(data);
        if (data) setSecondsLeft(data.duration_minutes * 60);
        setLoading(false);
      });
  }, [examId, blocked]);

  const examQuestions = useMemo(() => {
    if (!exam) return [];
    return exam.question_ids.map(id => questions.find(q => q.id === id)!).filter(Boolean);
  }, [exam, questions]);

  const submitResult = useCallback(async () => {
    if (!exam || finished) return;
    setFinished(true);
    let correct = 0, wrong = 0, skipped = 0;
    examQuestions.forEach(q => {
      const ans = answers[q.id];
      if (ans === undefined || ans === null) skipped++;
      else if (ans === q.answerIndex) correct++;
      else wrong++;
    });
    const score = correct - wrong * 0.25;
    setResult({ correct, wrong, skipped, score });

    if (!isSubscribed) markFreeExamUsed(); // guest ও ফ্রি-লগইন উভয়ের জন্যই ১বারের সীমা মার্ক হয়

    if (user) {
      await supabase.from('exam_submissions').upsert(
        {
          exam_id: exam.id,
          user_id: user.id,
          total_questions: examQuestions.length,
          correct_answers: correct,
          wrong_answers: wrong,
          skipped,
          score,
          time_taken_seconds: Math.round((Date.now() - startedAt) / 1000)
        },
        { onConflict: 'exam_id,user_id' }
      );
    }
    // Guest হলে ফলাফল শুধু এই স্ক্রিনেই দেখানো হয়, সেভ হয় না —
    // কারণ Supabase-এ user_id ছাড়া সাবমিশন রাখার উপায় নেই।
  }, [exam, finished, examQuestions, answers, startedAt, user, isSubscribed]);

  useEffect(() => {
    if (!exam || finished) return;
    if (secondsLeft <= 0) {
      submitResult();
      return;
    }
    const t = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft, exam, finished, submitResult]);

  if (blocked) {
    return (
      <div className="min-h-screen bg-paper pb-24 dark:bg-ink-900">
        <Header title="এক্সাম" showBack />
        <main className="mx-auto max-w-lg px-4 py-10 text-center">
          <p className="text-4xl">👑</p>
          <p className="mt-3 text-sm text-ink-500">তোমার ফ্রি এক্সাম ব্যবহার হয়ে গেছে — প্রিমিয়াম নিয়ে আনলিমিটেড এক্সাম দাও।</p>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-paper pb-24 dark:bg-ink-900">
        <Header title="এক্সাম" showBack />
        <main className="mx-auto max-w-lg px-4 py-10 text-center text-sm text-ink-400">লোড হচ্ছে...</main>
      </div>
    );
  }

  if (!exam || examQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-paper pb-24 dark:bg-ink-900">
        <Header title="এক্সাম" showBack />
        <main className="mx-auto max-w-lg px-4 py-10 text-center text-sm text-ink-500">এই এক্সামটি পাওয়া যায়নি।</main>
      </div>
    );
  }

  if (finished && result) {
    return (
      <div className="min-h-screen bg-paper pb-24 dark:bg-ink-900">
        <Header title="ফলাফল" showBack />
        <main className="mx-auto max-w-lg space-y-4 px-4 py-8 text-center">
          <p className="text-5xl">🏁</p>
          <p className="font-display text-2xl text-ink-900 dark:text-ink-100">{exam.title} শেষ হয়েছে</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-leaf/10 p-3">
              <p className="text-xl font-bold text-leaf-dark dark:text-leaf">{result.correct}</p>
              <p className="text-xs text-ink-500">সঠিক</p>
            </div>
            <div className="rounded-xl bg-brick/10 p-3">
              <p className="text-xl font-bold text-brick-dark dark:text-brick">{result.wrong}</p>
              <p className="text-xs text-ink-500">ভুল</p>
            </div>
            <div className="rounded-xl bg-amber/10 p-3">
              <p className="text-xl font-bold text-amber-dark dark:text-amber">{result.score.toFixed(2)}</p>
              <p className="text-xs text-ink-500">স্কোর / {examQuestions.length}</p>
            </div>
          </div>
          {!user && (
            <p className="rounded-xl bg-amber/10 p-3 text-xs text-amber-dark dark:text-amber">
              এই ফলাফল সেভ হয়নি — লগইন করে থাকলে ফলাফল স্থায়ীভাবে সেভ হয়ে যেত।
            </p>
          )}
          <button
            onClick={() => navigate(user ? '/exam-results' : '/subscription')}
            className="w-full rounded-full bg-amber py-2.5 text-sm font-semibold text-ink-950"
          >
            {user ? 'আমার সব রেজাল্ট দেখো' : '👑 প্রিমিয়াম নাও'}
          </button>
        </main>
      </div>
    );
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');
  const answeredCount = Object.values(answers).filter(a => a !== null && a !== undefined).length;

  return (
    <div className="min-h-screen bg-paper pb-24 dark:bg-ink-900">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-ink-200 bg-paper/95 px-4 py-3 backdrop-blur dark:border-ink-700/50 dark:bg-ink-900/95">
        <span className="text-sm text-ink-500">{answeredCount}/{examQuestions.length} উত্তর দেওয়া</span>
        <span className={`font-mono text-lg font-semibold ${secondsLeft < 60 ? 'text-brick' : 'text-ink-800 dark:text-ink-100'}`}>
          {mm}:{ss}
        </span>
      </div>
      <main className="mx-auto max-w-lg space-y-4 px-4 py-4">
        {examQuestions.map((q, idx) => (
          <div key={q.id} className="rounded-2xl border border-ink-200 bg-white p-5 dark:border-ink-700/40 dark:bg-ink-800">
            <p className="text-xs text-ink-400">প্রশ্ন {idx + 1}</p>
            <p className="mt-1 font-display text-base text-ink-900 dark:text-ink-100">{q.question}</p>
            <div className="mt-3 flex flex-col gap-2">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setAnswers(a => ({ ...a, [q.id]: i }))}
                  className={`rounded-xl border px-4 py-2.5 text-left text-sm ${
                    answers[q.id] === i ? 'border-amber bg-amber/10' : 'border-ink-200 dark:border-ink-700/50'
                  }`}
                >
                  <span className="mr-2 text-xs">{String.fromCharCode(65 + i)}.</span>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
        <button onClick={submitResult} className="w-full rounded-full bg-leaf py-3 text-sm font-semibold text-white">
          এক্সাম জমা দাও
        </button>
      </main>
    </div>
  );
};
