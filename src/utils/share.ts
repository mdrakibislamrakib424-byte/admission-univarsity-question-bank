// src/utils/share.ts
import { Share } from '@capacitor/share';

export async function shareApp() {
  try {
    await Share.share({
      title: 'প্রশ্নব্যাংক — University Admission Prep',
      text: 'বিশ্ববিদ্যালয় ভর্তি পরীক্ষার প্রশ্নব্যাংক অ্যাপ — বাংলা ও English এর মুখস্থ অংশ প্র্যাকটিস করো!',
      // dialogTitle শুধু Android/iOS এ কাজ করে
      dialogTitle: 'অ্যাপটা বন্ধুদের সাথে শেয়ার করো'
    });
  } catch (e) {
    // ইউজার শেয়ার শীট বন্ধ করে দিলে এখানে error আসতে পারে, চুপচাপ ইগনোর করা হলো
    console.log('Share cancelled or failed', e);
  }
}
