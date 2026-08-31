import React, { useState } from 'react';
import { Header } from '../components/Header';
import { useAppData } from '../context/AppDataContext';

export const Memorization: React.FC = () => {
  const { dueRevisionItems, questions, reviewRevisionItem } = useAppData();
  const [pos, setPos] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const items = dueRevisionItems
    .map(item => ({ item, q: questions.find(q => q.id === item.questionId) }))
    .filter(x => x.q);

  const handleReview = (remembered: boolean) => {
    const current = items[pos];
    if (!current) return;
    reviewRevisionItem(current.item.questionId, remembered);
    setRevealed(false);
    setPos(p => p + 1);
  };

  return (
    <div className="pb-24">
      <Header title="মুখস্থ ও রিভিশন" showBack />
      <main className="mx-auto max-w-lg px-4 py-5">
        <p className="mb-4 text-sm text-ink-500">
          "🧠 মুখস্থ তালিকায় যোগ করো" বাটনে ট্যাপ করে যেকোনো প্রশ্ন এখানে যোগ করতে পারো। Spaced revision অনুযায়ী ১ দিন, ৩ দিন, ৭ দিন, ১৪ দিন পর আবার মনে করিয়ে দেওয়া হবে।
        </p>

        {items.length === 0 && (
          <p className="text-center text-sm text-ink-400">আজ রিভিশনের জন্য কিছু বাকি নেই। 🎉</p>
        )}

        {items[pos] && (
          <div className="rounded-2xl border border-ink-200 bg-white p-5 dark:border-ink-700/50 dark:bg-ink-800">
            <p className="text-xs text-ink-400">{pos + 1} / {items.length}</p>
            <p className="mt-2 font-display text-lg text-ink-900 dark:text-ink-100">{items[pos].q!.question}</p>

            {!revealed ? (
              <button
                onClick={() => setRevealed(true)}
                className="mt-4 w-full rounded-full border border-ink-200 py-2.5 text-sm font-semibold text-ink-700 dark:border-ink-700/50 dark:text-ink-200"
              >
                উত্তর দেখাও
              </button>
            ) : (
              <>
                <p className="mt-3 rounded-lg bg-paper p-3 text-sm text-leaf-dark dark:bg-ink-900/40 dark:text-leaf">
                  ✅ {items[pos].q!.options[items[pos].q!.answerIndex]} — {items[pos].q!.explanation.correct}
                </p>
                <div className="mt-4 flex gap-3">
                  <button onClick={() => handleReview(false)} className="flex-1 rounded-full bg-brick/10 py-2.5 text-sm font-semibold text-brick-dark dark:text-brick">
                    মনে ছিল না
                  </button>
                  <button onClick={() => handleReview(true)} className="flex-1 rounded-full bg-leaf/10 py-2.5 text-sm font-semibold text-leaf-dark dark:text-leaf">
                    মনে ছিল ✓
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {items.length > 0 && pos >= items.length && (
          <p className="text-center text-sm text-leaf-dark dark:text-leaf">আজকের রিভিশন সম্পূর্ণ হয়েছে! 🎉</p>
        )}
      </main>
    </div>
  );
};
