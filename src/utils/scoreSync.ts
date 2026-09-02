// src/utils/scoreSync.ts
//
// লোকাল প্রোগ্রেস (attempts, streak) Supabase-এ পাঠানোর জন্য।
// Leaderboard-এ দেখানোর মূল ডাটা এখান থেকেই যায়।

import { supabase } from '../lib/supabase';

export async function syncScoreToSupabase(
  userId: string,
  totalAttempts: number,
  totalCorrect: number,
  bestStreak: number
) {
  const { error } = await supabase
    .from('scores')
    .upsert(
      {
        user_id: userId,
        total_attempts: totalAttempts,
        total_correct: totalCorrect,
        best_streak: bestStreak,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'user_id' }
    );
  if (error) console.error('স্কোর সিঙ্ক করতে সমস্যা:', error.message);
}

export interface LeaderboardRow {
  user_id: string;
  total_attempts: number;
  total_correct: number;
  best_streak: number;
  display_name: string;
}

export async function fetchLeaderboard(limit = 20): Promise<LeaderboardRow[]> {
  const { data: scores, error } = await supabase
    .from('scores')
    .select('user_id, total_attempts, total_correct, best_streak')
    .order('total_correct', { ascending: false })
    .limit(limit);
  if (error || !scores) {
    console.error('লিডারবোর্ড আনতে সমস্যা:', error?.message);
    return [];
  }
  const userIds = scores.map(s => s.user_id);
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, display_name')
    .in('id', userIds);
  const nameMap = new Map((profiles || []).map(p => [p.id, p.display_name]));
  return scores.map(s => ({ ...s, display_name: nameMap.get(s.user_id) || 'অজানা' }));
}
