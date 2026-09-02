// src/components/ScoreSync.tsx
//
// এই কম্পোনেন্ট কোনো কিছু দেখায় না (invisible) — এটা শুধু background এ
// লগইন করা থাকলে প্রতি অ্যাটেম্পট আপডেট হলে Supabase-এ স্কোর পাঠিয়ে দেয়।
// App.tsx এর ভেতরে একবার বসালেই যথেষ্ট।

import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { syncScoreToSupabase } from '../utils/scoreSync';

export const ScoreSync: React.FC = () => {
  const { user } = useAuth();
  const { stats, userData } = useAppData();
  const lastSynced = useRef<string>('');

  useEffect(() => {
    if (!user) return;
    const key = `${stats.totalAttempts}-${stats.totalCorrect}-${userData.streak.count}`;
    if (lastSynced.current === key) return;
    lastSynced.current = key;
    syncScoreToSupabase(user.id, stats.totalAttempts, stats.totalCorrect, userData.streak.count);
  }, [user, stats.totalAttempts, stats.totalCorrect, userData.streak.count]);

  return null;
};
