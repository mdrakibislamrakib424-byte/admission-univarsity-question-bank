// src/lib/supabase.ts
//
// Supabase ক্লায়েন্ট — এখান থেকেই লগইন/রেজিস্টার/ডাটাবেসে কথা বলা হবে।
//
// ব্যবহারের আগে অবশ্যই নিচের দুইটা মান বসাতে হবে।
// Supabase Dashboard -> Project Settings -> API -> এখান থেকে পাবেন।

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL'; // যেমন: https://xxxxx.supabase.co
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_PUBLIC_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
