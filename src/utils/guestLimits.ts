// src/utils/guestLimits.ts
//
// Login না করা (Guest) ইউজারের ব্যবহারের সীমা ফোনেই (localStorage)
// ট্র্যাক করা হয় — কারণ পরিচয় ছাড়া Supabase-এ ট্র্যাক করার উপায় নেই।
// সৎভাবে বলে রাখা ভালো: অ্যাপ আনইনস্টল করে আবার ইনস্টল করলে এই
// হিসাব রিসেট হয়ে যায় — এটা localStorage-ভিত্তিক যেকোনো সিস্টেমের
// স্বাভাবিক সীমাবদ্ধতা, পুরোপুরি ঠেকানোর উপায় Login ছাড়া নেই।

const KEY_EXAM_USED = 'guest_free_exam_used';
const KEY_SESSION_USED = 'guest_free_session_used';

export function hasUsedFreeExam(): boolean {
  return localStorage.getItem(KEY_EXAM_USED) === 'true';
}

export function markFreeExamUsed(): void {
  localStorage.setItem(KEY_EXAM_USED, 'true');
}

export function hasUsedFreeSession(): boolean {
  return localStorage.getItem(KEY_SESSION_USED) === 'true';
}

export function markFreeSessionUsed(): void {
  localStorage.setItem(KEY_SESSION_USED, 'true');
}
