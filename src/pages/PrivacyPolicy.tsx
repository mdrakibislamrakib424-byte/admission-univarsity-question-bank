// src/pages/PrivacyPolicy.tsx
//
// ⚠️ নিচে [তোমার ইমেইল] এবং [শেষ আপডেটের তারিখ] বসিয়ে দাও।
// AdMob ব্যবহার করলে এই পেজ থাকা বাধ্যতামূলক।

import React from 'react';
import { Header } from '../components/Header';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-paper pb-24 dark:bg-ink-900">
      <Header title="গোপনীয়তা নীতি" showBack />
      <main className="mx-auto max-w-lg space-y-5 px-4 py-6 text-sm leading-relaxed text-ink-700 dark:text-ink-200">
        <p className="text-xs text-ink-400">সর্বশেষ আপডেট: [শেষ আপডেটের তারিখ]</p>

        <section className="space-y-2">
          <h2 className="font-display text-base font-semibold text-ink-900 dark:text-ink-100">১. আমরা কী তথ্য সংগ্রহ করি</h2>
          <p>
            অ্যাকাউন্ট তৈরি করলে আমরা তোমার নাম ও ইমেইল সংরক্ষণ করি। প্র্যাকটিস ও এক্সামের ফলাফল, দৈনিক প্রোগ্রেস, এবং
            সাবস্ক্রিপশন পেমেন্টের তথ্য (ফোন নাম্বার, Transaction ID) আমাদের ডাটাবেসে (Supabase) নিরাপদে সংরক্ষণ করা হয়।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base font-semibold text-ink-900 dark:text-ink-100">২. বিজ্ঞাপন</h2>
          <p>
            এই অ্যাপ Google AdMob ব্যবহার করে বিজ্ঞাপন দেখায়। AdMob তোমার ডিভাইসের একটা বিজ্ঞাপন-আইডি ব্যবহার করে
            প্রাসঙ্গিক বিজ্ঞাপন দেখাতে পারে। বিস্তারিত জানতে Google-এর নিজস্ব Privacy Policy দেখো:{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="text-amber-dark underline dark:text-amber">
              policies.google.com/privacy
            </a>
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base font-semibold text-ink-900 dark:text-ink-100">৩. পুশ নোটিফিকেশন</h2>
          <p>
            আমরা তোমার ডিভাইসের একটা নোটিফিকেশন-টোকেন সংরক্ষণ করি যাতে দৈনিক পড়ার রিমাইন্ডার পাঠানো যায়। চাইলে
            More → সেটিংস থেকে যেকোনো সময় এই নোটিফিকেশন বন্ধ করা যাবে।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base font-semibold text-ink-900 dark:text-ink-100">৪. তথ্য কার সাথে শেয়ার করি</h2>
          <p>আমরা তোমার ব্যক্তিগত তথ্য কোনো তৃতীয় পক্ষের কাছে বিক্রি করি না। শুধু Supabase (ডাটাবেস) ও Google AdMob/Firebase (বিজ্ঞাপন ও নোটিফিকেশন) এই দুইটা সেবার সাথে প্রয়োজনীয় তথ্য শেয়ার হয়।</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base font-semibold text-ink-900 dark:text-ink-100">৫. অ্যাকাউন্ট ও তথ্য মুছে ফেলা</h2>
          <p>
            তোমার অ্যাকাউন্ট ও সংশ্লিষ্ট সব তথ্য মুছে ফেলতে চাইলে আমাদের ইমেইল করো: [তোমার ইমেইল]
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base font-semibold text-ink-900 dark:text-ink-100">৬. যোগাযোগ</h2>
          <p>কোনো প্রশ্ন থাকলে যোগাযোগ করো: [তোমার ইমেইল]</p>
        </section>
      </main>
    </div>
  );
};
