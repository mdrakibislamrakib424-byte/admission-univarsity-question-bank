// src/utils/pushNotifications.ts
//
// ফোনে আসল (Firebase-ভিত্তিক) push notification চালু করার জন্য।
// এটা কাজ করতে হলে অবশ্যই Firebase প্রজেক্ট সেটআপ + google-services.json
// লাগবে (নিচে চূড়ান্ত জবাবে ধাপগুলো লেখা আছে)।

import { PushNotifications } from '@capacitor/push-notifications';
import { supabase } from '../lib/supabase';

export async function initPushNotifications(userId: string) {
  const permStatus = await PushNotifications.checkPermissions();

  let granted = permStatus.receive === 'granted';
  if (!granted) {
    const req = await PushNotifications.requestPermissions();
    granted = req.receive === 'granted';
  }
  if (!granted) return;

  await PushNotifications.register();

  PushNotifications.addListener('registration', async token => {
    await supabase.from('push_tokens').upsert(
      { user_id: userId, fcm_token: token.value, platform: 'android', updated_at: new Date().toISOString() },
      { onConflict: 'user_id,fcm_token' }
    );
  });

  PushNotifications.addListener('registrationError', err => {
    console.error('পুশ নোটিফিকেশন রেজিস্ট্রেশনে সমস্যা:', err);
  });
}
