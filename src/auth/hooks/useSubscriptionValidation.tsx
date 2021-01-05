import { useEffect, useLayoutEffect, useState } from 'react';

import { isEmpty } from 'lodash';
import useMounted from 'common/hooks/useMounted';
import useSearchParam from 'auth/hooks/useSearchParam';
import { appRouteConstants } from 'app/app-route.constant';
import { Account, SubscriptionDetail } from 'auth/auth.types';
import { pricingDetailConstant } from 'common/common.constant';
import { StripeSubscriptionStatus } from 'setting/setting.enum';
import { useAuthDispatch, useAuthState } from 'auth/auth.context';
import { getCurrentSubscription, getSubscription } from 'api/request.api';
import { setCurSubscription, setSubscriptionDetail } from 'auth/auth.actions';

const useSubscriptionValidation = () => {
  const { currentSubscription, subscriptionDetail, onboarded, accounts } = useAuthState();
  const dispatch = useAuthDispatch();
  const mounted = useMounted().current;
  const from = useSearchParam('from');
  const [loading, setLoading] = useState<boolean>(false);
  const [accessibleRoute, setAccessibleRoutes] = useState('');

  const subStatus = currentSubscription?.subscriptionStatus;
  const hasAllValues = [currentSubscription, subscriptionDetail, accounts].every((item) => !isEmpty(item));

  const active = StripeSubscriptionStatus.ACTIVE;
  const unpaid = StripeSubscriptionStatus.UNPAID;
  const canceled = StripeSubscriptionStatus.CANCELED;
  const trailing = StripeSubscriptionStatus.TRIALING;
  const isPlanExist = subStatus === active || subStatus === trailing;
  const isPlanExpired = subStatus === canceled || subStatus === unpaid;

  const existingManualAccounts = accounts?.filter((account: Account) => account.isManual).length;
  const existingAutoAccounts = accounts?.filter((account: Account) => !account.isManual).length;
  const numberOfConnectedAccountOnPlan = subscriptionDetail?.details?.[pricingDetailConstant.CONNECTED_ACCOUNT] || '0';
  const numberOfManualAccountOnPlan = subscriptionDetail?.details?.[pricingDetailConstant.MANUAL_ACCOUNT] || '0';
  const hasUnlimitedConnectedAccount = numberOfConnectedAccountOnPlan.toUpperCase() === 'UNLIMITED';
  const hasUnlimitedManualAccount = numberOfManualAccountOnPlan.toUpperCase() === 'UNLIMITED';

  const checkPlanExceeds = () => {
    if (hasUnlimitedConnectedAccount && hasUnlimitedManualAccount) {
      return false;
    }

    if (
      existingAutoAccounts > +numberOfConnectedAccountOnPlan ||
      existingManualAccounts > +numberOfManualAccountOnPlan
    ) {
      return true;
    }

    return false;
  };

  const isPlanExceeds = checkPlanExceeds();

  const hasSubscriptionDetail = !isEmpty(subscriptionDetail);
  const hasCurrentSubscription = !isEmpty(currentSubscription);

  /**
   * Get current subscription @if current subscription not available
   * Get subscription detail @if subscription detail is not available
   */
  useEffect(() => {
    (async () => {
      let priceId: string = '';
      if (!hasCurrentSubscription && mounted) {
        setLoading(true);
        const { data, error } = await getCurrentSubscription();
        setLoading(false);
        if (!error || data) {
          priceId = data?.priceId;
          dispatch(setCurSubscription(data));
        }
      }
      if (!hasSubscriptionDetail && priceId && mounted) {
        setLoading(true);
        const { data, error } = await getSubscription({ priceId });
        setLoading(false);
        if (!error || data) {
          const subDetail: SubscriptionDetail = data;
          dispatch(setSubscriptionDetail(subDetail));
        }
      }
    })();
  }, [hasCurrentSubscription, hasSubscriptionDetail, dispatch, mounted]);

  useLayoutEffect(() => {
    let route: string = '';
    (() => {
      if (!onboarded) {
        route = appRouteConstants.auth.CONNECT_ACCOUNT;
      }

      if (from === 'accountSettings') {
        route = 'all';
      }

      if (hasAllValues && !loading) {
        if (isPlanExpired) {
          route = appRouteConstants.subscription.SUBSCRIPTION;
          return route;
        }

        if (isPlanExist) {
          if (isPlanExceeds) {
            route = appRouteConstants.subscription.REVIEW;

            return route;
          }
        }

        if (isPlanExist && (onboarded || from === 'accountSettings') && !isPlanExceeds) {
          route = 'all';

          return route;
        }

        route = appRouteConstants.auth.CONNECT_ACCOUNT;

        return route;
      }
    })();

    setAccessibleRoutes(route);
  }, [isPlanExpired, isPlanExist, onboarded, isPlanExceeds, hasAllValues, loading, from]);

  return {
    loading,
    accessibleRoute,
  };
};

export default useSubscriptionValidation;
