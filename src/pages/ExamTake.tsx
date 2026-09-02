// src/pages/ExamTake.tsx
//
// MockTest.tsx এর মতোই প্যাটার্ন ব্যবহার করা হয়েছে (সব প্রশ্ন এক পেজে,
// টাইমার শেষ হলে বা "জমা দাও" চাপলে অটো সাবমিট) — যাতে দুই জায়গার UX
// একরকম থাকে ও কোনো বাগ না হয়।

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSubscription } from '../hooks/useSubscription';
import { Header } from '../components/Header';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

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
  const { isSubscribed, loading: subLoading } = useSubscription();
  const { questions } = useAppData();

  const [exam, setExam] = useState<ExamRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<{ correct: number; wrong: number; skipped: number; score: number } | null>(null);
  const [startedAt] = useState(Date.now());

  useEffect(() => {
    if (!examId) return;
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
  }, [examId]);

  const examQuestions = useMemo(() => {
    if (!exam) return [];
    return exam.question_ids.map(id => questions.find(q => q.id === id)!).filter(Boolean);
  }, [exam, questions]);

  const submitResult = useCallback(async () => {
    if (!exam || !user || finished) return;
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
  }, [exam, user, finished, examQuestions, answers, startedAt]);

  useEffect(() => {
    if (!exam || finished) return;
    if (secondsLeft <= 0) {
      submitResult();
      return;
    }
    const t = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft, exam, finished, submitResult]);

  if (!user) {
    return (
      <div className="pb-24">
        <Header title="এক্সাম" showBack />
        <main className="mx-auto max-w-lg px-4 py-10 text-center text-sm text-ink-500">
          এক্সাম দিতে আগে লগইন করো।
        </main>
      </div>
    );
  }

  if (!subLoading && !isSubscribed) {
    return (
      <div className="pb-24">
        <Header title="এক্সাম" showBack />
        <main className="mx-auto max-w-lg px-4 py-10 text-center">
          <p className="text-4xl">👑</p>
          <p className="mt-3 text-sm text-ink-500">এক্সাম দিতে প্রিমিয়াম সাবস্ক্রিপশন লাগবে।</p>
        </main>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="pb-24">
        <Header title="এক্সাম" showBack />
        <main className="mx-auto max-w-lg px-4 py-10 text-center text-sm text-ink-400">লোড হচ্ছে...</main>
      </div>
    );
  }

  if (!exam || examQuestions.length === 0) {
    return (
      <div className="pb-24">
        <Header title="এক্সাম" showBack />
        <main className="mx-auto max-w-lg px-4 py-10 text-center text-sm text-ink-500">এই এক্সামটি পাওয়া যায়নি।</main>
      </div>
    );
  }

  if (finished && result) {
    return (
      <div className="pb-24">
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
          <button
            onClick={() => navigate('/exam-results')}
            className="w-full rounded-full bg-amber py-2.5 text-sm font-semibold text-ink-950"
          >
            আমার সব রেজাল্ট দেখো
          </button>
        </main>
      </div>
    );
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');
  const answeredCount = Object.values(answers).filter(a => a !== null && a !== undefined).length;

  return (
    <div className="pb-24">
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
