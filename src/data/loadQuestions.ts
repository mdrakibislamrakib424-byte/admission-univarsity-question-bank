// src/data/loadQuestions.ts
//
// এখানে src/data/questions/ ফোল্ডারের ভেতরে যত .json ফাইল থাকবে
// (du.json, ru.json, cu.json, ...) — সবগুলো Vite এর "glob import"
// ফিচার দিয়ে নিজে থেকেই খুঁজে নিয়ে একটা বড় array এ জোড়া লাগিয়ে দেয়।
//
// গুরুত্বপূর্ণ: নতুন বিশ্ববিদ্যালয়ের জন্য নতুন ফাইল (যেমন ju.json)
// এই ফোল্ডারে বসিয়ে দিলেই যথেষ্ট — এই ফাইলে কোনো পরিবর্তন করতে হবে না।

import { Question } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const modules = import.meta.glob('./questions/*.json', { eager: true }) as Record<string, { default: Question[] }>;

function mergeAllQuestionFiles(): Question[] {
  const all: Question[] = [];
  const seenIds = new Set<string>();

  for (const path in modules) {
    const fileName = path.split('/').pop() || path;
    const arr = modules[path].default;
    if (!Array.isArray(arr)) {
      console.warn(`⚠️ ${fileName} — এই ফাইলে একটা array থাকার কথা, কিন্তু নেই। এই ফাইলটা স্কিপ করা হলো।`);
      continue;
    }
    for (const q of arr) {
      if (!q.id) {
        console.warn(`⚠️ ${fileName} — একটা প্রশ্নে id নেই, এটা স্কিপ করা হলো।`);
        continue;
      }
      if (seenIds.has(q.id)) {
        console.warn(`⚠️ ডুপ্লিকেট id পাওয়া গেছে: "${q.id}" (ফাইল: ${fileName}) — দ্বিতীয়টা স্কিপ করা হলো।`);
        continue;
      }
      seenIds.add(q.id);
      all.push(q);
    }
  }

  return all;
}

export const allQuestions: Question[] = mergeAllQuestionFiles();
