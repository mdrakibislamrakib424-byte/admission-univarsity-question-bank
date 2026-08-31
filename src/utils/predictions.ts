import { Question } from '../types';

export interface PredictedQuestion {
  question: Question;
  score: number;
  reason: string;
}

// This is a transparent, data-driven prediction, NOT a generative-AI guess:
// it ranks questions using how often they've historically repeated
// (timesAsked) plus a small recency boost for recent years. Questions with
// a high score are the ones most likely to be reused or rephrased again.
export function getPredictedQuestions(
  questions: Question[],
  opts?: { university?: string; subject?: string; limit?: number }
): PredictedQuestion[] {
  const currentYear = new Date().getFullYear();
  let pool = questions;
  if (opts?.university) pool = pool.filter(q => q.university === opts.university);
  if (opts?.subject) pool = pool.filter(q => q.subject === opts.subject);

  const scored = pool
    .filter(q => (q.timesAsked || 0) >= 2) // only questions that have actually repeated before
    .map(q => {
      const timesAsked = q.timesAsked || 0;
      const recencyBoost = q.year >= currentYear - 3 ? 2 : q.year >= currentYear - 6 ? 1 : 0;
      const score = timesAsked * 3 + recencyBoost;
      let reason = `আগে ${timesAsked} বার এসেছে`;
      if (recencyBoost === 2) reason += ' · সাম্প্রতিক বছরগুলোতেও এসেছে';
      else if (recencyBoost === 1) reason += ' · মাঝারি সময়ে এসেছে';
      return { question: q, score, reason };
    })
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, opts?.limit ?? 30);
}

// Groups predictions by subject so the Predictions page can show
// "এই বিষয়ে সবচেয়ে সম্ভাব্য প্রশ্ন" sections.
export function groupPredictionsBySubject(predictions: PredictedQuestion[]): Map<string, PredictedQuestion[]> {
  const map = new Map<string, PredictedQuestion[]>();
  for (const p of predictions) {
    const key = p.question.subject;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(p);
  }
  return map;
}
