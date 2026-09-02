// src/pages/AdminSubscriptions.tsx
import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface Row {
  id: string;
  user_id: string;
  status: string;
  payment_method: string;
  phone_number: string;
  transaction_id: string;
  amount: number;
  submitted_at: string;
}

export const AdminSubscriptions: React.FC = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    supabase
      .from('subscriptions')
      .select('*')
      .order('submitted_at', { ascending: false })
      .then(({ data }) => {
        setRows((data as Row[]) || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (user) load();
  }, [user]);

  const approve = async (row: Row) => {
    setBusyId(row.id);
    const start = new Date();
    const end = new Date();
    end.setMonth(end.getMonth() + 6);
    await supabase
      .from('subscriptions')
      .update({
        status: 'active',
        approved_at: new Date().toISOString(),
        approved_by: user!.id,
        start_date: start.toISOString().slice(0, 10),
        end_date: end.toISOString().slice(0, 10)
      })
      .eq('id', row.id);
    setBusyId(null);
    load();
  };

  const reject = async (row: Row) => {
    setBusyId(row.id);
    await supabase.from('subscriptions').update({ status: 'rejected' }).eq('id', row.id);
    setBusyId(null);
    load();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-paper pb-24 dark:bg-ink-900">
        <Header title="Admin — সাবস্ক্রিপশন" showBack />
        <main className="px-4 py-10 text-center text-sm text-ink-500">লগইন করো।</main>
      </div>
    );
  }

  const pending = rows.filter(r => r.status === 'pending');
  const others = rows.filter(r => r.status !== 'pending');

  return (
    <div className="min-h-screen bg-paper pb-24 dark:bg-ink-900">
      <Header title="Admin — সাবস্ক্রিপশন" showBack />
      <main className="mx-auto max-w-lg space-y-6 px-4 py-5">
        <p className="rounded-2xl bg-amber/10 p-3 text-xs text-ink-500 dark:text-ink-300">
          এই পেজ শুধু Admin (profiles.is_admin = true) দেখতে/অ্যাপ্রুভ করতে পারবে — RLS দিয়ে সুরক্ষিত।
        </p>

        <section>
          <h2 className="mb-2 flex items-center gap-2 font-display text-base text-ink-900 dark:text-ink-100">
            ⏳ অপেক্ষমান <span className="rounded-full bg-amber/20 px-2 py-0.5 text-xs font-normal">{pending.length}</span>
          </h2>
          {loading && <p className="text-sm text-ink-400">লোড হচ্ছে...</p>}
          {!loading && pending.length === 0 && <p className="text-sm text-ink-400">কোনো নতুন সাবমিশন নেই।</p>}
          <div className="space-y-2">
            {pending.map(r => (
              <div key={r.id} className="rounded-2xl border border-amber/30 bg-white p-4 shadow-sm dark:border-amber/20 dark:bg-ink-800">
                <p className="text-xs text-ink-400">{new Date(r.submitted_at).toLocaleString('bn-BD')}</p>
                <p className="mt-1 text-sm text-ink-800 dark:text-ink-100">
                  {r.payment_method.toUpperCase()} · {r.phone_number} · ৳{r.amount}
                </p>
                <p className="font-mono text-xs text-ink-500">TrxID: {r.transaction_id}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => approve(r)}
                    disabled={busyId === r.id}
                    className="flex-1 rounded-full bg-leaf py-2 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    ✅ অনুমোদন করো (৬ মাস)
                  </button>
                  <button
                    onClick={() => reject(r)}
                    disabled={busyId === r.id}
                    className="flex-1 rounded-full border border-brick/40 py-2 text-sm font-semibold text-brick-dark dark:text-brick disabled:opacity-50"
                  >
                    ❌ বাতিল করো
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {others.length > 0 && (
          <section>
            <h2 className="mb-2 font-display text-base text-ink-900 dark:text-ink-100">আগের সিদ্ধান্ত</h2>
            <div className="space-y-2">
              {others.map(r => (
                <div key={r.id} className="flex items-center justify-between rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm dark:border-ink-700/40 dark:bg-ink-800">
                  <span className="text-ink-500">{r.transaction_id}</span>
                  <span className={r.status === 'active' ? 'text-leaf-dark dark:text-leaf' : 'text-brick-dark dark:text-brick'}>
                    {r.status === 'active' ? '✅ সক্রিয়' : '❌ বাতিল'}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
