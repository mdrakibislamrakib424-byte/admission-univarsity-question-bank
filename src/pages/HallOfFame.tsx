// src/pages/HallOfFame.tsx
import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { supabase } from '../lib/supabase';

interface WinnerRow {
  contest_week_label: string;
  rank: number;
  amount: number;
  display_name: string;
  paid_at: string;
}

export const HallOfFame: React.FC = () => {
  const [winners, setWinners] = useState<WinnerRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('public_winners')
      .select('*')
      .then(({ data }) => {
        setWinners((data as WinnerRow[]) || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-paper pb-24 dark:bg-ink-900">
      <Header title="🏆 বিজয়ীদের তালিকা" showBack />
      <main className="mx-auto max-w-lg space-y-4 px-4 py-5">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-amber via-amber to-amber-dark p-6 text-center text-ink-950">
          <p className="text-4xl">🏆</p>
          <p className="mt-2 font-display text-lg font-bold">সাপ্তাহিক প্রতিযোগিতার বিজয়ীরা</p>
          <p className="mt-1 text-sm opacity-80">প্রতি সপ্তাহে ১ম স্থান অধিকারীকে পুরস্কৃত করা হয়</p>
        </div>

        {loading && <p className="text-center text-sm text-ink-400">লোড হচ্ছে...</p>}
        {!loading && winners.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-ink-200 py-14 text-center dark:border-ink-700/50">
            <span className="text-4xl">⏳</span>
            <p className="text-sm text-ink-400">এখনো কেউ পুরস্কার পায়নি — তুমিই হতে পারো প্রথম বিজয়ী!</p>
          </div>
        )}

        <div className="space-y-2">
          {winners.map((w, i) => (
            <div key={i} className="flex items-center gap-3 rounded-2xl border border-ink-200 bg-white p-4 shadow-sm dark:border-ink-700/40 dark:bg-ink-800">
              <span className="text-2xl">🥇</span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-ink-800 dark:text-ink-100">{w.display_name}</p>
                <p className="text-xs text-ink-400">{w.contest_week_label} · ৳{w.amount}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
