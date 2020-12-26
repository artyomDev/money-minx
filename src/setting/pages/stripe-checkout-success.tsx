import queryString from 'query-string';
import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import useToast from 'common/hooks/useToast';
import { useAuthState } from 'auth/auth.context';
import { useModal } from 'common/components/modal';
import useAnalytics from 'common/hooks/useAnalytics';
import { appRouteConstants } from 'app/app-route.constant';
import PlanChangedModal from 'setting/inc/plan-changed.modal';
import usePixel, { EPixelTrack } from 'common/hooks/usePixel';
import { pricingDetailConstant } from 'common/common.constant';
import SubscriptionModal from 'setting/inc/subscription.modal';
import useGetSubscription from 'auth/hooks/useGetSubscription';
import { getAccountsCount, getSubscription } from 'api/request.api';
import useCurrentSubscription from 'auth/hooks/useCurrentSubscription';
import CircularSpinner from 'common/components/spinner/circular-spinner';

const StripeCheckoutSuccess = () => {
  const { fbq } = usePixel();
  const history = useHistory();
  const location = useLocation();
  const { event } = useAnalytics();
  const { mmToast } = useToast();
  const isTrial = queryString.parse(location.search).trial === 'true';

  const subscriptionModal = useModal();
  const planChangedModal = useModal();

  const { fetchingCurrentSubscription, currentSubError, currentSubscription } = useCurrentSubscription();
  useGetSubscription(currentSubscription?.priceId);
  const { subscriptionDetail } = useAuthState();

  if (currentSubError) {
    mmToast('Error on getting current subscription', { type: 'error' });
  }

  useEffect(() => {
    if (currentSubscription && subscriptionDetail) {
      event({
        category: 'Subscription',
        action: 'Subscribed',
        label: `Subscribed on ${currentSubscription.name} plan'`,
        value: subscriptionDetail.price,
      });
      fbq(EPixelTrack.SUBSCRIBE, {
        currency: 'USD',
        value: subscriptionDetail.price,
        predicted_ltv: 6 * subscriptionDetail.price,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSubscription, subscriptionDetail]);

  useEffect(() => {
    if (isTrial) {
      return subscriptionModal.open();
    }

    return planChangedModal.open();
  }, [isTrial, subscriptionModal, planChangedModal]);

  if (fetchingCurrentSubscription) {
    return <CircularSpinner />;
  }

  const redirectToNetworth = async () => {
    if (!currentSubscription) {
      return;
    }

    const { priceId } = currentSubscription;
    const {
      data: { connectedAccounts, manualAccounts },
    } = await getAccountsCount();
    const {
      data: { details },
    } = await getSubscription({ priceId });
    if (
      connectedAccounts >= details[pricingDetailConstant.CONNECTED_ACCOUNT] ||
      manualAccounts >= details[pricingDetailConstant.MANUAL_ACCOUNT]
    ) {
      history.push(appRouteConstants.subscription.REVIEW);
    } else history.push(appRouteConstants.networth.NET_WORTH);
  };

  return (
    <>
      <SubscriptionModal subscriptionModal={subscriptionModal} onSuccess={redirectToNetworth} />
      <PlanChangedModal planChangedModal={planChangedModal} onSuccess={redirectToNetworth} />
    </>
  );
};

export default StripeCheckoutSuccess;
