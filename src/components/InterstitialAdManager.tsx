// src/components/InterstitialAdManager.tsx
//
// ⚠️ নিচে ইন্টারস্টিশিয়াল Ad Unit ID বসাও।
//
// নিয়ম (Google AdMob পলিসি মেনে, প্রতি পেজে না দেখিয়ে যুক্তিসঙ্গতভাবে):
// - ফ্রি ইউজার: প্রতি ৪টা পেজ পরিবর্তনে ১বার ইন্টারস্টিশিয়াল
// - সাবস্ক্রাইবার: ইন্টারস্টিশিয়াল একদমই দেখানো হয় না
//
// App.tsx এ একবার বসালেই কাজ করবে — এটা route পরিবর্তন ট্র্যাক করে।

import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { AdMob } from '@capacitor-community/admob';
import { useSubscription } from '../hooks/useSubscription';

const INTERSTITIAL_AD_UNIT_ID = 'ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ'; // ← নিজের আসল আইডি বসাও
const FREE_USER_PAGE_INTERVAL = 4; // ফ্রি ইউজারের জন্য প্রতি কয়টা পেজে একবার
const SUBSCRIBER_PAGE_INTERVAL = 15; // সাবস্ক্রাইবারের জন্য অনেক কম (প্রায় দেখা যাবে না)

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
    if (loading) return;
    preloadInterstitial();
  }, [loading]);

  useEffect(() => {
    if (loading) return;
    pageCount.current += 1;
    const interval = isSubscribed ? SUBSCRIBER_PAGE_INTERVAL : FREE_USER_PAGE_INTERVAL;

    if (pageCount.current % interval === 0 && preloaded) {
      AdMob.showInterstitial()
        .then(() => {
          preloaded = false;
          preloadInterstitial(); // পরের বারের জন্য আবার প্রিলোড
        })
        .catch(err => console.log('ইন্টারস্টিশিয়াল দেখাতে সমস্যা:', err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, isSubscribed, loading]);

  return null;
};
