// src/utils/analytics.ts
import { supabase } from '../lib/supabase';

export async function logEvent(eventName: string, pagePath?: string) {
  try {
    const { data } = await supabase.auth.getUser();
    await supabase.from('analytics_events').insert({
      user_id: data.user?.id ?? null,
      event_name: eventName,
      page_path: pagePath ?? window.location.hash
    });
  } catch (err) {
    // Analytics ব্যর্থ হলে অ্যাপের কোনো ফিচার আটকানো উচিত না, তাই চুপচাপ ইগনোর করা হলো
    console.log('Analytics log ব্যর্থ হয়েছে:', err);
  }
}
