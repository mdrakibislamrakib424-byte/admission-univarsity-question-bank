// src/components/BannerAd.tsx
import { useEffect } from 'react';
import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { useSubscription } from '../hooks/useSubscription';
import { ADMOB_CONFIGURED } from './AdMobInit';

const BANNER_AD_UNIT_ID = 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY'; // ← AdMob অ্যাকাউন্ট বানিয়ে আসল আইডি বসাও

interface BannerAdProps {
  placement: string;
}

export const BannerAd: React.FC<BannerAdProps> = ({ placement }) => {
  const { isSubscribed, loading } = useSubscription();

  useEffect(() => {
    if (!ADMOB_CONFIGURED || loading || isSubscribed) return;
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

  return null;
};
