// src/utils/contentGate.ts
//
// অ্যাক্সেসের নিয়ম এখন দুই স্তরে:
//
// ১) Subscriber (৳৮৫০ / ৬ মাস) → সব কিছু আনলিমিটেড
// ২) সবাই বাকি (Login করা থাকুক বা না থাকুক, সাবস্ক্রাইব না করলে) →
//    - সারাজীবনে ১টা ফ্রি Exam
//    - সারাজীবনে ১টা ফ্রি Practice সেশন
//    - প্রতিটা বিষয়ে (বাংলা/English) শুধু ১টা টপিক খোলা থাকে
//    - গত ১০ বছরের বেশি পুরনো প্রশ্ন দেখা যায় না

import { Question } from '../types';

export const FREE_YEAR_WINDOW = 10;
export const FREE_TOPICS_PER_SUBJECT = 1;

export function filterQuestionsForAccess(questions: Question[], isSubscribed: boolean): Question[] {
  if (isSubscribed) return questions;
  const cutoffYear = new Date().getFullYear() - FREE_YEAR_WINDOW;
  return questions.filter(q => q.year >= cutoffYear);
}

export function getUnlockedTopics(allTopics: string[], isSubscribed: boolean): string[] {
  if (isSubscribed) return allTopics;
  return allTopics.slice(0, FREE_TOPICS_PER_SUBJECT);
}

export function isTopicLocked(topic: string, allTopics: string[], isSubscribed: boolean): boolean {
  if (isSubscribed) return false;
  return !getUnlockedTopics(allTopics, isSubscribed).includes(topic);
}
