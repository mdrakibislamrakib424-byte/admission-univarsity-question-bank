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
      alert('কপি হয়েছে! এখন WhatsApp/Messenger/গ্রুপে পেস্ট করে অ্যাডমিনকে পাঠাও।');
    } catch {
      alert('কপি করা যায়নি।');
    }
  };

  return (
    <div className="pb-24">
      <Header title="📝 প্রশ্ন সাবমিট করো" showBack />
      <main className="mx-auto max-w-lg space-y-5 px-4 py-5">
        <p className="rounded-xl bg-paper p-3 text-xs leading-relaxed text-ink-400 dark:bg-ink-900/40">
          এই অ্যাপের কোনো সার্ভার নেই বলে সরাসরি সবার প্রশ্নব্যাংকে যোগ হয় না — বরং এখানে লেখা প্রশ্নটা তুমি ইমেইল বা কপি
          করে অ্যাডমিনকে পাঠাতে পারবে, অ্যাডমিন যাচাই করে questions.json-এ যোগ করে দেবে।
        </p>

        <section className="space-y-3 rounded-xl border border-ink-200 bg-white p-4 dark:border-ink-700/50 dark:bg-ink-800">
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="বিশ্ববিদ্যালয় (DU/RU...)" value={form.university}
              onChange={e => setForm(f => ({ ...f, university: e.target.value }))}
              className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm dark:border-ink-700/50 dark:bg-ink-900" />
            <input placeholder="বিষয়" value={form.subject}
              onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
              className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm dark:border-ink-700/50 dark:bg-ink-900" />
          </div>
          <input placeholder="চ্যাপ্টার" value={form.chapter}
            onChange={e => setForm(f => ({ ...f, chapter: e.target.value }))}
            className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm dark:border-ink-700/50 dark:bg-ink-900" />
          <textarea placeholder="প্রশ্ন লেখো" value={form.question} rows={2}
            onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
            className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm dark:border-ink-700/50 dark:bg-ink-900" />
          {form.options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="radio"
                checked={form.answerIndex === i}
                onChange={() => setForm(f => ({ ...f, answerIndex: i as 0 | 1 | 2 | 3 }))}
              />
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
                className="flex-1 rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm dark:border-ink-700/50 dark:bg-ink-900"
              />
            </div>
          ))}
          <input placeholder="নোট (ঐচ্ছিক)" value={form.note}
            onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
            className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm dark:border-ink-700/50 dark:bg-ink-900" />
          <button onClick={submit} disabled={!canSubmit} className="w-full rounded-full bg-amber py-2 text-sm font-semibold text-ink-950 disabled:opacity-50">
            তালিকায় যোগ করো
          </button>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-ink-900 dark:text-ink-100">তোমার জমা দেওয়া প্রশ্ন ({userData.communitySubmissions.length})</h2>
          {userData.communitySubmissions.length === 0 && <p className="text-sm text-ink-400">এখনো কিছু জমা দাওনি।</p>}
          <ul className="space-y-2">
            {userData.communitySubmissions.map(s => (
              <li key={s.id} className="rounded-xl border border-ink-200 bg-white p-4 dark:border-ink-700/50 dark:bg-ink-800">
                <p className="text-xs text-ink-400">{s.university} · {s.subject} / {s.chapter}</p>
                <p className="mt-1 text-sm text-ink-800 dark:text-ink-100">{s.question}</p>
                <div className="mt-2 flex flex-wrap gap-3">
                  <a href={shareMailto(s)} className="text-xs text-amber-dark dark:text-amber">✉️ ইমেইল করো</a>
                  <button onClick={() => copyText(s)} className="text-xs text-amber-dark dark:text-amber">📋 কপি করো</button>
                  <button onClick={() => removeCommunitySubmission(s.id)} className="text-xs text-brick-dark dark:text-brick">মুছে ফেলো</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};
