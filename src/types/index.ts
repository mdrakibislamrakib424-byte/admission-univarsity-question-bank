// ---------- Core question schema ----------
// This is the exact shape every question in src/data/questions.json must follow.
// This is also the shape the Admin > Import page expects when you paste
// AI-structured JSON from your OCR pipeline.

export interface Question {
  id: string;                 // unique id, e.g. "du-2023-bangla-001"
  university: string;         // "DU" | "RU" | "CU" | "JU" | "JnU" | "KU" | "SUST" | "GST" | ...
  unit?: string;               // "A" | "B" | "C" | ... (optional, some unis don't use units)
  year: number;                // 2010–2026
  subject: string;             // "বাংলা" | "English" | "সাধারণ জ্ঞান" | "পদার্থবিজ্ঞান" ইত্যাদি
  chapter: string;             // "ব্যাকরণ" | "Vocabulary" | "সন্ধি" ইত্যাদি
  question: string;            // question text (Bangla or English)
  options: [string, string, string, string];
  answerIndex: 0 | 1 | 2 | 3;  // index of the correct option
  explanation: {
    correct: string;           // why the correct answer is right
    wrong: [string, string, string]; // why the other 3 (in option order, excluding correct) are wrong
  };
  timesAsked?: number;         // how many times this exact question appeared historically (for 🔥⭐🔵 tags)
  tags?: string[];             // free-form extra tags for search
  language?: 'bn' | 'en';
}

export type FrequencyTag = 'hot' | 'important' | 'seen' | 'none';

export function frequencyTag(timesAsked: number | undefined): FrequencyTag {
  if (!timesAsked) return 'none';
  if (timesAsked >= 7) return 'hot';
  if (timesAsked >= 4) return 'important';
  if (timesAsked >= 2) return 'seen';
  return 'none';
}

// ---------- User progress data (stored in localStorage) ----------

export interface AttemptRecord {
  questionId: string;
  correct: boolean;
  timestamp: number; // epoch ms
}

export interface SpacedRevisionItem {
  questionId: string;
  addedAt: number;
  nextReviewAt: number;
  stage: number; // 0 = today, 1 = +1d, 2 = +3d, 3 = +7d, 4 = +14d, 5 = mastered
}

export interface UserData {
  attempts: AttemptRecord[];
  bookmarks: string[];
  mistakes: string[]; // question ids currently marked as "not yet corrected"
  spacedRevision: SpacedRevisionItem[];
  streak: {
    count: number;
    lastActiveDate: string; // YYYY-MM-DD
  };
  darkMode: boolean;
  dailyChallenge: {
    date: string; // YYYY-MM-DD
    questionIds: string[];
    completed: boolean;
  } | null;
  // ---- newly added ----
  mockTestResults: MockTestResult[];
  earnedBadges: string[]; // badge ids, in the order they were earned
  examDate: string | null; // ISO date string, target admission exam date
  notifications: {
    enabled: boolean;
    time: string; // "HH:MM" 24-hour, local reminder time
    lastShownDate: string; // YYYY-MM-DD, to avoid repeating same day
  };
  aiApiKey: string; // user's own Anthropic API key, stored only on this device
  aiModel: string; // model id used for the AI Doubt Solver
  leaderboardName: string; // display name used when generating a share code
  leaderboardFriends: LeaderboardEntry[]; // scores imported from friends' share codes
  communitySubmissions: CommunitySubmission[];
}

export const emptyUserData: UserData = {
  attempts: [],
  bookmarks: [],
  mistakes: [],
  spacedRevision: [],
  streak: { count: 0, lastActiveDate: '' },
  darkMode: true,
  dailyChallenge: null,
  mockTestResults: [],
  earnedBadges: [],
  examDate: null,
  notifications: { enabled: false, time: '20:00', lastShownDate: '' },
  aiApiKey: '',
  aiModel: 'claude-sonnet-5',
  leaderboardName: '',
  leaderboardFriends: [],
  communitySubmissions: []
};

// ---------- Badges / gamification ----------

export interface Badge {
  id: string;
  icon: string;
  label: string;
  description: string;
}

// ---------- Leaderboard ----------

export interface LeaderboardEntry {
  name: string;
  bestScorePercent: number; // best mock-test score as % of max
  totalAttempts: number;
  streak: number;
  addedAt: number;
}

// ---------- Community question submission ----------

export interface CommunitySubmission {
  id: string;
  university: string;
  subject: string;
  chapter: string;
  question: string;
  options: [string, string, string, string];
  answerIndex: 0 | 1 | 2 | 3;
  note?: string;
  submittedAt: number;
  status: 'draft' | 'sent';
}

// ---------- Mock test ----------

export interface MockTestConfig {
  title: string;
  university?: string;
  questionCount: number;
  durationMinutes: number;
  negativeMarking: number; // e.g. 0.25 means -0.25 per wrong answer
}

export interface MockTestResult {
  id: string;
  title: string;
  date: number;
  totalQuestions: number;
  correct: number;
  wrong: number;
  skipped: number;
  score: number;
  maxScore: number;
  timeTakenSeconds: number;
}

