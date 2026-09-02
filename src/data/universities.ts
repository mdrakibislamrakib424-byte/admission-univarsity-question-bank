// src/data/universities.ts
//
// বিশ্ববিদ্যালয় তালিকা — ইউনিট/অনুষদ অনুযায়ী গ্রুপ করা।
//
// গুরুত্বপূর্ণ নোট: প্রতিটা বিশ্ববিদ্যালয়ের ইউনিটের নাম/সংখ্যা প্রতি
// শিক্ষাবর্ষে সামান্য বদলাতে পারে (যেমন কোনো বছর D ইউনিট থাকে, কোনো
// বছর থাকে না)। তাই এখানে সবচেয়ে প্রচলিত/স্থায়ী কাঠামো রাখা হলো —
// দরকার হলে শুধু এই ফাইলের ভেতরের অ্যারেতে যোগ/বিয়োগ করলেই চলবে,
// অন্য কোনো কোড পরিবর্তনের দরকার নেই।

export type UnitGroup = 'বিজ্ঞান' | 'মানবিক' | 'বাণিজ্য' | 'সামাজিক বিজ্ঞান' | 'সমন্বিত';

export interface UniversityUnit {
  code: string;      // যেমন 'A', 'B', 'C'
  name: string;       // ইউনিটের পূর্ণ নাম
  group: UnitGroup;   // কোন গোত্রে পড়ে (ফিল্টারের জন্য)
}

export interface University {
  id: string;          // ডাটাবেসে/questions.json এ ব্যবহারের জন্য ইউনিক কোড
  name: string;         // বাংলা পূর্ণ নাম
  shortName: string;    // সংক্ষিপ্ত নাম (DU, RU ইত্যাদি)
  category: 'সাধারণ বিশ্ববিদ্যালয়' | 'গুচ্ছ (GST)' | 'প্রকৌশল বিশ্ববিদ্যালয়' | 'কৃষি বিশ্ববিদ্যালয়';
  units: UniversityUnit[];
}

export const universities: University[] = [
  // ---------------- সাধারণ বিশ্ববিদ্যালয় (এককভাবে পরীক্ষা নেয়) ----------------
  {
    id: 'du',
    name: 'ঢাকা বিশ্ববিদ্যালয়',
    shortName: 'DU',
    category: 'সাধারণ বিশ্ববিদ্যালয়',
    units: [
      { code: 'A', name: 'বিজ্ঞান ইউনিট', group: 'বিজ্ঞান' },
      { code: 'B', name: 'কলা ও মানবিক ইউনিট', group: 'মানবিক' },
      { code: 'C', name: 'বাণিজ্য ইউনিট', group: 'বাণিজ্য' },
      { code: 'D', name: 'সামাজিক বিজ্ঞান ইউনিট', group: 'সামাজিক বিজ্ঞান' }
    ]
  },
  {
    id: 'ru',
    name: 'রাজশাহী বিশ্ববিদ্যালয়',
    shortName: 'RU',
    category: 'সাধারণ বিশ্ববিদ্যালয়',
    units: [
      { code: 'A', name: 'মানবিক ইউনিট', group: 'মানবিক' },
      { code: 'B', name: 'ব্যবসায় শিক্ষা ইউনিট', group: 'বাণিজ্য' },
      { code: 'C', name: 'বিজ্ঞান ইউনিট', group: 'বিজ্ঞান' }
    ]
  },
  {
    id: 'cu',
    name: 'চট্টগ্রাম বিশ্ববিদ্যালয়',
    shortName: 'CU',
    category: 'সাধারণ বিশ্ববিদ্যালয়',
    units: [
      { code: 'A', name: 'বিজ্ঞান ইউনিট', group: 'বিজ্ঞান' },
      { code: 'B', name: 'কলা ও মানবিক ইউনিট', group: 'মানবিক' },
      { code: 'B1', name: 'কলা অনুষদ (বিজ্ঞান শাখার শিক্ষার্থী)', group: 'মানবিক' },
      { code: 'C', name: 'বাণিজ্য ইউনিট', group: 'বাণিজ্য' },
      { code: 'D', name: 'সামাজিক বিজ্ঞান ইউনিট', group: 'সামাজিক বিজ্ঞান' }
    ]
  },
  {
    id: 'ju',
    name: 'জাহাঙ্গীরনগর বিশ্ববিদ্যালয়',
    shortName: 'JU',
    category: 'সাধারণ বিশ্ববিদ্যালয়',
    units: [
      { code: 'A', name: 'জীববিজ্ঞান ইউনিট', group: 'বিজ্ঞান' },
      { code: 'B', name: 'সামাজিক বিজ্ঞান ইউনিট', group: 'সামাজিক বিজ্ঞান' },
      { code: 'C', name: 'বাণিজ্য ইউনিট', group: 'বাণিজ্য' },
      { code: 'D', name: 'কলা ও মানবিক ইউনিট', group: 'মানবিক' },
      { code: 'E', name: 'আইন অনুষদ ইউনিট', group: 'সামাজিক বিজ্ঞান' }
    ]
  },
  {
    id: 'jnu',
    name: 'জগন্নাথ বিশ্ববিদ্যালয়',
    shortName: 'JnU',
    category: 'সাধারণ বিশ্ববিদ্যালয়',
    units: [
      { code: 'A', name: 'বিজ্ঞান ইউনিট', group: 'বিজ্ঞান' },
      { code: 'B', name: 'মানবিক ইউনিট', group: 'মানবিক' },
      { code: 'C', name: 'বাণিজ্য ইউনিট', group: 'বাণিজ্য' }
    ]
  },
  {
    id: 'cou',
    name: 'কুমিল্লা বিশ্ববিদ্যালয়',
    shortName: 'CoU',
    category: 'সাধারণ বিশ্ববিদ্যালয়',
    units: [
      { code: 'A', name: 'বিজ্ঞান ইউনিট', group: 'বিজ্ঞান' },
      { code: 'B', name: 'মানবিক ইউনিট', group: 'মানবিক' },
      { code: 'C', name: 'বাণিজ্য ইউনিট', group: 'বাণিজ্য' }
    ]
  },
  {
    id: 'ku',
    name: 'খুলনা বিশ্ববিদ্যালয়',
    shortName: 'KU',
    category: 'সাধারণ বিশ্ববিদ্যালয়',
    units: [
      { code: 'SCI', name: 'বিজ্ঞান স্কুল', group: 'বিজ্ঞান' },
      { code: 'ARTS', name: 'কলা ও মানবিক স্কুল', group: 'মানবিক' },
      { code: 'BUS', name: 'ব্যবসায় প্রশাসন স্কুল', group: 'বাণিজ্য' },
      { code: 'SOC', name: 'সামাজিক বিজ্ঞান স্কুল', group: 'সামাজিক বিজ্ঞান' }
    ]
  },
  {
    id: 'sust',
    name: 'শাহজালাল বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়',
    shortName: 'SUST',
    category: 'সাধারণ বিশ্ববিদ্যালয়',
    units: [
      { code: 'A', name: 'বিজ্ঞান ও প্রকৌশল ইউনিট', group: 'বিজ্ঞান' },
      { code: 'B', name: 'সামাজিক বিজ্ঞান ও কলা ইউনিট', group: 'সামাজিক বিজ্ঞান' },
      { code: 'C', name: 'ব্যবসায় শিক্ষা ইউনিট', group: 'বাণিজ্য' }
    ]
  },

  // ---------------- গুচ্ছ (GST) ----------------
  {
    id: 'gst',
    name: 'গুচ্ছ বিশ্ববিদ্যালয় (GST)',
    shortName: 'GST',
    category: 'গুচ্ছ (GST)',
    units: [
      { code: 'A', name: 'বিজ্ঞান ইউনিট', group: 'বিজ্ঞান' },
      { code: 'B', name: 'মানবিক ইউনিট', group: 'মানবিক' },
      { code: 'C', name: 'বাণিজ্য ইউনিট', group: 'বাণিজ্য' }
    ]
  },

  // ---------------- প্রকৌশল বিশ্ববিদ্যালয় ----------------
  {
    id: 'buet',
    name: 'বাংলাদেশ প্রকৌশল বিশ্ববিদ্যালয়',
    shortName: 'BUET',
    category: 'প্রকৌশল বিশ্ববিদ্যালয়',
    units: [{ code: 'ENG', name: 'প্রকৌশল ইউনিট (সমন্বিত)', group: 'সমন্বিত' }]
  },
  {
    id: 'cuet',
    name: 'চট্টগ্রাম প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয়',
    shortName: 'CUET',
    category: 'প্রকৌশল বিশ্ববিদ্যালয়',
    units: [{ code: 'ENG', name: 'প্রকৌশল ইউনিট (সমন্বিত)', group: 'সমন্বিত' }]
  },
  {
    id: 'kuet',
    name: 'খুলনা প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয়',
    shortName: 'KUET',
    category: 'প্রকৌশল বিশ্ববিদ্যালয়',
    units: [{ code: 'ENG', name: 'প্রকৌশল ইউনিট (সমন্বিত)', group: 'সমন্বিত' }]
  },
  {
    id: 'ruet',
    name: 'রাজশাহী প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয়',
    shortName: 'RUET',
    category: 'প্রকৌশল বিশ্ববিদ্যালয়',
    units: [{ code: 'ENG', name: 'প্রকৌশল ইউনিট (সমন্বিত)', group: 'সমন্বিত' }]
  },
  {
    id: 'mist',
    name: 'মিলিটারি ইনস্টিটিউট অব সায়েন্স অ্যান্ড টেকনোলজি',
    shortName: 'MIST',
    category: 'প্রকৌশল বিশ্ববিদ্যালয়',
    units: [{ code: 'ENG', name: 'প্রকৌশল ইউনিট', group: 'সমন্বিত' }]
  },

  // ---------------- কৃষি বিশ্ববিদ্যালয় ----------------
  {
    id: 'bau',
    name: 'বাংলাদেশ কৃষি বিশ্ববিদ্যালয়',
    shortName: 'BAU',
    category: 'কৃষি বিশ্ববিদ্যালয়',
    units: [{ code: 'AGRI', name: 'কৃষি ইউনিট (সমন্বিত)', group: 'সমন্বিত' }]
  },
  {
    id: 'bsmrau',
    name: 'বঙ্গবন্ধু শেখ মুজিবুর রহমান কৃষি বিশ্ববিদ্যালয়, গাজীপুর',
    shortName: 'BSMRAU',
    category: 'কৃষি বিশ্ববিদ্যালয়',
    units: [{ code: 'AGRI', name: 'কৃষি ইউনিট (সমন্বিত)', group: 'সমন্বিত' }]
  },
  {
    id: 'sau',
    name: 'শেরেবাংলা কৃষি বিশ্ববিদ্যালয়',
    shortName: 'SAU',
    category: 'কৃষি বিশ্ববিদ্যালয়',
    units: [{ code: 'AGRI', name: 'কৃষি ইউনিট (সমন্বিত)', group: 'সমন্বিত' }]
  },
  {
    id: 'sylau',
    name: 'সিলেট কৃষি বিশ্ববিদ্যালয়',
    shortName: 'SylAU',
    category: 'কৃষি বিশ্ববিদ্যালয়',
    units: [{ code: 'AGRI', name: 'কৃষি ইউনিট (সমন্বিত)', group: 'সমন্বিত' }]
  },
  {
    id: 'cvasu',
    name: 'চট্টগ্রাম ভেটেরিনারি ও এনিম্যাল সায়েন্সেস বিশ্ববিদ্যালয়',
    shortName: 'CVASU',
    category: 'কৃষি বিশ্ববিদ্যালয়',
    units: [{ code: 'AGRI', name: 'কৃষি ইউনিট (সমন্বিত)', group: 'সমন্বিত' }]
  },
  {
    id: 'kau',
    name: 'খুলনা কৃষি বিশ্ববিদ্যালয়',
    shortName: 'KAU',
    category: 'কৃষি বিশ্ববিদ্যালয়',
    units: [{ code: 'AGRI', name: 'কৃষি ইউনিট (সমন্বিত)', group: 'সমন্বিত' }]
  },
  {
    id: 'pstu',
    name: 'পটুয়াখালী বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়',
    shortName: 'PSTU',
    category: 'কৃষি বিশ্ববিদ্যালয়',
    units: [{ code: 'AGRI', name: 'কৃষি/বিজ্ঞান ইউনিট (সমন্বিত)', group: 'সমন্বিত' }]
  }
];

// দ্রুত ফিল্টারের জন্য সাহায্যকারী ফাংশন
export const getUniversityById = (id: string) => universities.find(u => u.id === id);

export const getUniversitiesByCategory = (category: University['category']) =>
  universities.filter(u => u.category === category);
