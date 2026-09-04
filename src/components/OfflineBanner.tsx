// src/components/OfflineBanner.tsx
//
// ইন্টারনেট না থাকলে উপরে একটা ছোট ব্যানার দেখায়। প্রশ্ন প্র্যাকটিস
// (যেটা লোকাল ডাটা থেকে চলে) তখনও কাজ করবে, শুধু Login/Leaderboard/
// Sync এর মতো অংশ কাজ করবে না — এই কথাটাই ইউজারকে জানিয়ে দেওয়া হয়।

import React, { useEffect, useState } from 'react';

export const OfflineBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="sticky top-0 z-50 bg-brick px-4 py-2 text-center text-xs font-medium text-white">
      📡 ইন্টারনেট সংযোগ নেই — প্র্যাকটিস চলবে, কিন্তু লগইন/সিঙ্ক/লিডারবোর্ড কাজ করবে না
    </div>
  );
};
