// src/components/DailyProgressAutoSync.tsx
//
// অদৃশ্য কম্পোনেন্ট — অ্যাটেম্পট বাড়লে ব্যাকগ্রাউন্ডে আজকের প্রোগ্রেস
// (তারিখসহ) Supabase-এ পাঠিয়ে দেয়। App.tsx এ একবার বসালেই যথেষ্ট।

import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { syncTodayProgress } from '../utils/dailyProgressSync';

export const DailyProgressAutoSync: React.FC = () => {
  const { user } = useAuth();
  const { userData } = useAppData();
  const lastCount = useRef<number>(-1);

  useEffect(() => {
    if (!user) return;
    if (userData.attempts.length === lastCount.current) return;
    lastCount.current = userData.attempts.length;
    syncTodayProgress(user.id, userData.attempts);
  }, [user, userData.attempts]);

  return null;
};
