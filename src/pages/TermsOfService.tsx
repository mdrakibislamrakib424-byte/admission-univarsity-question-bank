// src/pages/TermsOfService.tsx
//
// ⚠️ নিচে [তোমার ইমেইল] বসিয়ে দাও।

import React from 'react';
import { Header } from '../components/Header';

export const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-paper pb-24 dark:bg-ink-900">
      <Header title="ব্যবহারের শর্তাবলি" showBack />
      <main className="mx-auto max-w-lg space-y-5 px-4 py-6 text-sm leading-relaxed text-ink-700 dark:text-ink-200">
        <section className="space-y-2">
          <h2 className="font-display text-base font-semibold text-ink-900 dark:text-ink-100">১. সাবস্ক্রিপশন ও পেমেন্ট</h2>
          <p>
            প্রিমিয়াম সাবস্ক্রিপশনের মূল্য ৳৮৫০, মেয়াদ ৬ মাস। bKash/Nagad এ পাঠানো পেমেন্ট ম্যানুয়ালি যাচাই করে
            অনুমোদন করা হয় — তাই অনুমোদন হতে সর্বোচ্চ ২৪ ঘণ্টা সময় লাগতে পারে। ভুল Transaction ID বা তথ্য দিলে
            আমরা সাবস্ক্রিপশন বাতিল করার অধিকার রাখি।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base font-semibold text-ink-900 dark:text-ink-100">২. রিফান্ড নীতি</h2>
          <p>একবার সাবস্ক্রিপশন অনুমোদিত হয়ে গেলে তা ফেরতযোগ্য নয়, কারণ অনুমোদনের সাথে সাথে সম্পূর্ণ কন্টেন্টে প্রবেশাধিকার দেওয়া হয়ে যায়।</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base font-semibold text-ink-900 dark:text-ink-100">৩. সঠিক ব্যবহার</h2>
          <p>একটা অ্যাকাউন্ট একজন ব্যবহারকারীর জন্য। ভুয়া Transaction ID বা প্রতারণামূলক তথ্য জমা দিলে অ্যাকাউন্ট স্থায়ীভাবে বন্ধ করে দেওয়া হতে পারে।</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base font-semibold text-ink-900 dark:text-ink-100">৪. কন্টেন্টের সঠিকতা</h2>
          <p>
            প্রশ্নব্যাংকের প্রশ্ন ও উত্তর যথাসাধ্য নির্ভুল রাখার চেষ্টা করা হয়, তবে মানুষের সংগ্রহ করা ডাটা হওয়ায় ছোটখাটো
            ভুল থাকতে পারে। কোনো ভুল চোখে পড়লে দয়া করে আমাদের জানাও।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base font-semibold text-ink-900 dark:text-ink-100">৫. যোগাযোগ</h2>
          <p>কোনো প্রশ্ন থাকলে যোগাযোগ করো: [তোমার ইমেইল]</p>
        </section>
      </main>
    </div>
  );
};
