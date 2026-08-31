import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { FrequencyBadge } from './FrequencyBadge';
import { useAppData } from '../context/AppDataContext';

interface Props {
  question: Question;
  index: number;
  total: number;
  onAnswered?: (correct: boolean) => void;
  onNext?: () => void;
  isLast?: boolean;
  hideExplanationUntilNext?: boolean; // mock test mode: don't reveal answer instantly
  showFooterActions?: boolean; // bookmark / add to revision
}

export const QuestionCard: React.FC<Props> = ({
  question,
  index,
  total,
  onAnswered,
  onNext,
  isLast,
  hideExplanationUntilNext = false,
  showFooterActions = true
}) => {
  const { toggleBookmark, isBookmarked, addToRevision, recordAttempt } = useAppData();
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setSelected(null);
    setRevealed(false);
  }, [question.id]);

  const handleSelect = (optIndex: number) => {
    if (selected !== null) return;
    setSelected(optIndex);
    const correct = optIndex === question.answerIndex;
    recordAttempt(question.id, correct);
    onAnswered?.(correct);
    if (!hideExplanationUntilNext) setRevealed(true);
  };

  const bookmarked = isBookmarked(question.id);

  const speak = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const fullText = [
      question.question,
      ...question.options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`)
    ].join('. ');
    const utter = new SpeechSynthesisUtterance(fullText);
    utter.lang = question.language === 'en' ? 'en-US' : 'bn-BD';
    window.speechSynthesis.speak(utter);
  };

  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-sm dark:border-ink-700/40 dark:bg-ink-800">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium text-ink-400">
          প্রশ্ন {index + 1} / {total} · {question.university}
          {question.unit ? ` ${question.unit}` : ''} · {question.year}
        </span>
        <FrequencyBadge timesAsked={question.timesAsked} />
      </div>

      <div className="flex items-start gap-2">
        <p className="flex-1 font-display text-lg leading-relaxed text-ink-900 dark:text-ink-100">
          {question.question}
        </p>
        {'speechSynthesis' in window && (
          <button onClick={speak} aria-label="শুনো" className="mt-1 shrink-0 text-lg text-ink-400 hover:text-amber">
            🔊
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {question.options.map((opt, i) => {
          const isCorrect = i === question.answerIndex;
          const isSelected = i === selected;
          let cls = 'border-ink-200 hover:border-amber/60 dark:border-ink-700/50 dark:hover:bg-ink-700/40';
          if (selected !== null && revealed) {
            if (isCorrect) cls = 'border-leaf bg-leaf/10 text-leaf-dark dark:text-leaf';
            else if (isSelected) cls = 'border-brick bg-brick/10 text-brick-dark dark:text-brick';
            else cls = 'border-ink-700/30 opacity-60';
          } else if (isSelected) {
            cls = 'border-amber bg-amber/10';
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors disabled:cursor-default ${cls}`}
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current text-[11px]">
                {String.fromCharCode(65 + i)}
              </span>
              <span>{opt}</span>
              {selected !== null && revealed && isCorrect && <span className="ml-auto">✅</span>}
              {selected !== null && revealed && isSelected && !isCorrect && <span className="ml-auto">❌</span>}
            </button>
          );
        })}
      </div>

      {revealed && (
        <div className="mt-4 space-y-2 rounded-xl bg-paper p-4 text-sm leading-relaxed dark:bg-ink-900/40">
          <p className="text-leaf-dark dark:text-leaf">
            ✅ <b>{String.fromCharCode(65 + question.answerIndex)} সঠিক</b> — {question.explanation.correct}
          </p>
          {question.options.map((_, i) => {
            if (i === question.answerIndex) return null;
            const wrongIdx = i < question.answerIndex ? i : i - 1;
            return (
              <p key={i} className="text-brick-dark dark:text-brick">
                ❌ <b>{String.fromCharCode(65 + i)} ভুল</b> — {question.explanation.wrong[wrongIdx]}
              </p>
            );
          })}
        </div>
      )}

      {showFooterActions && (
        <div className="mt-4 flex items-center justify-between border-t border-ink-700/30 pt-3">
          <div className="flex gap-3">
            <button
              onClick={() => toggleBookmark(question.id)}
              className="text-sm text-ink-400 hover:text-amber"
            >
              {bookmarked ? '⭐ সেভ করা আছে' : '☆ সেভ করো'}
            </button>
            <button
              onClick={() => addToRevision(question.id)}
              className="text-sm text-ink-400 hover:text-amber"
            >
              🧠 মুখস্থ তালিকায় যোগ করো
            </button>
          </div>
          {revealed && onNext && (
            <button
              onClick={onNext}
              className="rounded-full bg-amber px-5 py-2 text-sm font-semibold text-ink-950 hover:bg-amber-dark"
            >
              {isLast ? 'শেষ করো' : 'পরের প্রশ্ন →'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
