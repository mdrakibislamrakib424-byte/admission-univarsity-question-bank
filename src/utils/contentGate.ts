// src/utils/contentGate.ts
//
// ফ্রি ইউজারদের জন্য সীমাবদ্ধতা এখান থেকেই নিয়ন্ত্রণ হয়:
// ১) গত ১০ বছরের আগের প্রশ্ন দেখা যাবে না
// ২) দিনে মাত্র ২টা প্রশ্ন প্র্যাকটিস করা যাবে
// ৩) কোনো Exam দেওয়া যাবে না (এটা ExamList/ExamTake পেজে সরাসরি চেক হয়)

import { Question } from '../types';

export const FREE_DAILY_PRACTICE_LIMIT = 2;
export const FREE_YEAR_WINDOW = 10; // শুধু গত ১০ বছরের প্রশ্ন দেখা যাবে

export function filterQuestionsForAccess(questions: Question[], isSubscribed: boolean): Question[] {
  if (isSubscribed) return questions;
  const cutoffYear = new Date().getFullYear() - FREE_YEAR_WINDOW;
  return questions.filter(q => q.year >= cutoffYear);
}

export function canPracticeMoreToday(isSubscribed: boolean, todayQuestionsDone: number): boolean {
  if (isSubscribed) return true;
  return todayQuestionsDone < FREE_DAILY_PRACTICE_LIMIT;
}

export function remainingFreePractice(todayQuestionsDone: number): number {
  return Math.max(0, FREE_DAILY_PRACTICE_LIMIT - todayQuestionsDone);
}
