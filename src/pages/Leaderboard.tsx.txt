import React, { useMemo, useState } from 'react';
import { Header } from '../components/Header';
import { useAppData } from '../context/AppDataContext';
import { bestScorePercent, encodeShareCode, decodeShareCode } from '../utils/leaderboard';
import { LeaderboardEntry } from '../types';

export const Leaderboard: React.FC = () => {
  const { userData, stats, setLeaderboardName, addLeaderboardFriend, removeLeaderboardFriend } = useAppData();
  const [nameInput, setNameInput] = useState(userData.leaderboardName);
  const [importCode, setImportCode] = useState('');
  const [copyMsg, setCopyMsg] = useState('');
  const [importMsg, setImportMsg] = useState('');

  const myEntry: LeaderboardEntry = useMemo(
    () => ({
      name: userData.leaderboardName || 'আমি',
      bestScorePercent: bestScorePercent(userData.mockTestResults),
      totalAttempts: stats.totalAttempts,
      streak: userData.streak.count,
      addedAt: Date.now()
    }),
    [userData.leaderboardName, userData.mockTestResults, stats.totalAttempts, userData.streak.count]
  );

  const board = useMemo(
    () => [myEntry, ...userData.leaderboardFriends].sort((a, b) => b.bestScorePercent - a.bestScorePercent),
    [myEntry, userData.leaderboardFriends]
  );

  const shareCode = useMemo(() => encodeShareCode(myEntry), [myEntry]);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(shareCode);
      setCopyMsg('কপি হয়েছে! বন্ধুকে পাঠাও।');
    } catch {
      setCopyMsg('কপি করা যায়নি, ম্যানুয়ালি সিলেক্ট করে কপি করো।');
    }
    setTimeout(() => setCopyMsg(''), 2500);
  };

  const importFriend = () => {
    const entry = decodeShareCode(importCode);
    if (!entry) {
      setImportMsg('কোড ঠিক নেই। বন্ধুর কাছ থেকে সম্পূর্ণ কোডটা কপি করে বসাও।');
      return;
    }
    addLeaderboardFriend(entry);
    setImportCode('');
    setImportMsg(`${entry.name} যোগ হয়েছে!`);
    setTimeout(() => setImportMsg(''), 2500);
  };

  return (
    <div className="pb-24">
      <Header title="🏆 লিডারবোর্ড" showBack />
      <main className="mx-auto max-w-lg space-y-5 px-4 py-5">
        <p className="rounded-xl bg-paper p-3 text-xs leading-relaxed text-ink-400 dark:bg-ink-900/40">
          এই অ্যাপের কোনো সার্ভার নেই, তাই লাইভ, সবার-জন্য-এক লিডারবোর্ড সম্ভব না। এর বদলে তুমি নিজের স্কোরের একটা "শেয়ার
          কোড" বন্ধুকে পাঠাবে, আর বন্ধু তার কোড তোমাকে দিলে সেটা এখানে বসিয়ে তুলনা করতে পারবে।
        </p>

        <section className="rounded-xl border border-ink-200 bg-white p-4 dark:border-ink-700/50 dark:bg-ink-800">
          <label className="block text-xs text-ink-500">
            তোমার নাম (লিডারবোর্ডে দেখাবে)
            <input
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onBlur={() => setLeaderboardName(nameInput.trim())}
              placeholder="তোমার নাম লেখো"
              className="mt-1 w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm dark:border-ink-700/50 dark:bg-ink-900"
            />
          </label>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-ink-900 dark:text-ink-100">তুলনা</h2>
          <ul className="divide-y divide-ink-200 overflow-hidden rounded-xl border border-ink-200 dark:divide-ink-700/40 dark:border-ink-700/40">
            {board.map((e, i) => (
              <li key={e.name + i} className="flex items-center justify-between bg-white px-4 py-3 dark:bg-ink-800">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-ink-400">#{i + 1}</span>
                  <span className="text-sm font-medium text-ink-800 dark:text-ink-100">
                    {e.name} {e.name === myEntry.name && '(তুমি)'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-amber-dark dark:text-amber">{e.bestScorePercent}%</span>
                  {e.name !== myEntry.name && (
                    <button onClick={() => removeLeaderboardFriend(e.name)} className="text-xs text-ink-400">✕</button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-ink-200 bg-white p-4 dark:border-ink-700/50 dark:bg-ink-800">
          <p className="mb-2 text-sm font-medium text-ink-800 dark:text-ink-100">তোমার শেয়ার কোড</p>
          <textarea readOnly value={shareCode} rows={3} className="w-full rounded-lg border border-ink-200 bg-paper p-2 text-xs dark:border-ink-700/50 dark:bg-ink-900" />
          <button onClick={copyCode} className="mt-2 w-full rounded-full bg-amber py-2 text-sm font-semibold text-ink-950">
            কোড কপি করো
          </button>
          {copyMsg && <p className="mt-1 text-center text-xs text-leaf-dark dark:text-leaf">{copyMsg}</p>}
        </section>

        <section className="rounded-xl border border-ink-200 bg-white p-4 dark:border-ink-700/50 dark:bg-ink-800">
          <p className="mb-2 text-sm font-medium text-ink-800 dark:text-ink-100">বন্ধুর কোড বসাও</p>
          <textarea
            value={importCode}
            onChange={e => setImportCode(e.target.value)}
            rows={3}
            placeholder="বন্ধুর পাঠানো কোড এখানে পেস্ট করো"
            className="w-full rounded-lg border border-ink-200 bg-paper p-2 text-xs dark:border-ink-700/50 dark:bg-ink-900"
          />
          <button onClick={importFriend} className="mt-2 w-full rounded-full border border-ink-200 py-2 text-sm font-semibold text-ink-700 dark:border-ink-700/50 dark:text-ink-200">
            যোগ করো
          </button>
          {importMsg && <p className="mt-1 text-center text-xs text-ink-500">{importMsg}</p>}
        </section>
      </main>
    </div>
  );
};
