import { useEffect, useState } from 'react';

import { getSubscription } from 'api/request.api';
import { useAuthDispatch } from 'auth/auth.context';
import { SubscriptionDetail } from 'auth/auth.types';

const useSubscriptions = () => {
  const dispatch = useAuthDispatch();
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState<SubscriptionDetail[]>();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { error: apiError, data } = await getSubscription();
      setLoading(false);
      if (apiError || !data) {
        return setError(apiError);
      }

      const sDetail: SubscriptionDetail[] = data;
      return setSubscriptions(sDetail);
    })();
  }, [dispatch]);

  return {
    error,
    loading,
    subscriptions,
  };
};

export default useSubscriptions;
