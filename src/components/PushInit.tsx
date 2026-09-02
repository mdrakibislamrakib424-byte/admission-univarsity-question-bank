// src/components/PushInit.tsx
//
// অদৃশ্য কম্পোনেন্ট — ইউজার লগইন করলে এটা ফোনের push token
// রেজিস্টার করে Supabase-এ পাঠিয়ে দেয়। App.tsx এ একবার বসালেই যথেষ্ট।

import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { initPushNotifications } from '../utils/pushNotifications';

export const PushInit: React.FC = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    initPushNotifications(user.id).catch(err =>
      console.error('পুশ নোটিফিকেশন চালু করা যায়নি:', err)
    );
  }, [user]);

  return null;
};
