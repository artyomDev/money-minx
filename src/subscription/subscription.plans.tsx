import React, { useState } from 'react';

import { Plan } from 'setting/setting.type';
import { events } from '@mm/data/event-list';
import GALink from 'common/components/ga-link';
import { pricingDetailConstant } from 'common/common.constant';
import useGetSubscription from 'auth/hooks/useGetSubscription';
import CircularSpinner from 'common/components/spinner/circular-spinner';
import { ReactComponent as PricingTickIcon } from 'assets/images/pricing/tick-icon.svg';
import { ReactComponent as PricingTickIconCS } from 'assets/images/pricing/tick-icon-cs.svg';

const SubscriptionPlans = () => {
  const [type, setType] = useState<string>('monthly');

  const { fetchingSubscription, subError, subscription } = useGetSubscription();

  if (fetchingSubscription && !subscription && subError) {
    return <CircularSpinner />;
  }

  const monthlyPricingList = subscription?.filter((sub: any) => sub.duration === 'month' && sub.active === true);
  const annualPricingList = subscription?.filter((sub: any) => sub.duration === 'year' && sub.active === true);

  const pricingList = type === 'monthly' ? monthlyPricingList : annualPricingList;

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='plan-section'>
          <div className='mm-plan-radios'>
            <input
              type='radio'
              id='mm-plan-month'
              value='monthly'
              name='mm-radio-time-interval'
              checked={type === 'monthly'}
            />
            <label className='labels' htmlFor='mm-plan-month' onClick={() => setType('monthly')}>
              Monthly
            </label>
            <input
              type='radio'
              id='mm-plan-year'
              value='annually'
              name='mm-radio-time-interval'
              checked={type === 'yearly'}
            />
            <label className='labels' htmlFor='mm-plan-year' onClick={() => setType('yearly')}>
              Annually
            </label>
            <span className='save-text' />
            <div className='mm-radio-bg' />
          </div>
        </div>
      </div>

      <div className='row'>
        <div className='pricing-table-wrapper'>
          {pricingList?.map((pt: Plan, index: number) => {
            return (
              <div className='price-table' key={index}>
                <div className='price-heading'>
                  <span className='price-plan-name'>{pt.name}</span>
                  <p>
                    {type === 'yearly' ? `$${pt.price}/Year` : `$${pt.price}/Month`}
                    {type === 'yearly' ? <span className='save-percentage'>Save ${pt.save}</span> : null}
                  </p>
                </div>
                <ul className='features-list'>
                  <li>
                    <div className='tick-icon'>
                      <PricingTickIcon />
                    </div>
                    {pt.details[pricingDetailConstant.CONNECTED_ACCOUNT]} connected accounts
                  </li>
                  <li>
                    <div className='tick-icon'>
                      <PricingTickIcon />
                    </div>
                    {pt.details[pricingDetailConstant.MANUAL_ACCOUNT]} manual accounts
                  </li>
                  <li>
                    <div className='tick-icon'>
                      <PricingTickIcon />
                    </div>
                    {'Current and '}
                    {pt.details[pricingDetailConstant.ALLOCATION_CHART_HISTORY] === 'Unlimited'
                      ? 'historical '
                      : `last ${pt.details[pricingDetailConstant.ALLOCATION_CHART_HISTORY]} months `}
                    asset allocation charts
                  </li>
                  <li>
                    <div className='tick-icon'>
                      <PricingTickIcon />
                    </div>
                    {pt.details[pricingDetailConstant.CURRENCY] === 'USD'
                      ? 'USD support only '
                      : `USD, EUR, JPY, CHF and more currencies supported `}
                  </li>
                  <li>
                    <div className='tick-icon'>
                      <PricingTickIcon />
                    </div>
                    Support for syncing with over 21,000 institutions
                  </li>
                  <li>
                    <div className='tick-icon'>
                      <PricingTickIcon />
                    </div>
                    Add custom manual accounts, positions and transactions
                  </li>
                  <li>
                    <div className='tick-icon'>
                      <PricingTickIcon />
                    </div>
                    Calculate net worth projections
                  </li>
                  {/* TODO add badges once community is ready
                    <li>
                      <div className='tick-icon'>
                        <PricingTickIcon />
                      </div>
                      {pt.details[pricingDetailConstant.NAME]} badge
                    </li>*/}
                  {pt.details[pricingDetailConstant.CRYPTO] === 'Yes' ? (
                    <li className='cs-list'>
                      <div className='highlighted-text-light'>Coming Soon!</div>
                    </li>
                  ) : null}
                  <li>
                    {pt.details[pricingDetailConstant.CRYPTO] === 'Yes' ? (
                      <div className='tick-icon'>
                        <PricingTickIconCS />
                      </div>
                    ) : null}
                    {pt.details[pricingDetailConstant.CRYPTO] === 'Yes' ? 'Sync your crypto wallets' : ''}
                  </li>
                </ul>
                <GALink
                  to={`/auth/signup?priceId=${pt.priceId}&planName=${pt.name}&planPrice=${pt.price}`}
                  eventArgs={{ ...events.trialFromPricing, action:`Clicked on start ${pt.name} plan`, value: pt.price }}
                >
                  <button className='mm-btn-animate trial-btn ml-3 btn-xs-block'>Start 14 day trial</button>
                </GALink>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
