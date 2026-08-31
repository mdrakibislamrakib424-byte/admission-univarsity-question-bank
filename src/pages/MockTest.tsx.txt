import React, { useEffect, useMemo, useState } from 'react';
import { Header } from '../components/Header';
import { useAppData } from '../context/AppDataContext';
import { Question } from '../types';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const PRESETS = [
  { title: 'DU-style টেস্ট', university: 'DU', count: 20, minutes: 20, negative: 0.25 },
  { title: 'GST B Unit-style টেস্ট', university: 'GST', count: 25, minutes: 25, negative: 0.25 },
  { title: 'র‍্যান্ডম মিক্সড টেস্ট', university: '', count: 20, minutes: 20, negative: 0 }
];

type Stage = 'setup' | 'running' | 'result';

export const MockTest: React.FC = () => {
  const { questions, recordAttempt, addMockTestResult } = useAppData();
  const [stage, setStage] = useState<Stage>('setup');
  const [preset, setPreset] = useState(PRESETS[2]);
  const [customCount, setCustomCount] = useState(20);
  const [customMinutes, setCustomMinutes] = useState(20);
  const [negative, setNegative] = useState(0.25);

  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [startedAt, setStartedAt] = useState(0);
  const [testTitle, setTestTitle] = useState('মক টেস্ট');
  const [testMinutes, setTestMinutes] = useState(20);

  useEffect(() => {
    if (stage !== 'running' || secondsLeft <= 0) return;
    const t = setInterval(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [stage, secondsLeft]);

  useEffect(() => {
    if (stage === 'running' && secondsLeft === 0 && startedAt > 0) {
      finishTest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  const startTest = (count: number, minutes: number, university: string, title?: string) => {
    let pool = questions;
    if (university) pool = pool.filter(q => q.university === university);
    const picked = shuffle(pool).slice(0, Math.min(count, pool.length));
    setTestQuestions(picked);
    setAnswers({});
    setSecondsLeft(minutes * 60);
    setStartedAt(Date.now());
    setTestTitle(title || 'মক টেস্ট');
    setTestMinutes(minutes);
    setStage('running');
  };

  const finishTest = () => {
    let correct = 0, wrong = 0, skipped = 0;
    testQuestions.forEach(q => {
      const ans = answers[q.id];
      if (ans === undefined || ans === null) skipped++;
      else if (ans === q.answerIndex) correct++;
      else wrong++;
      if (ans !== undefined && ans !== null) recordAttempt(q.id, ans === q.answerIndex);
    });
    const finalScore = correct - wrong * negative;
    const timeTakenSeconds = Math.max(0, testMinutes * 60 - secondsLeft);
    addMockTestResult({
      id: `mock-${Date.now()}`,
      title: testTitle,
      date: Date.now(),
      totalQuestions: testQuestions.length,
      correct,
      wrong,
      skipped,
      score: finalScore,
      maxScore: testQuestions.length,
      timeTakenSeconds
    });
    setStage('result');
  };

  const result = useMemo(() => {
    let correct = 0, wrong = 0, skipped = 0;
    testQuestions.forEach(q => {
      const ans = answers[q.id];
      if (ans === undefined || ans === null) skipped++;
      else if (ans === q.answerIndex) correct++;
      else wrong++;
    });
    const score = correct - wrong * negative;
    return { correct, wrong, skipped, score, max: testQuestions.length };
  }, [answers, testQuestions, negative]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  if (stage === 'setup') {
    return (
      <div className="pb-24">
        <Header title="মক টেস্ট" />
        <main className="mx-auto max-w-lg space-y-4 px-4 py-5">
          <p className="text-sm text-ink-500">টাইমার ও নেগেটিভ মার্কিং সহ আসল পরীক্ষার মতো অনুশীলন করো।</p>

          {PRESETS.map(p => (
            <button
              key={p.title}
              onClick={() => { setNegative(p.negative); startTest(p.count, p.minutes, p.university, p.title); }}
              className="flex w-full items-center justify-between rounded-xl border border-ink-200 bg-white p-4 text-left dark:border-ink-700/50 dark:bg-ink-800"
            >
              <div>
                <p className="font-medium text-ink-800 dark:text-ink-100">{p.title}</p>
                <p className="text-xs text-ink-400">{p.count} প্রশ্ন · {p.minutes} মিনিট · {p.negative ? `-${p.negative} নেগেটিভ` : 'নেগেটিভ নেই'}</p>
              </div>
              <span className="text-amber">শুরু →</span>
            </button>
          ))}

          <div className="rounded-xl border border-dashed border-ink-300 p-4 dark:border-ink-600">
            <p className="mb-3 font-medium text-ink-800 dark:text-ink-100">কাস্টম টেস্ট বানাও</p>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs text-ink-500">
                প্রশ্ন সংখ্যা
                <input type="number" value={customCount} onChange={e => setCustomCount(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-ink-200 bg-white px-2 py-1.5 dark:border-ink-700/50 dark:bg-ink-900" />
              </label>
              <label className="text-xs text-ink-500">
                সময় (মিনিট)
                <input type="number" value={customMinutes} onChange={e => setCustomMinutes(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-ink-200 bg-white px-2 py-1.5 dark:border-ink-700/50 dark:bg-ink-900" />
              </label>
            </div>
            <label className="mt-3 flex items-center gap-2 text-xs text-ink-500">
              <input type="checkbox" checked={negative > 0} onChange={e => setNegative(e.target.checked ? 0.25 : 0)} />
              নেগেটিভ মার্কিং (প্রতি ভুলে -০.২৫)
            </label>
            <button
              onClick={() => startTest(customCount, customMinutes, '', 'কাস্টম টেস্ট')}
              className="mt-3 w-full rounded-full bg-amber py-2 text-sm font-semibold text-ink-950"
            >
              টেস্ট শুরু করো
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (stage === 'running') {
    return (
      <div className="pb-24">
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-ink-200 bg-paper/95 px-4 py-3 backdrop-blur dark:border-ink-700/50 dark:bg-ink-900/95">
          <span className="text-sm text-ink-500">{Object.values(answers).filter(a => a !== null && a !== undefined).length}/{testQuestions.length} উত্তর দেওয়া</span>
          <span className={`font-mono text-lg font-semibold ${secondsLeft < 60 ? 'text-brick' : 'text-ink-800 dark:text-ink-100'}`}>{mm}:{ss}</span>
        </div>
        <main className="mx-auto max-w-lg space-y-4 px-4 py-4">
          {testQuestions.map((q, idx) => (
            <div key={q.id} className="rounded-2xl border border-ink-200 bg-white p-5 dark:border-ink-700/40 dark:bg-ink-800">
              <p className="text-xs text-ink-400">প্রশ্ন {idx + 1}</p>
              <p className="mt-1 font-display text-base text-ink-900 dark:text-ink-100">{q.question}</p>
              <div className="mt-3 flex flex-col gap-2">
                {q.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setAnswers(a => ({ ...a, [q.id]: i }))}
                    className={`rounded-xl border px-4 py-2.5 text-left text-sm ${
                      answers[q.id] === i
                        ? 'border-amber bg-amber/10'
                        : 'border-ink-200 dark:border-ink-700/50'
                    }`}
                  >
                    <span className="mr-2 text-xs">{String.fromCharCode(65 + i)}.</span>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button
            onClick={finishTest}
            className="w-full rounded-full bg-leaf py-3 text-sm font-semibold text-white"
          >
            টেস্ট জমা দাও
          </button>
        </main>
      </div>
    );
  }

  // result stage
  return (
    <div className="pb-24">
      <Header title="ফলাফল" />
      <main className="mx-auto max-w-lg space-y-4 px-4 py-6">
        <div className="rounded-2xl border border-ink-200 bg-white p-6 text-center dark:border-ink-700/50 dark:bg-ink-800">
          <p className="font-display text-3xl text-ink-900 dark:text-ink-100">{result.score.toFixed(2)} / {result.max}</p>
          <p className="mt-2 text-sm text-ink-500">সঠিক {result.correct} · ভুল {result.wrong} · বাদ {result.skipped}</p>
        </div>
        <div className="space-y-3">
          {testQuestions.map((q, idx) => {
            const ans = answers[q.id];
            const correct = ans === q.answerIndex;
            return (
              <div key={q.id} className="rounded-xl border border-ink-200 bg-white p-4 text-sm dark:border-ink-700/40 dark:bg-ink-800">
                <p className="text-ink-800 dark:text-ink-100">{idx + 1}. {q.question}</p>
                <p className={`mt-1 ${ans == null ? 'text-ink-400' : correct ? 'text-leaf-dark dark:text-leaf' : 'text-brick-dark dark:text-brick'}`}>
                  {ans == null ? 'উত্তর দাওনি' : correct ? '✅ সঠিক' : `❌ ভুল — সঠিক উত্তর: ${String.fromCharCode(65 + q.answerIndex)}`}
                </p>
              </div>
            );
          })}
        </div>
        <button onClick={() => setStage('setup')} className="w-full rounded-full border border-ink-200 py-2.5 text-sm font-semibold text-ink-700 dark:border-ink-700/50 dark:text-ink-200">
          আরেকটা টেস্ট দাও
        </button>
      </main>
    </div>
  );
};
