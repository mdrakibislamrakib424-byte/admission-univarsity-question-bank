// src/components/AdMobInit.tsx
import { useEffect } from 'react';
import { AdMob } from '@capacitor-community/admob';

export const AdMobInit: React.FC = () => {
  useEffect(() => {
    AdMob.initialize({
      initializeForTesting: false // ⚠️ টেস্ট করার সময় true করে দিও, রিলিজ করার আগে false-এ ফিরিয়ে নিও
    }).catch(err => console.log('AdMob initialize করতে সমস্যা:', err));
  }, []);
  return null;
};
