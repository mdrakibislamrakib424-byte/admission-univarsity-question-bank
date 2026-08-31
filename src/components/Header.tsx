import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';

export const Header: React.FC<{ title: string; showBack?: boolean }> = ({ title, showBack }) => {
  const { userData } = useAppData();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 border-b border-ink-200 bg-paper/95 backdrop-blur dark:border-ink-700/50 dark:bg-ink-900/95">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          {showBack && (
            <button onClick={() => navigate(-1)} className="text-lg text-ink-500" aria-label="ফিরে যাও">
              ←
            </button>
          )}
          <h1 className="font-display text-lg font-medium text-ink-900 dark:text-ink-100">{title}</h1>
        </div>
        {userData.streak.count > 0 && (
          <span className="flex items-center gap-1 rounded-full bg-amber/15 px-2.5 py-1 text-xs font-semibold text-amber-dark dark:text-amber">
            🔥 {userData.streak.count} দিন
          </span>
        )}
      </div>
    </header>
  );
};
