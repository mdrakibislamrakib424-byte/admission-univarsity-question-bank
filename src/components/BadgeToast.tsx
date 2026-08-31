import React, { useEffect, useState } from 'react';
import { useAppData } from '../context/AppDataContext';

export const BadgeToast: React.FC = () => {
  const { newlyEarnedBadges } = useAppData();
  const [visible, setVisible] = useState<typeof newlyEarnedBadges>([]);

  useEffect(() => {
    if (newlyEarnedBadges.length === 0) return;
    setVisible(newlyEarnedBadges);
    const t = setTimeout(() => setVisible([]), 4000);
    return () => clearTimeout(t);
  }, [newlyEarnedBadges]);

  if (visible.length === 0) return null;

  return (
    <div className="pointer-events-none fixed left-0 right-0 top-3 z-50 flex flex-col items-center gap-2 px-4">
      {visible.map(b => (
        <div
          key={b.id}
          className="pointer-events-auto flex items-center gap-2 rounded-full bg-ink-900 px-4 py-2 text-sm text-white shadow-lg dark:bg-amber dark:text-ink-950"
        >
          <span className="text-lg">{b.icon}</span>
          <span>নতুন ব্যাজ: {b.label}!</span>
        </div>
      ))}
    </div>
  );
};

