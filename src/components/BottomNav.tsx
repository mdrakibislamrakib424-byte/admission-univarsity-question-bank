import React from 'react';
import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/', label: 'হোম', icon: '🏠' },
  { to: '/browse', label: 'ব্রাউজ', icon: '📚' },
  { to: '/mock-test', label: 'মক টেস্ট', icon: '🏆' },
  { to: '/dashboard', label: 'অগ্রগতি', icon: '📊' },
  { to: '/more', label: 'আরও', icon: '☰' }
];

export const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-ink-200 bg-white/95 backdrop-blur dark:border-ink-700/50 dark:bg-ink-900/95">
      <div className="mx-auto flex max-w-lg items-stretch justify-between px-1 pb-[env(safe-area-inset-bottom)]">
        {tabs.map(tab => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/'}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 py-2 text-xs transition-colors ${
                isActive ? 'text-amber-dark dark:text-amber' : 'text-ink-500'
              }`
            }
          >
            <span className="text-lg leading-none">{tab.icon}</span>
            <span>{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
