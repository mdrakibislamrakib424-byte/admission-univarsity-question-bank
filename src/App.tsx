import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { BottomNav } from './components/BottomNav';
import { BadgeToast } from './components/BadgeToast';
import { ScoreSync } from './components/ScoreSync';
import { PushInit } from './components/PushInit';
import { DailyProgressAutoSync } from './components/DailyProgressAutoSync';
import { AdMobInit } from './components/AdMobInit';
import { InterstitialAdManager } from './components/InterstitialAdManager';
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
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { BanglaSection } from './pages/BanglaSection';
import { EnglishSection } from './pages/EnglishSection';
import { AdminExam } from './pages/AdminExam';
import { ExamList } from './pages/ExamList';
import { ExamTake } from './pages/ExamTake';
import { ExamResults } from './pages/ExamResults';
import { DailyLesson } from './pages/DailyLesson';
import { Subscription } from './pages/Subscription';
import { AdminSubscriptions } from './pages/AdminSubscriptions';

export default function App() {
  return (
    <div className="min-h-screen bg-paper text-ink-900 dark:bg-ink-900 dark:text-ink-100">
      <AdMobInit />
      <InterstitialAdManager />
      <ScoreSync />
      <PushInit />
      <DailyProgressAutoSync />
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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/bangla" element={<BanglaSection />} />
        <Route path="/english" element={<EnglishSection />} />
        <Route path="/admin-exam" element={<AdminExam />} />
        <Route path="/exam-list" element={<ExamList />} />
        <Route path="/exam/:examId" element={<ExamTake />} />
        <Route path="/exam-results" element={<ExamResults />} />
        <Route path="/daily" element={<DailyLesson />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/admin-subscriptions" element={<AdminSubscriptions />} />
      </Routes>
      <BottomNav />
    </div>
  );
}
