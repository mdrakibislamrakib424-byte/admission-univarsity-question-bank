// src/components/AdMobInit.tsx
//
// ⚠️ AdMob অ্যাকাউন্ট বানিয়ে আসল App ID/Ad Unit ID বসানোর আগ পর্যন্ত
// ADMOB_CONFIGURED = false রাখুন — নাহলে অ্যাপ চালু হওয়ার সাথে সাথে
// ক্র্যাশ করবে (Google-এর নিয়ম: বৈধ App ID ছাড়া AdMob initialize
// করলে অ্যাপ বন্ধ হয়ে যায়)।
//
// AdMob অ্যাকাউন্ট বানিয়ে, BannerAd.tsx ও InterstitialAdManager.tsx তে
// আসল Ad Unit ID বসিয়ে, তারপর নিচের মান true করে দেবেন।

export const ADMOB_CONFIGURED = false;

import { useEffect } from 'react';
import { AdMob } from '@capacitor-community/admob';

export const AdMobInit: React.FC = () => {
  useEffect(() => {
    if (!ADMOB_CONFIGURED) {
      console.log('AdMob এখনো কনফিগার করা হয়নি — initialize স্কিপ করা হলো।');
      return;
    }
    AdMob.initialize({ initializeForTesting: false }).catch(err =>
      console.log('AdMob initialize করতে সমস্যা:', err)
    );
  }, []);
  return null;
};
