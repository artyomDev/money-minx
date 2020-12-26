import { useEffect, useState } from 'react';

import { isEmpty } from 'common/common-helper';
import { getSubscription } from 'api/request.api';
import { SubscriptionDetail } from 'auth/auth.types';
import { setSubscriptionDetail } from 'auth/auth.actions';
import { useAuthDispatch, useAuthState } from 'auth/auth.context';

/**
 * @description this is used for getting subscription for given priceId;
 * @param priceId
 */
const useGetSubscription = (priceId?: string) => {
  const dispatch = useAuthDispatch();
  const { subscriptionDetail } = useAuthState();
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionDetail>();

  const hasSubscriptionDetail = !isEmpty(subscriptionDetail);

  useEffect(() => {
    (async () => {
      if (hasSubscriptionDetail || !priceId) {
        return;
      }

      setLoading(true);
      const { error: apiError, data } = await getSubscription({ priceId });
      setLoading(false);
      if (apiError || !data) {
        return setError(apiError);
      }

      const sDetail: SubscriptionDetail = data;
      setSubscription(sDetail);

      return dispatch(setSubscriptionDetail(sDetail));
    })();
  }, [dispatch, priceId, hasSubscriptionDetail]);

  return {
    subError: error,
    fetchingSubscription: loading,
    subscriptionDetail: subscriptionDetail || subscription,
  };
};

export default useGetSubscription;
