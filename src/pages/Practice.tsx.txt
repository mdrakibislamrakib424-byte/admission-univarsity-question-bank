import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { QuestionCard } from '../components/QuestionCard';
import { useAppData } from '../context/AppDataContext';
import { todayStr } from '../utils/storage';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const Practice: React.FC = () => {
  const { questions, userData } = useAppData();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const mode = params.get('mode'); // 'daily' | 'random' | 'mistakes' | 'bookmarks' | null
  const ids = params.get('ids');
  const subject = params.get('subject');
  const chapter = params.get('chapter');
  const count = Number(params.get('count') || 0);

  const sessionQuestions = useMemo(() => {
    if (mode === 'daily') {
      const dc = userData.dailyChallenge;
      if (dc && dc.date === todayStr()) {
        return dc.questionIds.map(id => questions.find(q => q.id === id)!).filter(Boolean);
      }
      return shuffle(questions).slice(0, Math.min(10, questions.length));
    }
    if (mode === 'mistakes') {
      return userData.mistakes.map(id => questions.find(q => q.id === id)!).filter(Boolean);
    }
    if (mode === 'bookmarks') {
      return userData.bookmarks.map(id => questions.find(q => q.id === id)!).filter(Boolean);
    }
    if (ids) {
      const idSet = new Set(ids.split(','));
      return questions.filter(q => idSet.has(q.id));
    }
    let pool = questions;
    if (subject) pool = pool.filter(q => q.subject === subject);
    if (chapter) pool = pool.filter(q => q.chapter === chapter);
    pool = shuffle(pool);
    if (count > 0) pool = pool.slice(0, count);
    return pool;
  }, [mode, ids, subject, chapter, count, questions, userData]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setCurrentIndex(0);
    setCorrectCount(0);
    setWrongCount(0);
    setFinished(false);
  }, [sessionQuestions.length]);

  if (sessionQuestions.length === 0) {
    return (
      <div className="pb-24">
        <Header title="প্র্যাকটিস" showBack />
        <main className="mx-auto max-w-lg px-4 py-10 text-center">
          <p className="text-4xl">🗒️</p>
          <p className="mt-3 text-ink-500">এই তালিকায় কোনো প্রশ্ন নেই।</p>
          <Link to="/browse" className="mt-4 inline-block rounded-full bg-amber px-5 py-2 text-sm font-semibold text-ink-950">
            প্রশ্ন ব্রাউজ করো
          </Link>
        </main>
      </div>
    );
  }

  if (finished) {
    const total = sessionQuestions.length;
    const accuracy = Math.round((correctCount / total) * 100);
    return (
      <div className="pb-24">
        <Header title="সেশন শেষ" showBack />
        <main className="mx-auto max-w-lg px-4 py-8 text-center">
          <p className="text-5xl">{accuracy >= 70 ? '🎉' : '💪'}</p>
          <p className="mt-3 font-display text-2xl text-ink-900 dark:text-ink-100">
            Score: {correctCount}/{total}
          </p>
          <p className="mt-1 text-ink-500">সঠিক: {correctCount} · ভুল: {wrongCount} · Accuracy: {accuracy}%</p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => { setCurrentIndex(0); setCorrectCount(0); setWrongCount(0); setFinished(false); }}
              className="rounded-full border border-ink-200 px-5 py-2 text-sm font-semibold text-ink-700 dark:border-ink-700/50 dark:text-ink-200"
            >
              আবার করো
            </button>
            <Link to="/" className="rounded-full bg-amber px-5 py-2 text-sm font-semibold text-ink-950">
              হোমে ফিরে যাও
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const q = sessionQuestions[currentIndex];

  return (
    <div className="pb-24">
      <Header title="প্র্যাকটিস" showBack />
      <main className="mx-auto max-w-lg px-4 py-4">
        <QuestionCard
          key={q.id}
          question={q}
          index={currentIndex}
          total={sessionQuestions.length}
          isLast={currentIndex === sessionQuestions.length - 1}
          onAnswered={correct => {
            if (correct) setCorrectCount(c => c + 1);
            else setWrongCount(c => c + 1);
          }}
          onNext={() => {
            if (currentIndex + 1 >= sessionQuestions.length) setFinished(true);
            else setCurrentIndex(i => i + 1);
          }}
        />
      </main>
    </div>
  );
};
