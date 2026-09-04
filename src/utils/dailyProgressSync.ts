// src/utils/dailyProgressSync.ts
//
// আজকের কতগুলো প্রশ্ন করা হয়েছে (এবং কতগুলো সঠিক) — এই তথ্য তারিখসহ
// Supabase-এর daily_progress টেবিলে জমা রাখার জন্য।

import { supabase } from '../lib/supabase';
import { AttemptRecord } from '../types';

export function todayDateStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function syncTodayProgress(userId: string, attempts: AttemptRecord[]) {
  const today = todayDateStr();
  const todayAttempts = attempts.filter(a => new Date(a.timestamp).toISOString().slice(0, 10) === today);
  if (todayAttempts.length === 0) return;

  const questionsDone = todayAttempts.length;
  const correctDone = todayAttempts.filter(a => a.correct).length;

  const { error } = await supabase.from('daily_progress').upsert(
    {
      user_id: userId,
      progress_date: today,
      questions_done: questionsDone,
      correct_done: correctDone
    },
    { onConflict: 'user_id,progress_date' }
  );
  if (error) console.error('দৈনিক প্রোগ্রেস সিঙ্ক করতে সমস্যা:', error.message);
}

export async function fetchTodayProgress(userId: string): Promise<{ questionsDone: number; correctDone: number }> {
  const { data, error } = await supabase
    .from('daily_progress')
    .select('questions_done, correct_done')
    .eq('user_id', userId)
    .eq('progress_date', todayDateStr())
    .maybeSingle();
  if (error) {
    console.error('আজকের প্রোগ্রেস আনতে সমস্যা:', error.message);
    return { questionsDone: 0, correctDone: 0 };
  }
  return { questionsDone: data?.questions_done ?? 0, correctDone: data?.correct_done ?? 0 };
}

export interface DailyProgressRow {
  progress_date: string;
  questions_done: number;
  correct_done: number;
}

export async function fetchLast30DaysProgress(userId: string): Promise<DailyProgressRow[]> {
  const since = new Date();
  since.setDate(since.getDate() - 29);
  const { data, error } = await supabase
    .from('daily_progress')
    .select('progress_date, questions_done, correct_done')
    .eq('user_id', userId)
    .gte('progress_date', since.toISOString().slice(0, 10))
    .order('progress_date', { ascending: true });
  if (error) {
    console.error('দৈনিক প্রোগ্রেস আনতে সমস্যা:', error.message);
    return [];
  }
  return data || [];
}
