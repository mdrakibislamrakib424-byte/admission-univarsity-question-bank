// src/pages/AdminExam.tsx
import React, { useState } from 'react';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { supabase } from '../lib/supabase';

export const AdminExam: React.FC = () => {
  const { user } = useAuth();
  const { questions } = useAppData();
  const [title, setTitle] = useState('');
  const [idsText, setIdsText] = useState('');
  const [duration, setDuration] = useState(30);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-paper pb-24 dark:bg-ink-900">
        <Header title="এক্সাম বানাও" showBack />
        <main className="mx-auto max-w-lg px-4 py-14 text-center">
          <p className="text-4xl">🔐</p>
          <p className="mt-3 text-sm text-ink-500">এক্সাম বানাতে আগে লগইন করো।</p>
        </main>
      </div>
    );
  }

  const validIds = idsText.split(',').map(s => s.trim()).filter(Boolean).filter(id => questions.some(q => q.id === id));
  const totalTyped = idsText.split(',').map(s => s.trim()).filter(Boolean).length;

  const handleCreate = async () => {
    if (!title || validIds.length === 0) {
      setMsg({ type: 'error', text: 'শিরোনাম দাও এবং কমপক্ষে ১টা সঠিক প্রশ্নের id দাও।' });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('exams').insert({
      title,
      question_ids: validIds,
      duration_minutes: duration,
      is_active: true,
      created_by: user.id
    });
    setSaving(false);
    if (error) {
      setMsg({ type: 'error', text: 'এরর: ' + error.message });
      return;
    }
    setMsg({
      type: 'success',
      text: `✅ "${title}" তৈরি হয়েছে — ${validIds.length}টি প্রশ্ন যোগ হলো${totalTyped - validIds.length > 0 ? ` (${totalTyped - validIds.length}টি id খুঁজে পাওয়া যায়নি)` : ''}।`
    });
    setTitle('');
    setIdsText('');
  };

  return (
    <div className="min-h-screen bg-paper pb-24 dark:bg-ink-900">
      <Header title="এক্সাম বানাও" showBack />
      <main className="mx-auto max-w-lg space-y-5 px-4 py-5">
        <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-ink-900 to-ink-700 p-4 text-white dark:from-ink-800 dark:to-ink-900">
          <span className="text-2xl">🛠️</span>
          <div>
            <p className="text-sm font-semibold">Admin প্যানেল</p>
            <p className="text-xs opacity-80">প্রশ্ন বেছে নতুন মডেল টেস্ট তৈরি করো</p>
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-ink-200 bg-white p-5 shadow-sm dark:border-ink-700/40 dark:bg-ink-800">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">📌 এক্সামের নাম</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="যেমন: DU A ইউনিট মডেল টেস্ট ১"
              className="w-full rounded-2xl border border-ink-200 bg-paper p-3 text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 dark:border-ink-700/50 dark:bg-ink-900 dark:text-ink-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">⏱️ সময় (মিনিট)</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={5}
                max={180}
                step={5}
                value={duration}
                onChange={e => setDuration(Number(e.target.value))}
                className="flex-1 accent-amber"
              />
              <span className="w-16 shrink-0 rounded-xl bg-amber/10 py-1.5 text-center text-sm font-semibold text-amber-dark dark:text-amber">
                {duration}m
              </span>
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-ink-700 dark:text-ink-200">📝 প্রশ্নের id গুলো</label>
              <span className="text-xs text-ink-400">মোট {questions.length}টি প্রশ্ন আছে</span>
            </div>
            <textarea
              value={idsText}
              onChange={e => setIdsText(e.target.value)}
              rows={6}
              placeholder="du-2023-bangla-001, du-2023-bangla-002, ..."
              className="w-full rounded-2xl border border-ink-200 bg-paper p-3 font-mono text-xs outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 dark:border-ink-700/50 dark:bg-ink-900 dark:text-ink-100"
            />
            {idsText.trim() && (
              <p className="mt-1.5 text-xs text-ink-400">
                {validIds.length}টি সঠিক id পাওয়া গেছে{totalTyped - validIds.length > 0 && ` · ${totalTyped - validIds.length}টি খুঁজে পাওয়া যায়নি`}
              </p>
            )}
          </div>

          {msg && (
            <div
              className={`flex items-start gap-2 rounded-2xl p-3 text-sm ${
                msg.type === 'success'
                  ? 'bg-leaf/10 text-leaf-dark dark:text-leaf'
                  : 'bg-brick/10 text-brick-dark dark:text-brick'
              }`}
            >
              <span>{msg.type === 'success' ? '✅' : '⚠️'}</span>
              <span>{msg.text}</span>
            </div>
          )}

          <button
            onClick={handleCreate}
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber to-amber-dark py-3 text-sm font-semibold text-ink-950 shadow-md shadow-amber/30 transition-transform active:scale-[0.98] disabled:opacity-60"
          >
            {saving ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-950 border-t-transparent" />
                সেভ হচ্ছে...
              </>
            ) : (
              '🚀 এক্সাম তৈরি করো'
            )}
          </button>
        </div>
      </main>
    </div>
  );
};
