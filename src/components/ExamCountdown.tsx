import React from 'react';
import { Link } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';

export const ExamCountdown: React.FC = () => {
  const { userData } = useAppData();
  if (!userData.examDate) return null;

  const target = new Date(userData.examDate + 'T00:00:00');
  const now = new Date();
  const diffDays = Math.ceil((target.getTime() - now.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return null;

  return (
    <Link
      to="/more"
      className="flex items-center justify-between rounded-2xl border border-brick/30 bg-brick/10 p-4"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-brick-dark dark:text-brick">
          ভর্তি পরীক্ষার কাউন্টডাউন
        </p>
        <p className="mt-1 font-display text-lg text-ink-900 dark:text-ink-100">
          {diffDays === 0 ? 'পরীক্ষা আজই! 💪' : `আর ${diffDays} দিন বাকি`}
        </p>
      </div>
      <span className="text-3xl">⏳</span>
    </Link>
  );
};
