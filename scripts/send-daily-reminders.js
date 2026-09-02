// scripts/send-daily-reminders.js
//
// এই স্ক্রিপ্টটা app-এর অংশ না — এটা GitHub Actions রোজ একবার চালাবে
// (server ছাড়াই "সার্ভার-সাইড" কাজ করার কৌশল)। যারা আজ এখনো পড়েনি
// তাদের ফোনে Firebase দিয়ে reminder notification পাঠায়।

import { createClient } from '@supabase/supabase-js';
import admin from 'firebase-admin';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const FIREBASE_SERVICE_ACCOUNT = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !FIREBASE_SERVICE_ACCOUNT) {
  console.error('প্রয়োজনীয় environment variable/secret পাওয়া যায়নি। GitHub Secrets চেক করুন।');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(FIREBASE_SERVICE_ACCOUNT))
});

async function main() {
  const { data: rows, error } = await supabase.from('inactive_users_today').select('fcm_token');
  if (error) {
    console.error('Supabase থেকে ডাটা আনতে সমস্যা:', error.message);
    process.exit(1);
  }
  if (!rows || rows.length === 0) {
    console.log('আজ রিমাইন্ডার পাঠানোর মতো কেউ নেই (সবাই হয় পড়ে ফেলেছে, নয়তো token নেই)।');
    return;
  }

  const tokens = rows.map(r => r.fcm_token);
  const message = {
    notification: {
      title: '📚 আজকের পড়া বাকি আছে!',
      body: 'তোমার প্রশ্নব্যাংক প্র্যাকটিস আজ এখনো শুরু করোনি। এখনই কয়েকটা প্রশ্ন করে ফেলো!'
    },
    tokens
  };

  const response = await admin.messaging().sendEachForMulticast(message);
  console.log(`পাঠানো হয়েছে: ${response.successCount}টি, ব্যর্থ: ${response.failureCount}টি`);
}

main().catch(err => {
  console.error('স্ক্রিপ্ট চালাতে সমস্যা:', err);
  process.exit(1);
});
