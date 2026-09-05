// src/components/InterstitialAdManager.tsx
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { AdMob } from '@capacitor-community/admob';
import { useSubscription } from '../hooks/useSubscription';
import { ADMOB_CONFIGURED } from './AdMobInit';

const INTERSTITIAL_AD_UNIT_ID = 'ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ'; // ← AdMob অ্যাকাউন্ট বানিয়ে আসল আইডি বসাও
const FREE_USER_PAGE_INTERVAL = 4;
const SUBSCRIBER_PAGE_INTERVAL = 15;

let preloaded = false;

async function preloadInterstitial() {
  try {
    await AdMob.prepareInterstitial({ adId: INTERSTITIAL_AD_UNIT_ID });
    preloaded = true;
  } catch (err) {
    console.log('ইন্টারস্টিশিয়াল প্রিলোড করতে সমস্যা:', err);
  }
}

export const InterstitialAdManager: React.FC = () => {
  const location = useLocation();
  const { isSubscribed, loading } = useSubscription();
  const pageCount = useRef(0);

  useEffect(() => {
    if (!ADMOB_CONFIGURED || loading) return;
    preloadInterstitial();
  }, [loading]);

  useEffect(() => {
    if (!ADMOB_CONFIGURED || loading) return;
    pageCount.current += 1;
    const interval = isSubscribed ? SUBSCRIBER_PAGE_INTERVAL : FREE_USER_PAGE_INTERVAL;
    if (pageCount.current % interval === 0 && preloaded) {
      AdMob.showInterstitial()
        .then(() => {
          preloaded = false;
          preloadInterstitial();
        })
        .catch(err => console.log('ইন্টারস্টিশিয়াল দেখাতে সমস্যা:', err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, isSubscribed, loading]);

  return null;
};
