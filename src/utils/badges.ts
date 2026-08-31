import { Badge, UserData } from '../types';

// Every badge definition + the condition that unlocks it.
// Keep conditions pure functions of (userData, stats) so they can be
// re-evaluated any time without needing extra tracking fields.
export const BADGES: (Badge & { condition: (u: UserData, accuracy: number) => boolean })[] = [
  {
    id: 'first_step',
    icon: '🐣',
    label: 'প্রথম পা',
    description: 'প্রথম প্রশ্নের উত্তর দিয়েছো',
    condition: u => u.attempts.length >= 1
  },
  {
    id: 'century',
    icon: '💯',
    label: 'সেঞ্চুরি',
    description: '১০০টি প্রশ্নের উত্তর দিয়েছো',
    condition: u => u.attempts.length >= 100
  },
  {
    id: 'thousand',
    icon: '🏅',
    label: 'হাজারী',
    description: '১০০০টি প্রশ্নের উত্তর দিয়েছো',
    condition: u => u.attempts.length >= 1000
  },
  {
    id: 'streak_3',
    icon: '🔥',
    label: '৩ দিনের আগুন',
    description: 'টানা ৩ দিন অ্যাপে পড়েছো',
    condition: u => u.streak.count >= 3
  },
  {
    id: 'streak_7',
    icon: '🔥🔥',
    label: '৭ দিনের streak',
    description: 'টানা ৭ দিন অ্যাপে পড়েছো',
    condition: u => u.streak.count >= 7
  },
  {
    id: 'streak_30',
    icon: '🔥🔥🔥',
    label: 'মাসব্যাপী নিয়মিত',
    description: 'টানা ৩০ দিন অ্যাপে পড়েছো',
    condition: u => u.streak.count >= 30
  },
  {
    id: 'sharp_shooter',
    icon: '🎯',
    label: 'শার্প শুটার',
    description: 'অন্তত ৩০টি প্রশ্নে ৯০%+ Accuracy',
    condition: (u, accuracy) => u.attempts.length >= 30 && accuracy >= 90
  },
  {
    id: 'bookworm',
    icon: '🔖',
    label: 'বইপোকা',
    description: '২৫টি প্রশ্ন সেভ করেছো',
    condition: u => u.bookmarks.length >= 25
  },
  {
    id: 'memorizer',
    icon: '🧠',
    label: 'মুখস্থবিদ',
    description: '৩০টি প্রশ্ন মুখস্থ তালিকায় যোগ করেছো',
    condition: u => u.spacedRevision.length >= 30
  },
  {
    id: 'mastered_10',
    icon: '🌟',
    label: 'পাকা মুখস্থ',
    description: '১০টি প্রশ্ন সম্পূর্ণ মুখস্থ (stage মাস্টার্ড) করেছো',
    condition: u => u.spacedRevision.filter(r => r.stage >= 4).length >= 10
  },
  {
    id: 'mock_starter',
    icon: '📝',
    label: 'মক টেস্ট রুকি',
    description: 'প্রথম মক টেস্ট শেষ করেছো',
    condition: u => u.mockTestResults.length >= 1
  },
  {
    id: 'mock_master',
    icon: '🏆',
    label: 'মক টেস্ট মাস্টার',
    description: '৫টি মক টেস্ট সম্পূর্ণ করেছো',
    condition: u => u.mockTestResults.length >= 5
  },
  {
    id: 'perfect_score',
    icon: '👑',
    label: 'পারফেক্ট স্কোর',
    description: 'কোনো একটি মক টেস্টে ফুল মার্কস পেয়েছো',
    condition: u => u.mockTestResults.some(r => r.maxScore > 0 && r.score >= r.maxScore)
  },
  {
    id: 'no_mistakes_left',
    icon: '✅',
    label: 'ক্লিন শিট',
    description: 'কমপক্ষে ১০টি প্রশ্ন করার পরেও তোমার ভুলের তালিকা খালি',
    condition: u => u.attempts.length >= 10 && u.mistakes.length === 0
  },
  {
    id: 'contributor',
    icon: '🤝',
    label: 'কন্ট্রিবিউটর',
    description: 'কমিউনিটিতে অন্তত ১টি প্রশ্ন জমা দিয়েছো',
    condition: u => u.communitySubmissions.length >= 1
  }
];

export function getEarnedBadgeIds(userData: UserData, accuracy: number): string[] {
  return BADGES.filter(b => b.condition(userData, accuracy)).map(b => b.id);
}

export function getBadgeById(id: string): Badge | undefined {
  return BADGES.find(b => b.id === id);
}
