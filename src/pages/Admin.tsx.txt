import React, { useState } from 'react';
import { Header } from '../components/Header';
import { useAppData } from '../context/AppDataContext';
import { Question } from '../types';

const PROMPT_TEMPLATE = `তুমি একটা OCR করা প্রশ্নব্যাংকের ছবি থেকে টেক্সট পাবে। সেটাকে নিচের JSON schema অনুযায়ী সাজিয়ে দাও। শুধু একটা valid JSON array রিটার্ন করো, অন্য কোনো লেখা ছাড়া:

[
  {
    "id": "university-year-subject-001",
    "university": "DU",
    "unit": "Ka",
    "year": 2023,
    "subject": "বাংলা",
    "chapter": "ব্যাকরণ",
    "question": "প্রশ্নের টেক্সট",
    "options": ["ক", "খ", "গ", "ঘ"],
    "answerIndex": 0,
    "explanation": {
      "correct": "সঠিক উত্তর কেন সঠিক তার ব্যাখ্যা",
      "wrong": ["বাকি ৩টা অপশন কেন ভুল, ক্রমানুসারে"]
    },
    "timesAsked": 1,
    "language": "bn"
  }
]

এখানে ছবি/টেক্সট দাও:
`;

function validateQuestions(data: any): { valid: Question[]; errors: string[] } {
  const valid: Question[] = [];
  const errors: string[] = [];
  if (!Array.isArray(data)) {
    return { valid: [], errors: ['ইনপুট একটা JSON array হতে হবে, যেমন [ {...}, {...} ]'] };
  }
  data.forEach((item, i) => {
    const prefix = `প্রশ্ন #${i + 1}`;
    if (!item.id) return errors.push(`${prefix}: 'id' নেই`);
    if (!item.university) return errors.push(`${prefix}: 'university' নেই`);
    if (!item.year) return errors.push(`${prefix}: 'year' নেই`);
    if (!item.subject) return errors.push(`${prefix}: 'subject' নেই`);
    if (!item.chapter) return errors.push(`${prefix}: 'chapter' নেই`);
    if (!item.question) return errors.push(`${prefix}: 'question' টেক্সট নেই`);
    if (!Array.isArray(item.options) || item.options.length !== 4) return errors.push(`${prefix}: 'options' ঠিক ৪টা হতে হবে`);
    if (typeof item.answerIndex !== 'number' || item.answerIndex < 0 || item.answerIndex > 3) return errors.push(`${prefix}: 'answerIndex' ০-৩ এর মধ্যে সংখ্যা হতে হবে`);
    if (!item.explanation?.correct) return errors.push(`${prefix}: 'explanation.correct' নেই`);
    if (!Array.isArray(item.explanation?.wrong) || item.explanation.wrong.length !== 3) return errors.push(`${prefix}: 'explanation.wrong' ঠিক ৩টা হতে হবে`);
    valid.push(item as Question);
  });
  return { valid, errors };
}

export const Admin: React.FC = () => {
  const { questions } = useAppData();
  const [raw, setRaw] = useState('');
  const [result, setResult] = useState<{ valid: Question[]; errors: string[] } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleValidate = () => {
    try {
      const parsed = JSON.parse(raw);
      setResult(validateQuestions(parsed));
    } catch (e: any) {
      setResult({ valid: [], errors: [`JSON parse করতে সমস্যা হয়েছে: ${e.message}`] });
    }
  };

  const handleDownload = () => {
    if (!result || result.valid.length === 0) return;
    const existingIds = new Set(questions.map(q => q.id));
    const merged = [...questions, ...result.valid.filter(q => !existingIds.has(q.id))];
    const blob = new Blob([JSON.stringify(merged, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'questions.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(PROMPT_TEMPLATE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pb-24">
      <Header title="প্রশ্ন যোগ করো" showBack />
      <main className="mx-auto max-w-lg space-y-5 px-4 py-5">
        <section className="rounded-xl border border-amber/40 bg-amber/10 p-4 text-sm text-ink-700 dark:text-ink-200">
          <p className="font-medium text-amber-dark dark:text-amber">কীভাবে কাজ করে</p>
          <ol className="mt-2 list-decimal space-y-1 pl-4">
            <li>প্রশ্নব্যাংক বইয়ের পাতার ছবি তোলো</li>
            <li>ছবিটা AI-কে (যেমন Claude) নিচের প্রম্পট সহ দাও — সে OCR করে JSON বানিয়ে দেবে</li>
            <li>সেই JSON এখানে পেস্ট করো ও 'যাচাই করো' চাপো</li>
            <li>ঠিক থাকলে 'questions.json ডাউনলোড করো' চেপে ফাইলটা GitHub রিপোর src/data/questions.json-এ আপলোড/রিপ্লেস করো</li>
          </ol>
          <button onClick={copyPrompt} className="mt-3 rounded-full bg-amber px-4 py-1.5 text-xs font-semibold text-ink-950">
            {copied ? 'কপি হয়েছে ✓' : 'AI প্রম্পট কপি করো'}
          </button>
        </section>

        <section>
          <label className="mb-1 block text-sm font-medium text-ink-700 dark:text-ink-200">AI-structured JSON পেস্ট করো</label>
          <textarea
            value={raw}
            onChange={e => setRaw(e.target.value)}
            rows={10}
            placeholder='[{"id": "du-2024-bangla-010", "university": "DU", ...}]'
            className="w-full rounded-xl border border-ink-200 bg-white p-3 font-mono text-xs text-ink-800 outline-none focus:border-amber dark:border-ink-700/50 dark:bg-ink-800 dark:text-ink-100"
          />
          <button onClick={handleValidate} className="mt-2 w-full rounded-full border border-ink-200 py-2.5 text-sm font-semibold text-ink-700 dark:border-ink-700/50 dark:text-ink-200">
            যাচাই করো
          </button>
        </section>

        {result && (
          <section className="space-y-3">
            {result.valid.length > 0 && (
              <p className="rounded-lg bg-leaf/10 p-3 text-sm text-leaf-dark dark:text-leaf">
                ✅ {result.valid.length}টি প্রশ্ন সঠিকভাবে পাওয়া গেছে
              </p>
            )}
            {result.errors.length > 0 && (
              <div className="rounded-lg bg-brick/10 p-3 text-sm text-brick-dark dark:text-brick">
                {result.errors.map((e, i) => <p key={i}>❌ {e}</p>)}
              </div>
            )}
            {result.valid.length > 0 && (
              <button onClick={handleDownload} className="w-full rounded-full bg-leaf py-2.5 text-sm font-semibold text-white">
                questions.json ডাউনলোড করো (মোট {questions.length + result.valid.length}টি প্রশ্ন)
              </button>
            )}
          </section>
        )}

        <section className="rounded-xl border border-ink-200 p-4 text-xs leading-relaxed text-ink-500 dark:border-ink-700/50">
          <p className="mb-1 font-medium text-ink-700 dark:text-ink-300">বর্তমানে ডাটাবেসে আছে</p>
          <p>{questions.length}টি প্রশ্ন, {new Set(questions.map(q => q.university)).size}টি বিশ্ববিদ্যালয়, {new Set(questions.map(q => q.subject)).size}টি বিষয়</p>
        </section>
      </main>
    </div>
  );
};
