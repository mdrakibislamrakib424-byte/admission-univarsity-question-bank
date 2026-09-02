import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { QuestionCard } from '../components/QuestionCard';
import { BannerAd } from '../components/BannerAd';
import { useAppData } from '../context/AppDataContext';
import { useSubscription } from '../hooks/useSubscription';
import { todayStr } from '../utils/storage';
import { filterQuestionsForAccess, canPracticeMoreToday, remainingFreePractice } from '../utils/contentGate';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const Practice: React.FC = () => {
  const { questions: allQuestions, userData } = useAppData();
  const { isSubscribed, loading: subLoading } = useSubscription();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const mode = params.get('mode');
  const ids = params.get('ids');
  const subject = params.get('subject');
  const chapter = params.get('chapter');
  const count = Number(params.get('count') || 0);

  // ফ্রি ইউজার হলে ১০ বছরের বেশি পুরনো প্রশ্ন বাদ যাবে
  const questions = useMemo(() => filterQuestionsForAccess(allQuestions, isSubscribed), [allQuestions, isSubscribed]);

  const todayQuestionsDone = useMemo(
    () => userData.attempts.filter(a => new Date(a.timestamp).toISOString().slice(0, 10) === todayStr()).length,
    [userData.attempts]
  );
  const canPractice = subLoading || canPracticeMoreToday(isSubscribed, todayQuestionsDone);

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

  // ফ্রি লিমিট শেষ হলে paywall দেখাও
  if (!subLoading && !canPractice) {
    return (
      <div className="min-h-screen bg-paper pb-24 dark:bg-ink-900">
        <Header title="প্র্যাকটিস" showBack />
        <main className="mx-auto max-w-lg px-4 py-10 text-center">
          <div className="rounded-3xl bg-gradient-to-br from-ink-900 to-ink-700 p-8 text-white dark:from-ink-800 dark:to-ink-950">
            <p className="text-5xl">🔒</p>
            <p className="mt-3 font-display text-lg font-bold">আজকের ফ্রি প্র্যাকটিস শেষ</p>
            <p className="mt-1 text-sm opacity-80">
              ফ্রি অ্যাকাউন্টে দিনে মাত্র {2} টা প্রশ্ন প্র্যাকটিস করা যায়। আনলিমিটেড প্র্যাকটিসের জন্য প্রিমিয়াম নাও।
            </p>
            <Link
              to="/subscription"
              className="mt-5 block rounded-full bg-amber py-2.5 text-sm font-semibold text-ink-950"
            >
              👑 প্রিমিয়াম নাও (৳৮৫০ / ৬ মাস)
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (sessionQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-paper pb-24 dark:bg-ink-900">
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
      <div className="min-h-screen bg-paper pb-24 dark:bg-ink-900">
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
          <BannerAd placement="practice-result" />
        </main>
      </div>
    );
  }

  const q = sessionQuestions[currentIndex];
  const freeLeft = remainingFreePractice(todayQuestionsDone);

  return (
    <div className="min-h-screen bg-paper pb-24 dark:bg-ink-900">
      <Header title="প্র্যাকটিস" showBack />
      <main className="mx-auto max-w-lg px-4 py-4">
        {!isSubscribed && !subLoading && (
          <p className="mb-3 rounded-xl bg-amber/10 px-3 py-2 text-center text-xs text-amber-dark dark:text-amber">
            আজ আর {freeLeft}টা ফ্রি প্রশ্ন বাকি —{' '}
            <Link to="/subscription" className="underline">প্রিমিয়াম নিলে আনলিমিটেড</Link>
          </p>
        )}
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
        <BannerAd placement="practice-bottom" />
      </main>
    </div>
  );
};
