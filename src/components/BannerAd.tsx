// src/components/BannerAd.tsx
//
// ⚠️ নিচে "ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY" এর জায়গায় নিজের
// আসল AdMob Banner Ad Unit ID বসিয়ে দিন (admob.google.com থেকে পাবেন)।
//
// নিয়ম: সাবস্ক্রাইবার হলে ব্যানার একদমই দেখানো হবে না (premium clean experience)।
// ফ্রি ইউজার হলে ব্যানার দেখানো হবে।

import { useEffect } from 'react';
import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { useSubscription } from '../hooks/useSubscription';

const BANNER_AD_UNIT_ID = 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY'; // ← নিজের আসল আইডি বসাও

interface BannerAdProps {
  placement: string; // শুধু ডিবাগ/লগের জন্য, কোন পেজ থেকে ডাকা হচ্ছে বোঝার জন্য
}

export const BannerAd: React.FC<BannerAdProps> = ({ placement }) => {
  const { isSubscribed, loading } = useSubscription();

  useEffect(() => {
    if (loading) return;
    if (isSubscribed) {
      AdMob.removeBanner().catch(() => {});
      return;
    }
    const options: BannerAdOptions = {
      adId: BANNER_AD_UNIT_ID,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0
    };
    AdMob.showBanner(options).catch(err => console.log(`ব্যানার এড (${placement}) দেখাতে সমস্যা:`, err));

    return () => {
      AdMob.removeBanner().catch(() => {});
    };
  }, [isSubscribed, loading, placement]);

  // এই কম্পোনেন্ট নিজে কিছু render করে না — AdMob native overlay হিসেবে বসে
  return null;
};
