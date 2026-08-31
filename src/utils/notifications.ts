// Local, on-device "push" reminder.
// IMPORTANT / honest limitation: this is a browser Notification, not a real
// server-sent push. It can only fire while the app (or its installed PWA
// window/service worker) is actually running on the phone, so it works best
// if the phone opens the app at least once around the reminder time.
// True server push would need a backend + push service, which this
// no-backend, GitHub-Pages-only app intentionally doesn't have.

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) return 'denied';
  if (Notification.permission === 'granted' || Notification.permission === 'denied') {
    return Notification.permission;
  }
  return Notification.requestPermission();
}

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function nowHHMM(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

// Call this once on app load / periodically. If the reminder is enabled,
// permission is granted, the target time has passed, and it hasn't already
// fired today, it shows a notification and returns true (so the caller can
// persist lastShownDate).
export function maybeFireDailyReminder(
  enabled: boolean,
  time: string,
  lastShownDate: string
): boolean {
  if (!enabled || !isNotificationSupported()) return false;
  if (Notification.permission !== 'granted') return false;
  const today = todayStr();
  if (lastShownDate === today) return false;
  if (nowHHMM() < time) return false;

  try {
    new Notification('📚 প্রশ্নব্যাংক — আজকের পড়া বাকি!', {
      body: 'আজকের চ্যালেঞ্জ বা রিভিশনটা এখনই শেষ করে ফেলো।',
      icon: '/icons/icon-192.png',
      tag: 'daily-reminder'
    });
    return true;
  } catch {
    return false;
  }
}
