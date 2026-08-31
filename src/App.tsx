import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { BottomNav } from './components/BottomNav';
import { BadgeToast } from './components/BadgeToast';
import { Home } from './pages/Home';
import { Browse } from './pages/Browse';
import { Practice } from './pages/Practice';
import { MockTest } from './pages/MockTest';
import { Dashboard } from './pages/Dashboard';
import { Mistakes } from './pages/Mistakes';
import { Bookmarks } from './pages/Bookmarks';
import { Search } from './pages/Search';
import { Memorization } from './pages/Memorization';
import { More } from './pages/More';
import { Admin } from './pages/Admin';
import { AIHelp } from './pages/AIHelp';
import { Predictions } from './pages/Predictions';
import { Leaderboard } from './pages/Leaderboard';
import { Community } from './pages/Community';
import { Badges } from './pages/Badges';

export default function App() {
  return (
    <div className="min-h-screen bg-paper text-ink-900 dark:bg-ink-900 dark:text-ink-100">
      <BadgeToast />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/mock-test" element={<MockTest />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mistakes" element={<Mistakes />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/search" element={<Search />} />
        <Route path="/memorization" element={<Memorization />} />
        <Route path="/more" element={<More />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/ai-help" element={<AIHelp />} />
        <Route path="/predictions" element={<Predictions />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/community" element={<Community />} />
        <Route path="/badges" element={<Badges />} />
      </Routes>
      <BottomNav />
    </div>
  );
}

