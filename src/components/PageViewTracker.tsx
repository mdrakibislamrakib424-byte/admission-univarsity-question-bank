// src/components/PageViewTracker.tsx
//
// অদৃশ্য কম্পোনেন্ট — প্রতিটা পেজ পরিবর্তনে ব্যাকগ্রাউন্ডে একটা
// analytics ইভেন্ট লগ করে। App.tsx এ একবার বসালেই যথেষ্ট।

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logEvent } from '../utils/analytics';

export const PageViewTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    logEvent('page_view', location.pathname);
  }, [location.pathname]);

  return null;
};
