// src/hooks/useSubscription.ts
//
// এই hook দিয়ে জানা যাবে ইউজারের এখন সাবস্ক্রিপশন সক্রিয় আছে কিনা।
// অ্যাপের যেকোনো জায়গায় ব্যবহার করা যাবে: const { isSubscribed } = useSubscription();

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface SubscriptionState {
  isSubscribed: boolean;
  endDate: string | null;
  loading: boolean;
  refresh: () => void;
}

export function useSubscription(): SubscriptionState {
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const check = useCallback(() => {
    if (!user) {
      setIsSubscribed(false);
      setEndDate(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from('active_subscription')
      .select('end_date')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        setIsSubscribed(!!data);
        setEndDate(data?.end_date ?? null);
        setLoading(false);
      });
  }, [user]);

  useEffect(() => {
    check();
  }, [check]);

  return { isSubscribed, endDate, loading, refresh: check };
}
