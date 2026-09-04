// src/components/UpgradeBanner.tsx
//
// ফ্রি লিমিট শেষ হলে পুরো পেজ ব্লক না করে উপরে এই সুন্দর ব্যানারটা
// দেখানো হয় — Duolingo/Spotify স্টাইলে, চাপ না দিয়ে আকর্ষণীয়ভাবে
// সাবস্ক্রাইব করতে উৎসাহ দেয়।

import React from 'react';
import { Link } from 'react-router-dom';

interface UpgradeBannerProps {
  title: string;
  subtitle?: string;
}

export const UpgradeBanner: React.FC<UpgradeBannerProps> = ({ title, subtitle }) => {
  return (
    <Link
      to="/subscription"
      className="group flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-amber via-amber to-amber-dark p-4 shadow-md shadow-amber/25 transition-transform active:scale-[0.98]"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink-950/10 text-2xl">
        👑
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink-950">{title}</p>
        {subtitle && <p className="truncate text-xs text-ink-950/70">{subtitle}</p>}
      </div>
      <span className="shrink-0 rounded-full bg-ink-950 px-3 py-1.5 text-xs font-semibold text-white transition-transform group-active:scale-95">
        আনলক করো
      </span>
    </Link>
  );
};
