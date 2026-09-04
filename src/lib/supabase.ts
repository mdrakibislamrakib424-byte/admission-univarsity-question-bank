// src/lib/supabase.ts
//
// Supabase ক্লায়েন্ট — এখান থেকেই লগইন/রেজিস্টার/ডাটাবেসে কথা বলা হবে।
//
// ব্যবহারের আগে অবশ্যই নিচের দুইটা মান বসাতে হবে।
// Supabase Dashboard -> Project Settings -> API -> এখান থেকে পাবেন।

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://oeaxtrzovmkwvwlsxmlj.supabase.co'; // যেমন: https://xxxxx.supabase.co
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lYXh0cnpvdm1rd3Z3bHN4bWxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1Mjc4OTUsImV4cCI6MjEwNDEwMzg5NX0.tQgXc-7qDmXwaCqQwT0ZOMHwEmqOoU068ENn4URRTK4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
