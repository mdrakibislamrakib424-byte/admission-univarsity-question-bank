import React, { useState } from 'react';
import { Header } from '../components/Header';
import { useAppData } from '../context/AppDataContext';

const ADMIN_EMAIL = 'YOUR-EMAIL@example.com'; // অ্যাডমিন নিজের ইমেইল দিয়ে বদলে নিও

export const Community: React.FC = () => {
  const { userData, addCommunitySubmission, removeCommunitySubmission } = useAppData();
  const [form, setForm] = useState({
    university: '',
    subject: '',
    chapter: '',
    question: '',
    options: ['', '', '', ''] as [string, string, string, string],
    answerIndex: 0 as 0 | 1 | 2 | 3,
    note: ''
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const canSubmit = form.university && form.subject && form.question && form.options.every(o => o.trim());

  const submit = () => {
    if (!canSubmit) return;
    addCommunitySubmission({ ...form });
    setForm({ university: '', subject: '', chapter: '', question: '', options: ['', '', '', ''], answerIndex: 0, note: '' });
  };

  const buildText = (s: typeof userData.communitySubmissions[number]) =>
    `প্রশ্ন সাবমিশন\nবিশ্ববিদ্যালয়: ${s.university}\nবিষয়: ${s.subject} / ${s.chapter}\nপ্রশ্ন: ${s.question}\n` +
    s.options.map((o, i) => `${String.fromCharCode(65 + i)}. ${o}${i === s.answerIndex ? ' (সঠিক)' : ''}`).join('\n') +
    (s.note ? `\nনোট: ${s.note}` : '');

  const shareMailto = (s: typeof userData.communitySubmissions[number]) =>
    `mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent('নতুন প্রশ্ন সাবমিশন')}&body=${encodeURIComponent(buildText(s))}`;

  const copyText = async (s: typeof userData.communitySubmissions[number]) => {
    try {
      await navigator.clipboard.writeText(buildText(s));
      setCopiedId(s.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      alert('কপি করা যায়নি।');
    }
  };

  const inputClass =
    'w-full rounded-xl border border-ink-200 bg-paper px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-amber focus:ring-2 focus:ring-amber/20 dark:border-ink-700/50 dark:bg-ink-900 dark:text-ink-100';

  return (
    <div className="min-h-screen bg-paper pb-24 dark:bg-ink-900">
      <Header title="📝 প্রশ্ন সাবমিট করো" showBack />
      <main className="mx-auto max-w-lg space-y-5 px-4 py-5">
        <div className="flex items-start gap-3 rounded-2xl bg-gradient-to-r from-amber/10 to-transparent p-4">
          <span className="text-xl">💡</span>
          <p className="text-xs leading-relaxed text-ink-500 dark:text-ink-300">
            এই অ্যাপের কোনো সার্ভার নেই বলে সরাসরি সবার প্রশ্নব্যাংকে যোগ হয় না — এখানে লেখা প্রশ্নটা তুমি ইমেইল বা কপি
            করে অ্যাডমিনকে পাঠাতে পারবে, অ্যাডমিন যাচাই করে যোগ করে দেবে।
          </p>
        </div>

        <section className="space-y-3 rounded-3xl border border-ink-200 bg-white p-5 shadow-sm dark:border-ink-700/40 dark:bg-ink-800">
          <p className="text-sm font-semibold text-ink-800 dark:text-ink-100">✍️ নতুন প্রশ্ন লেখো</p>
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="বিশ্ববিদ্যালয় (DU/RU...)"
              value={form.university}
              onChange={e => setForm(f => ({ ...f, university: e.target.value }))}
              className={inputClass}
            />
            <input
              placeholder="বিষয়"
              value={form.subject}
              onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
              className={inputClass}
            />
          </div>
          <input
            placeholder="চ্যাপ্টার / টপিক"
            value={form.chapter}
            onChange={e => setForm(f => ({ ...f, chapter: e.target.value }))}
            className={inputClass}
          />
          <textarea
            placeholder="প্রশ্ন লেখো"
            value={form.question}
            rows={2}
            onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
            className={inputClass}
          />
          <div className="space-y-2">
            {form.options.map((opt, i) => (
              <label
                key={i}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition-colors ${
                  form.answerIndex === i
                    ? 'border-leaf/50 bg-leaf/5'
                    : 'border-ink-200 dark:border-ink-700/50'
                }`}
              >
                <input
                  type="radio"
                  checked={form.answerIndex === i}
                  onChange={() => setForm(f => ({ ...f, answerIndex: i as 0 | 1 | 2 | 3 }))}
                  className="accent-leaf"
                />
                <span className="w-5 shrink-0 text-xs font-semibold text-ink-400">{String.fromCharCode(65 + i)}.</span>
                <input
                  placeholder={`অপশন ${String.fromCharCode(65 + i)}`}
                  value={opt}
                  onChange={e =>
                    setForm(f => {
                      const options = [...f.options] as [string, string, string, string];
                      options[i] = e.target.value;
                      return { ...f, options };
                    })
                  }
                  className="flex-1 bg-transparent text-sm outline-none dark:text-ink-100"
                />
              </label>
            ))}
          </div>
          <input
            placeholder="নোট (ঐচ্ছিক)"
            value={form.note}
            onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
            className={inputClass}
          />
          <button
            onClick={submit}
            disabled={!canSubmit}
            className="w-full rounded-full bg-gradient-to-r from-amber to-amber-dark py-3 text-sm font-semibold text-ink-950 shadow-md shadow-amber/30 transition-transform active:scale-[0.98] disabled:opacity-40"
          >
            ➕ তালিকায় যোগ করো
          </button>
        </section>

        <section className="space-y-3">
          <h2 className="flex items-center gap-2 font-display text-lg text-ink-900 dark:text-ink-100">
            📥 তোমার জমা দেওয়া প্রশ্ন
            <span className="rounded-full bg-ink-100 px-2 py-0.5 text-xs font-normal text-ink-500 dark:bg-ink-800">
              {userData.communitySubmissions.length}
            </span>
          </h2>
          {userData.communitySubmissions.length === 0 && (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-ink-200 py-10 text-center dark:border-ink-700/50">
              <span className="text-3xl">📭</span>
              <p className="text-sm text-ink-400">এখনো কিছু জমা দাওনি।</p>
            </div>
          )}
          <ul className="space-y-2">
            {userData.communitySubmissions.map(s => (
              <li key={s.id} className="rounded-2xl border border-ink-200 bg-white p-4 shadow-sm dark:border-ink-700/40 dark:bg-ink-800">
                <p className="text-xs text-ink-400">{s.university} · {s.subject} / {s.chapter}</p>
                <p className="mt-1 text-sm text-ink-800 dark:text-ink-100">{s.question}</p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  <a
                    href={shareMailto(s)}
                    className="rounded-full bg-amber/10 px-3 py-1 text-xs font-medium text-amber-dark dark:text-amber"
                  >
                    ✉️ ইমেইল করো
                  </a>
                  <button
                    onClick={() => copyText(s)}
                    className="rounded-full bg-ink-100 px-3 py-1 text-xs font-medium text-ink-600 dark:bg-ink-700 dark:text-ink-200"
                  >
                    {copiedId === s.id ? '✅ কপি হয়েছে' : '📋 কপি করো'}
                  </button>
                  <button
                    onClick={() => removeCommunitySubmission(s.id)}
                    className="rounded-full bg-brick/10 px-3 py-1 text-xs font-medium text-brick-dark dark:text-brick"
                  >
                    🗑️ মুছে ফেলো
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};
