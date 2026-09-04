// src/pages/Subscription.tsx
//
// ⚠️ নিচে "YOUR_BKASH_NUMBER" ও "YOUR_NAGAD_NUMBER" এর জায়গায়
// নিজের আসল bKash/Nagad নাম্বার বসিয়ে দিন।

import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

const BKASH_NUMBER = 'YOUR_BKASH_NUMBER'; // যেমন: 01XXXXXXXXX
const NAGAD_NUMBER = 'YOUR_NAGAD_NUMBER';
const PRICE = 850;

interface SubmissionRow {
  id: string;
  status: string;
  payment_method: string;
  transaction_id: string;
  submitted_at: string;
  end_date: string | null;
}

export const Subscription: React.FC = () => {
  const { user } = useAuth();
  const { isSubscribed, endDate, refresh } = useSubscription();
  const [method, setMethod] = useState<'bkash' | 'nagad'>('bkash');
  const [phone, setPhone] = useState('');
  const [trxId, setTrxId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [history, setHistory] = useState<SubmissionRow[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('subscriptions')
      .select('id, status, payment_method, transaction_id, submitted_at, end_date')
      .eq('user_id', user.id)
      .order('submitted_at', { ascending: false })
      .then(({ data }) => setHistory(data || []));
  }, [user, msg]);

  if (!user) {
    return (
      <div className="min-h-screen bg-paper pb-24 dark:bg-ink-900">
        <Header title="সাবস্ক্রিপশন" showBack />
        <main className="mx-auto max-w-lg px-4 py-14 text-center">
          <p className="text-4xl">🔐</p>
          <p className="mt-3 text-sm text-ink-500">
            সাবস্ক্রিপশন কিনতে আগে <Link to="/login" className="font-semibold text-amber-dark dark:text-amber">লগইন করো</Link>।
          </p>
        </main>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!phone || !trxId) {
      setMsg({ type: 'error', text: 'ফোন নাম্বার ও Transaction ID দুটোই দিতে হবে।' });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('subscriptions').insert({
      user_id: user.id,
      status: 'pending',
      payment_method: method,
      phone_number: phone,
      transaction_id: trxId,
      amount: PRICE
    });
    setSubmitting(false);
    if (error) {
      if (error.code === '23505') {
        setMsg({ type: 'error', text: '⚠️ এই Transaction ID আগেই ব্যবহার করা হয়েছে। ভুল করে থাকলে সঠিক ID দিয়ে আবার চেষ্টা করো, অথবা সাপোর্টে যোগাযোগ করো।' });
      } else {
        setMsg({ type: 'error', text: 'এরর: ' + error.message });
      }
      return;
    }
    setMsg({ type: 'success', text: '✅ পাঠানো হয়েছে! Admin যাচাই করে ২৪ ঘণ্টার মধ্যে অনুমোদন করবে।' });
    setPhone('');
    setTrxId('');
  };

  if (isSubscribed) {
    return (
      <div className="min-h-screen bg-paper pb-24 dark:bg-ink-900">
        <Header title="সাবস্ক্রিপশন" showBack />
        <main className="mx-auto max-w-lg px-4 py-10 text-center">
          <div className="rounded-3xl bg-gradient-to-br from-leaf to-leaf-dark p-8 text-white shadow-lg shadow-leaf/30">
            <p className="text-5xl">👑</p>
            <p className="mt-3 font-display text-xl font-bold">তুমি প্রিমিয়াম মেম্বার!</p>
            <p className="mt-1 text-sm opacity-90">
              মেয়াদ শেষ হবে: {endDate ? new Date(endDate).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper pb-24 dark:bg-ink-900">
      <Header title="👑 প্রিমিয়াম সাবস্ক্রিপশন" showBack />
      <main className="mx-auto max-w-lg space-y-5 px-4 py-5">
        {/* প্রাইসিং কার্ড */}
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-ink-900 to-ink-700 p-6 text-white dark:from-ink-800 dark:to-ink-950">
          <p className="text-sm opacity-70">৬ মাসের জন্য</p>
          <p className="mt-1 font-display text-4xl font-bold">৳{PRICE}</p>
          <ul className="mt-4 space-y-2 text-sm opacity-90">
            <li>✅ সব বছরের প্রশ্ন (১০ বছরের পুরনোও)</li>
            <li>✅ যতবার ইচ্ছা প্র্যাকটিস করো</li>
            <li>✅ সব এক্সাম দেওয়ার সুযোগ</li>
            <li>✅ খুবই হালকা বিজ্ঞাপন</li>
          </ul>
        </div>

        {/* পেমেন্ট নির্দেশনা */}
        <div className="space-y-3 rounded-3xl border border-ink-200 bg-white p-5 shadow-sm dark:border-ink-700/40 dark:bg-ink-800">
          <p className="text-sm font-semibold text-ink-800 dark:text-ink-100">📲 প্রথমে পেমেন্ট করো</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setMethod('bkash')}
              className={`rounded-2xl border p-3 text-center text-sm font-medium transition-colors ${
                method === 'bkash' ? 'border-brick bg-brick/10 text-brick-dark dark:text-brick' : 'border-ink-200 text-ink-500 dark:border-ink-700/50'
              }`}
            >
              📱 bKash
            </button>
            <button
              onClick={() => setMethod('nagad')}
              className={`rounded-2xl border p-3 text-center text-sm font-medium transition-colors ${
                method === 'nagad' ? 'border-leaf bg-leaf/10 text-leaf-dark dark:text-leaf' : 'border-ink-200 text-ink-500 dark:border-ink-700/50'
              }`}
            >
              📱 Nagad
            </button>
          </div>
          <div className="rounded-2xl bg-paper p-4 text-center dark:bg-ink-900/50">
            <p className="text-xs text-ink-400">Send Money করো এই নাম্বারে</p>
            <p className="mt-1 text-xl font-bold tracking-wide text-ink-900 dark:text-ink-100">
              {method === 'bkash' ? BKASH_NUMBER : NAGAD_NUMBER}
            </p>
            <p className="mt-1 text-xs text-ink-400">৳{PRICE} টাকা পাঠাও (Send Money অপশনে, Payment না)</p>
          </div>
        </div>

        {/* Transaction ID ফর্ম */}
        <div className="space-y-3 rounded-3xl border border-ink-200 bg-white p-5 shadow-sm dark:border-ink-700/40 dark:bg-ink-800">
          <p className="text-sm font-semibold text-ink-800 dark:text-ink-100">✅ এখন প্রমাণ জমা দাও</p>
          <input
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="যে নাম্বার থেকে পাঠিয়েছ"
            className="w-full rounded-2xl border border-ink-200 bg-paper px-4 py-3 text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 dark:border-ink-700/50 dark:bg-ink-900 dark:text-ink-100"
          />
          <input
            value={trxId}
            onChange={e => setTrxId(e.target.value)}
            placeholder="Transaction ID (যেমন: 8N7A2XXXXX)"
            className="w-full rounded-2xl border border-ink-200 bg-paper px-4 py-3 text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 dark:border-ink-700/50 dark:bg-ink-900 dark:text-ink-100"
          />
          {msg && (
            <div className={`rounded-2xl p-3 text-sm ${msg.type === 'success' ? 'bg-leaf/10 text-leaf-dark dark:text-leaf' : 'bg-brick/10 text-brick-dark dark:text-brick'}`}>
              {msg.text}
            </div>
          )}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full rounded-full bg-gradient-to-r from-amber to-amber-dark py-3 text-sm font-semibold text-ink-950 shadow-md shadow-amber/30 disabled:opacity-60"
          >
            {submitting ? 'পাঠানো হচ্ছে...' : 'জমা দাও'}
          </button>
        </div>

        {history.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-medium text-ink-600 dark:text-ink-300">তোমার আগের সাবমিশন</p>
            <ul className="space-y-2">
              {history.map(h => (
                <li key={h.id} className="flex items-center justify-between rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm dark:border-ink-700/40 dark:bg-ink-800">
                  <span className="text-ink-500">{h.transaction_id}</span>
                  <span
                    className={
                      h.status === 'active'
                        ? 'text-leaf-dark dark:text-leaf'
                        : h.status === 'rejected'
                        ? 'text-brick-dark dark:text-brick'
                        : 'text-amber-dark dark:text-amber'
                    }
                  >
                    {h.status === 'pending' ? '⏳ পর্যালোচনাধীন' : h.status === 'active' ? '✅ অনুমোদিত' : h.status === 'rejected' ? '❌ বাতিল' : h.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};
