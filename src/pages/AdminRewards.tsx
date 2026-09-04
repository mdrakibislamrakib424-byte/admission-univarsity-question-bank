// src/pages/AdminRewards.tsx
//
// এখানে Admin দেখবে কে কে সাপ্তাহিক প্রতিযোগিতায় ১ম হয়েছে (স্বয়ংক্রিয়
// হিসাব করা), এবং bKash/Nagad এ ম্যানুয়ালি টাকা পাঠানোর পর "পাঠানো
// হয়েছে" মার্ক করে দেবে — এতে transaction reference সেভ থাকে, প্রমাণ
// হিসেবে। Database-লেভেলে unique constraint থাকায় একই সপ্তাহের একই
// র‍্যাংকে দুইবার পুরস্কার দেওয়া সম্ভবই না — এটাই জালিয়াতি ঠেকায়।

import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface WinnerRow {
  exam_id: string;
  title: string;
  contest_week_label: string;
  user_id: string;
  score: number;
  rank: number;
}

interface PayoutRow {
  contest_week_label: string;
  rank: number;
  amount: number;
  transaction_reference: string;
  paid_at: string;
}

export const AdminRewards: React.FC = () => {
  const { user } = useAuth();
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
  const [rewardsActive, setRewardsActive] = useState(false);
  const [winners, setWinners] = useState<WinnerRow[]>([]);
  const [payouts, setPayouts] = useState<PayoutRow[]>([]);
  const [namesById, setNamesById] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  // পেমেন্ট ফর্ম স্টেট (কোন উইনারের জন্য এখন ফর্ম খোলা আছে)
  const [openFor, setOpenFor] = useState<string | null>(null);
  const [amount, setAmount] = useState('300');
  const [method, setMethod] = useState<'bkash' | 'nagad'>('bkash');
  const [phone, setPhone] = useState('');
  const [trxRef, setTrxRef] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const load = async () => {
    setLoading(true);
    const { data: countRow } = await supabase.from('active_subscriber_count').select('total').single();
    const total = countRow?.total ?? 0;
    setSubscriberCount(total);
    setRewardsActive(total >= 250);

    const { data: winnersData } = await supabase
      .from('weekly_contest_winners')
      .select('*')
      .eq('rank', 1)
      .order('contest_week_label', { ascending: false });
    setWinners((winnersData as WinnerRow[]) || []);

    const { data: payoutData } = await supabase
      .from('reward_payouts')
      .select('contest_week_label, rank, amount, transaction_reference, paid_at')
      .order('paid_at', { ascending: false });
    setPayouts((payoutData as PayoutRow[]) || []);

    if (winnersData && winnersData.length > 0) {
      const ids = winnersData.map((w: WinnerRow) => w.user_id);
      const { data: profiles } = await supabase.from('profiles').select('id, display_name').in('id', ids);
      const map: Record<string, string> = {};
      (profiles || []).forEach(p => (map[p.id] = p.display_name));
      setNamesById(map);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) load();
  }, [user]);

  const isPaid = (weekLabel: string) => payouts.some(p => p.contest_week_label === weekLabel && p.rank === 1);

  const submitPayout = async (w: WinnerRow) => {
    if (!phone || !trxRef || !amount) {
      setMsg('সব ঘর পূরণ করো।');
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('reward_payouts').insert({
      exam_id: w.exam_id,
      user_id: w.user_id,
      contest_week_label: w.contest_week_label,
      rank: 1,
      amount: Number(amount),
      payment_method: method,
      sent_to_phone: phone,
      transaction_reference: trxRef,
      paid_by: user!.id
    });
    setSaving(false);
    if (error) {
      setMsg(error.code === '23505' ? '⚠️ এই সপ্তাহের পুরস্কার আগেই দেওয়া হয়েছে — ডুপ্লিকেট এন্ট্রি আটকানো হলো।' : 'এরর: ' + error.message);
      return;
    }
    setMsg('✅ পুরস্কার প্রদানের রেকর্ড সেভ হয়েছে।');
    setOpenFor(null);
    setPhone('');
    setTrxRef('');
    load();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-paper pb-24 dark:bg-ink-900">
        <Header title="পুরস্কার প্যানেল" showBack />
        <main className="px-4 py-10 text-center text-sm text-ink-500">লগইন করো।</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper pb-24 dark:bg-ink-900">
      <Header title="🏆 পুরস্কার প্যানেল" showBack />
      <main className="mx-auto max-w-lg space-y-5 px-4 py-5">
        {/* সাবস্ক্রাইবার কাউন্ট + থ্রেশহোল্ড */}
        <div
          className={`rounded-3xl p-5 text-white shadow-lg ${
            rewardsActive ? 'bg-gradient-to-br from-leaf to-leaf-dark' : 'bg-gradient-to-br from-ink-700 to-ink-900'
          }`}
        >
          <p className="text-sm opacity-80">সক্রিয় Subscriber</p>
          <p className="mt-1 font-display text-4xl font-bold">{loading ? '...' : subscriberCount} / 250</p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white transition-all duration-700"
              style={{ width: `${Math.min(100, ((subscriberCount ?? 0) / 250) * 100)}%` }}
            />
          </div>
          <p className="mt-2 text-sm">
            {rewardsActive ? '✅ পুরস্কার সিস্টেম চালু হয়ে গেছে' : '⏳ ২৫০ জন হলেই পুরস্কার সিস্টেম স্বয়ংক্রিয়ভাবে চালু হবে'}
          </p>
        </div>

        {!rewardsActive && (
          <p className="rounded-2xl bg-amber/10 p-3 text-xs text-ink-500 dark:text-ink-300">
            এখনো ২৫০ জনে পৌঁছায়নি, তাই নিচের বিজয়ীদের তালিকা শুধু তথ্যের জন্য দেখানো হচ্ছে — এখনই পুরস্কার পাঠানোর
            দরকার নেই।
          </p>
        )}

        {/* বিজয়ীদের তালিকা */}
        <section>
          <h2 className="mb-2 font-display text-base text-ink-900 dark:text-ink-100">📅 সাপ্তাহিক বিজয়ী (১ম স্থান)</h2>
          {loading && <p className="text-sm text-ink-400">লোড হচ্ছে...</p>}
          {!loading && winners.length === 0 && (
            <p className="text-sm text-ink-400">এখনো কোনো সাপ্তাহিক প্রতিযোগিতা শেষ হয়নি।</p>
          )}
          <div className="space-y-2">
            {winners.map(w => {
              const paid = isPaid(w.contest_week_label);
              return (
                <div key={w.exam_id} className="rounded-2xl border border-ink-200 bg-white p-4 shadow-sm dark:border-ink-700/40 dark:bg-ink-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-ink-400">{w.contest_week_label} · {w.title}</p>
                      <p className="mt-0.5 font-medium text-ink-800 dark:text-ink-100">
                        🥇 {namesById[w.user_id] || '...'} <span className="text-xs text-ink-400">(স্কোর: {w.score})</span>
                      </p>
                    </div>
                    {paid ? (
                      <span className="rounded-full bg-leaf/15 px-3 py-1 text-xs font-medium text-leaf-dark dark:text-leaf">✅ পাঠানো হয়েছে</span>
                    ) : rewardsActive ? (
                      <button
                        onClick={() => setOpenFor(openFor === w.exam_id ? null : w.exam_id)}
                        className="rounded-full bg-amber px-3 py-1.5 text-xs font-semibold text-ink-950"
                      >
                        💸 পুরস্কার দাও
                      </button>
                    ) : (
                      <span className="text-xs text-ink-300">অপেক্ষমান</span>
                    )}
                  </div>

                  {openFor === w.exam_id && (
                    <div className="mt-3 space-y-2 rounded-xl bg-paper p-3 dark:bg-ink-900/50">
                      <div className="grid grid-cols-2 gap-2">
                        <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="টাকার পরিমাণ" className="rounded-lg border border-ink-200 px-3 py-2 text-sm dark:border-ink-700/50 dark:bg-ink-900" />
                        <select value={method} onChange={e => setMethod(e.target.value as 'bkash' | 'nagad')} className="rounded-lg border border-ink-200 px-3 py-2 text-sm dark:border-ink-700/50 dark:bg-ink-900">
                          <option value="bkash">bKash</option>
                          <option value="nagad">Nagad</option>
                        </select>
                      </div>
                      <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="যে নাম্বারে পাঠালে" className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm dark:border-ink-700/50 dark:bg-ink-900" />
                      <input value={trxRef} onChange={e => setTrxRef(e.target.value)} placeholder="Transaction Reference / ID" className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm dark:border-ink-700/50 dark:bg-ink-900" />
                      {msg && <p className="text-xs text-ink-500">{msg}</p>}
                      <button
                        onClick={() => submitPayout(w)}
                        disabled={saving}
                        className="w-full rounded-full bg-leaf py-2 text-sm font-semibold text-white disabled:opacity-50"
                      >
                        {saving ? 'সেভ হচ্ছে...' : 'পাঠানো হয়েছে — নিশ্চিত করো'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};
