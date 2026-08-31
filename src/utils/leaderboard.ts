import { LeaderboardEntry, MockTestResult } from '../types';

// Honest limitation: this app has no server, so there is no single live
// leaderboard everyone shares automatically. Instead, each user generates a
// small "share code" summarizing their own best score, sends it to a friend
// (WhatsApp/Messenger/etc.), and the friend pastes it in to add them to a
// local comparison table. It's manual, but needs zero backend.

export function bestScorePercent(results: MockTestResult[]): number {
  if (results.length === 0) return 0;
  const best = results.reduce((max, r) => (r.maxScore > 0 && r.score / r.maxScore > max ? r.score / r.maxScore : max), 0);
  return Math.round(best * 100);
}

export function encodeShareCode(entry: LeaderboardEntry): string {
  const json = JSON.stringify(entry);
  return btoa(unescape(encodeURIComponent(json)));
}

export function decodeShareCode(code: string): LeaderboardEntry | null {
  try {
    const json = decodeURIComponent(escape(atob(code.trim())));
    const parsed = JSON.parse(json);
    if (typeof parsed.name === 'string' && typeof parsed.bestScorePercent === 'number') {
      return parsed as LeaderboardEntry;
    }
    return null;
  } catch {
    return null;
  }
}
