// src/data/topics.ts
//
// বাংলা ও English মুখস্থ অংশের টপিক তালিকা।
// এগুলো "chapter" এর মতো বাধ্যতামূলক ভাগ না — শুধু প্রতিটা প্রশ্নে
// (চাইলে) ট্যাগ করার জন্য একটা রেফারেন্স লিস্ট, যাতে পরে সার্চ/ফিল্টার
// করার সময় ব্যবহার করা যায়। প্রশ্ন যোগ করার সময় এই লিস্ট থেকে একটা
// topic বেছে নিলেই যথেষ্ট, নতুন কিছু বানাতে হয় না প্রতিবার।

export const banglaTopics: string[] = [
  'সন্ধি',
  'সন্ধি বিচ্ছেদ',
  'সমাস',
  'সমাস নির্ণয়',
  'কারক',
  'বিভক্তি',
  'প্রত্যয়',
  'উপসর্গ',
  'ধাতু',
  'পদ',
  'শব্দ',
  'বচন',
  'লিঙ্গ',
  'কাল',
  'বাক্য',
  'বাগধারা',
  'প্রবাদ-প্রবচন',
  'এক কথায় প্রকাশ',
  'বিপরীত শব্দ',
  'সমার্থক শব্দ',
  'শুদ্ধ বানান',
  'শুদ্ধ বাক্য',
  'পারিভাষিক শব্দ'
];

export const englishTopics: string[] = [
  'Vocabulary',
  'Synonym',
  'Antonym',
  'One Word Substitution',
  'Idioms & Phrases',
  'Meaning',
  'Appropriate Word',
  'Spelling',
  'Confusing Words',
  'Prefix/Suffix',
  'Foreign Words',
  'Grammar',
  'Parts of Speech',
  'Noun',
  'Pronoun',
  'Adjective',
  'Adverb',
  'Verb',
  'Tense',
  'Subject-Verb Agreement',
  'Right Form of Verb',
  'Voice',
  'Narration',
  'Preposition',
  'Article',
  'Conjunction',
  'Transformation',
  'Degree',
  'Conditional',
  'Tag Question',
  'Sentence Correction',
  'বাক্য শনাক্তকরণ'
];

export const getTopicsBySubject = (subject: 'বাংলা' | 'English') =>
  subject === 'বাংলা' ? banglaTopics : englishTopics;
