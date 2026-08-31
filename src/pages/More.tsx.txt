import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { useAppData } from '../context/AppDataContext';
import { requestNotificationPermission, isNotificationSupported } from '../utils/notifications';

export const More: React.FC = () => {
  const { userData, toggleDarkMode, resetAllData, setExamDate, setNotificationSettings } = useAppData();
  const [notifMsg, setNotifMsg] = useState('');

  const items = [
    { to: '/search', icon: '🔍', label: 'খুঁজো' },
    { to: '/memorization', icon: '🧠', label: 'মুখস্থ ও রিভিশন' },
    { to: '/mistakes', icon: '❌', label: 'আমার ভুলগুলো' },
    { to: '/bookmarks', icon: '🔖', label: 'সেভ করা প্রশ্ন' },
    { to: '/predictions', icon: '🔮', label: 'প্রেডিক্টেড প্রশ্ন' },
    { to: '/badges', icon: '🏅', label: 'ব্যাজ' },
    { to: '/leaderboard', icon: '🏆', label: 'লিডারবোর্ড / বন্ধুদের সাথে তুলনা' },
    { to: '/ai-help', icon: '🤖', label: 'AI ডাউট সলভার' },
    { to: '/community', icon: '📝', label: 'প্রশ্ন সাবমিট করো' },
    { to: '/admin', icon: '➕', label: 'প্রশ্ন যোগ করো (Admin)' }
  ];

  const toggleNotifications = async (checked: boolean) => {
    if (checked) {
      const perm = await requestNotificationPermission();
      if (perm !== 'granted') {
        setNotifMsg('নোটিফিকেশন পারমিশন দেওয়া হয়নি। ফোনের ব্রাউজার সেটিংস থেকে অনুমতি দাও।');
        setNotificationSettings(false, userData.notifications.time);
        return;
      }
    }
    setNotificationSettings(checked, userData.notifications.time);
    setNotifMsg('');
  };

  return (
    <div className="pb-24">
      <Header title="আরও" />
      <main className="mx-auto max-w-lg space-y-6 px-4 py-5">
        <ul className="divide-y divide-ink-200 overflow-hidden rounded-xl border border-ink-200 dark:divide-ink-700/40 dark:border-ink-700/40">
          {items.map(it => (
            <li key={it.to}>
              <Link to={it.to} className="flex items-center gap-3 bg-white px-4 py-3 dark:bg-ink-800">
                <span className="text-lg">{it.icon}</span>
                <span className="text-sm text-ink-800 dark:text-ink-100">{it.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <section className="rounded-xl border border-ink-200 bg-white p-4 dark:border-ink-700/50 dark:bg-ink-800">
          <div className="flex items-center justify-between">
            <span className="text-sm text-ink-800 dark:text-ink-100">🌙 ডার্ক মোড</span>
            <button
              onClick={toggleDarkMode}
              className={`h-6 w-11 rounded-full transition-colors ${userData.darkMode ? 'bg-amber' : 'bg-ink-300'}`}
            >
              <span className={`block h-5 w-5 rounded-full bg-white transition-transform ${userData.darkMode ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </section>

        <section className="space-y-3 rounded-xl border border-ink-200 bg-white p-4 dark:border-ink-700/50 dark:bg-ink-800">
          <p className="text-sm font-medium text-ink-800 dark:text-ink-100">⏳ ভর্তি পরীক্ষার কাউন্টডাউন</p>
          <input
            type="date"
            value={userData.examDate || ''}
            onChange={e => setExamDate(e.target.value || null)}
            className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm dark:border-ink-700/50 dark:bg-ink-900"
          />
          {userData.examDate && (
            <button onClick={() => setExamDate(null)} className="text-xs text-brick-dark dark:text-brick">
              তারিখ মুছে ফেলো
            </button>
          )}
        </section>

        <section className="space-y-3 rounded-xl border border-ink-200 bg-white p-4 dark:border-ink-700/50 dark:bg-ink-800">
          <div className="flex items-center justify-between">
            <span className="text-sm text-ink-800 dark:text-ink-100">🔔 দৈনিক পড়ার রিমাইন্ডার</span>
            <button
              onClick={() => toggleNotifications(!userData.notifications.enabled)}
              className={`h-6 w-11 rounded-full transition-colors ${userData.notifications.enabled ? 'bg-amber' : 'bg-ink-300'}`}
            >
              <span className={`block h-5 w-5 rounded-full bg-white transition-transform ${userData.notifications.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
          {userData.notifications.enabled && (
            <input
              type="time"
              value={userData.notifications.time}
              onChange={e => setNotificationSettings(true, e.target.value)}
              className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm dark:border-ink-700/50 dark:bg-ink-900"
            />
          )}
          {!isNotificationSupported() && (
            <p className="text-xs text-ink-400">তোমার ব্রাউজার নোটিফিকেশন সাপোর্ট করে না।</p>
          )}
          {notifMsg && <p className="text-xs text-brick-dark dark:text-brick">{notifMsg}</p>}
          <p className="text-xs text-ink-400">
            এটা একটা লোকাল রিমাইন্ডার — অ্যাপ/ফোন মাঝে মাঝে খোলা থাকলে নির্দিষ্ট সময়ে নোটিফিকেশন দেখাবে। সার্ভার-ভিত্তিক পুশ নোটিফিকেশন না, কারণ এই অ্যাপের কোনো ব্যাকএন্ড সার্ভার নেই।
          </p>
        </section>

        <section className="rounded-xl border border-brick/30 bg-brick/5 p-4">
          <p className="mb-2 text-sm text-brick-dark dark:text-brick">সব প্রোগ্রেস, বুকমার্ক ও ভুল-তালিকা মুছে ফেলো</p>
          <button onClick={resetAllData} className="rounded-full border border-brick/50 px-4 py-1.5 text-sm text-brick-dark dark:text-brick">
            রিসেট করো
          </button>
        </section>

        <p className="text-center text-xs text-ink-400">প্রশ্নব্যাংক · তোমার ফোন থেকেই তৈরি ও পরিচালিত</p>
      </main>
    </div>
  );
};
