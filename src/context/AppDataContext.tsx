import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { UserData, AttemptRecord, SpacedRevisionItem, MockTestResult, LeaderboardEntry, CommunitySubmission, Badge } from '../types';
import { loadUserData, saveUserData, todayStr, daysBetween } from '../utils/storage';
import questionsData from '../data/questions.json';
import { Question } from '../types';
import { getEarnedBadgeIds, getBadgeById } from '../utils/badges';
import { maybeFireDailyReminder } from '../utils/notifications';

const REVISION_STAGE_DAYS = [0, 1, 3, 7, 14]; // stage index -> days until next review

interface AppDataContextType {
  userData: UserData;
  questions: Question[];
  recordAttempt: (questionId: string, correct: boolean) => void;
  toggleBookmark: (questionId: string) => void;
  isBookmarked: (questionId: string) => boolean;
  clearMistake: (questionId: string) => void;
  addToRevision: (questionId: string) => void;
  reviewRevisionItem: (questionId: string, remembered: boolean) => void;
  dueRevisionItems: SpacedRevisionItem[];
  toggleDarkMode: () => void;
  resetAllData: () => void;
  stats: {
    totalAttempts: number;
    totalCorrect: number;
    accuracy: number;
    todayAttempts: number;
    todayCorrect: number;
  };
  weakTopics: { subject: string; accuracy: number; attempts: number }[];
  // ---- newly added ----
  addMockTestResult: (result: MockTestResult) => void;
  newlyEarnedBadges: Badge[];
  earnedBadges: Badge[];
  setExamDate: (date: string | null) => void;
  setNotificationSettings: (enabled: boolean, time: string) => void;
  markReminderShown: () => void;
  setAiSettings: (apiKey: string, model: string) => void;
  setLeaderboardName: (name: string) => void;
  addLeaderboardFriend: (entry: LeaderboardEntry) => void;
  removeLeaderboardFriend: (name: string) => void;
  addCommunitySubmission: (sub: Omit<CommunitySubmission, 'id' | 'submittedAt' | 'status'>) => void;
  removeCommunitySubmission: (id: string) => void;
}

const AppDataContext = createContext<AppDataContextType | null>(null);

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>(() => loadUserData());
  const questions = questionsData as Question[];

  useEffect(() => {
    saveUserData(userData);
  }, [userData]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', userData.darkMode);
  }, [userData.darkMode]);

  const bumpStreak = useCallback((data: UserData): UserData => {
    const today = todayStr();
    if (data.streak.lastActiveDate === today) return data;
    const diff = data.streak.lastActiveDate ? daysBetween(data.streak.lastActiveDate, today) : 999;
    const newCount = diff === 1 ? data.streak.count + 1 : 1;
    return { ...data, streak: { count: newCount, lastActiveDate: today } };
  }, []);

  const recordAttempt = useCallback((questionId: string, correct: boolean) => {
    setUserData(prev => {
      const attempt: AttemptRecord = { questionId, correct, timestamp: Date.now() };
      let mistakes = prev.mistakes;
      if (correct) {
        mistakes = mistakes.filter(id => id !== questionId);
      } else if (!mistakes.includes(questionId)) {
        mistakes = [...mistakes, questionId];
      }
      const next = bumpStreak({
        ...prev,
        attempts: [...prev.attempts, attempt],
        mistakes
      });
      return next;
    });
  }, [bumpStreak]);

  const toggleBookmark = useCallback((questionId: string) => {
    setUserData(prev => {
      const has = prev.bookmarks.includes(questionId);
      return {
        ...prev,
        bookmarks: has ? prev.bookmarks.filter(id => id !== questionId) : [...prev.bookmarks, questionId]
      };
    });
  }, []);

  const isBookmarked = useCallback((questionId: string) => userData.bookmarks.includes(questionId), [userData.bookmarks]);

  const clearMistake = useCallback((questionId: string) => {
    setUserData(prev => ({ ...prev, mistakes: prev.mistakes.filter(id => id !== questionId) }));
  }, []);

  const addToRevision = useCallback((questionId: string) => {
    setUserData(prev => {
      if (prev.spacedRevision.some(r => r.questionId === questionId)) return prev;
      const item: SpacedRevisionItem = {
        questionId,
        addedAt: Date.now(),
        nextReviewAt: Date.now(),
        stage: 0
      };
      return { ...prev, spacedRevision: [...prev.spacedRevision, item] };
    });
  }, []);

  const reviewRevisionItem = useCallback((questionId: string, remembered: boolean) => {
    setUserData(prev => ({
      ...prev,
      spacedRevision: prev.spacedRevision.map(item => {
        if (item.questionId !== questionId) return item;
        const nextStage = remembered ? Math.min(item.stage + 1, REVISION_STAGE_DAYS.length - 1) : 0;
        const daysAhead = REVISION_STAGE_DAYS[nextStage];
        return {
          ...item,
          stage: nextStage,
          nextReviewAt: Date.now() + daysAhead * 24 * 60 * 60 * 1000
        };
      })
    }));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setUserData(prev => ({ ...prev, darkMode: !prev.darkMode }));
  }, []);

  const resetAllData = useCallback(() => {
    if (confirm('তোমার সব progress, bookmark, mistake মুছে যাবে। নিশ্চিত?')) {
      setUserData(loadUserData()); // will reset since storage cleared below
      localStorage.removeItem('admission-app-userdata-v1');
      window.location.reload();
    }
  }, []);

  const dueRevisionItems = useMemo(
    () => userData.spacedRevision.filter(item => item.nextReviewAt <= Date.now()),
    [userData.spacedRevision]
  );

  const stats = useMemo(() => {
    const totalAttempts = userData.attempts.length;
    const totalCorrect = userData.attempts.filter(a => a.correct).length;
    const today = todayStr();
    const todayAttemptsArr = userData.attempts.filter(a => new Date(a.timestamp).toISOString().slice(0, 10) === today);
    return {
      totalAttempts,
      totalCorrect,
      accuracy: totalAttempts ? Math.round((totalCorrect / totalAttempts) * 100) : 0,
      todayAttempts: todayAttemptsArr.length,
      todayCorrect: todayAttemptsArr.filter(a => a.correct).length
    };
  }, [userData.attempts]);

  // ---- Mock test results (feeds badges + leaderboard) ----
  const addMockTestResult = useCallback((result: MockTestResult) => {
    setUserData(prev => ({ ...prev, mockTestResults: [...prev.mockTestResults, result] }));
  }, []);

  // ---- Badges ----
  const previousEarnedRef = React.useRef<string[]>(userData.earnedBadges);
  const [newlyEarnedIds, setNewlyEarnedIds] = useState<string[]>([]);

  useEffect(() => {
    const accuracy = userData.attempts.length
      ? Math.round((userData.attempts.filter(a => a.correct).length / userData.attempts.length) * 100)
      : 0;
    const earnedNow = getEarnedBadgeIds(userData, accuracy);
    const previous = previousEarnedRef.current;
    const freshlyUnlocked = earnedNow.filter(id => !previous.includes(id));
    if (freshlyUnlocked.length > 0) {
      setNewlyEarnedIds(freshlyUnlocked);
      setUserData(prev => ({ ...prev, earnedBadges: Array.from(new Set([...prev.earnedBadges, ...earnedNow])) }));
    }
    previousEarnedRef.current = earnedNow;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData.attempts.length, userData.streak.count, userData.bookmarks.length, userData.spacedRevision.length, userData.mockTestResults.length, userData.mistakes.length, userData.communitySubmissions.length]);

  const earnedBadges = useMemo(
    () => userData.earnedBadges.map(id => getBadgeById(id)).filter((b): b is Badge => !!b),
    [userData.earnedBadges]
  );
  const newlyEarnedBadges = useMemo(
    () => newlyEarnedIds.map(id => getBadgeById(id)).filter((b): b is Badge => !!b),
    [newlyEarnedIds]
  );

  // ---- Exam countdown ----
  const setExamDate = useCallback((date: string | null) => {
    setUserData(prev => ({ ...prev, examDate: date }));
  }, []);

  // ---- Notifications ----
  const setNotificationSettings = useCallback((enabled: boolean, time: string) => {
    setUserData(prev => ({ ...prev, notifications: { ...prev.notifications, enabled, time } }));
  }, []);
  const markReminderShown = useCallback(() => {
    setUserData(prev => ({ ...prev, notifications: { ...prev.notifications, lastShownDate: todayStr() } }));
  }, []);

  useEffect(() => {
    const fired = maybeFireDailyReminder(
      userData.notifications.enabled,
      userData.notifications.time,
      userData.notifications.lastShownDate
    );
    if (fired) markReminderShown();
    const interval = setInterval(() => {
      const f = maybeFireDailyReminder(
        userData.notifications.enabled,
        userData.notifications.time,
        userData.notifications.lastShownDate
      );
      if (f) markReminderShown();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData.notifications.enabled, userData.notifications.time, userData.notifications.lastShownDate]);

  // ---- AI Doubt Solver settings ----
  const setAiSettings = useCallback((apiKey: string, model: string) => {
    setUserData(prev => ({ ...prev, aiApiKey: apiKey, aiModel: model || prev.aiModel }));
  }, []);

  // ---- Leaderboard ----
  const setLeaderboardName = useCallback((name: string) => {
    setUserData(prev => ({ ...prev, leaderboardName: name }));
  }, []);
  const addLeaderboardFriend = useCallback((entry: LeaderboardEntry) => {
    setUserData(prev => ({
      ...prev,
      leaderboardFriends: [...prev.leaderboardFriends.filter(f => f.name !== entry.name), entry]
    }));
  }, []);
  const removeLeaderboardFriend = useCallback((name: string) => {
    setUserData(prev => ({ ...prev, leaderboardFriends: prev.leaderboardFriends.filter(f => f.name !== name) }));
  }, []);

  // ---- Community submissions ----
  const addCommunitySubmission = useCallback((sub: Omit<CommunitySubmission, 'id' | 'submittedAt' | 'status'>) => {
    setUserData(prev => ({
      ...prev,
      communitySubmissions: [
        ...prev.communitySubmissions,
        { ...sub, id: `sub-${Date.now()}`, submittedAt: Date.now(), status: 'draft' }
      ]
    }));
  }, []);
  const removeCommunitySubmission = useCallback((id: string) => {
    setUserData(prev => ({ ...prev, communitySubmissions: prev.communitySubmissions.filter(s => s.id !== id) }));
  }, []);

  const weakTopics = useMemo(() => {
    const bySubject: Record<string, { correct: number; total: number }> = {};
    for (const attempt of userData.attempts) {
      const q = questions.find(q => q.id === attempt.questionId);
      if (!q) continue;
      const key = q.subject;
      if (!bySubject[key]) bySubject[key] = { correct: 0, total: 0 };
      bySubject[key].total += 1;
      if (attempt.correct) bySubject[key].correct += 1;
    }
    return Object.entries(bySubject)
      .map(([subject, v]) => ({ subject, accuracy: Math.round((v.correct / v.total) * 100), attempts: v.total }))
      .sort((a, b) => a.accuracy - b.accuracy);
  }, [userData.attempts, questions]);

  const value: AppDataContextType = {
    userData,
    questions,
    recordAttempt,
    toggleBookmark,
    isBookmarked,
    clearMistake,
    addToRevision,
    reviewRevisionItem,
    dueRevisionItems,
    toggleDarkMode,
    resetAllData,
    stats,
    weakTopics,
    addMockTestResult,
    newlyEarnedBadges,
    earnedBadges,
    setExamDate,
    setNotificationSettings,
    markReminderShown,
    setAiSettings,
    setLeaderboardName,
    addLeaderboardFriend,
    removeLeaderboardFriend,
    addCommunitySubmission,
    removeCommunitySubmission
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
};

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
