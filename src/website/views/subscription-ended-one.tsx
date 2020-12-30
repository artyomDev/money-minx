import React from 'react';

import { ReactComponent as PricingTickIcon } from 'assets/images/pricing/tick-icon.svg';
import { ReactComponent as SubscriptionWarning } from 'assets/images/subscription/warning.svg';

const SubscriptionEnded = () => {
  return (
    <PricingTable />
  );
};
export default SubscriptionEnded;
export const PricingTable = () => {
  return (
    <div className='sub-ended-wrapper'>
      <div className='container'>
        <div className='row'>
          <div className='subs-ended-msg-box'>
            <div className='subs-ended-left'>
              <h4>Uh oh. Your subscription ended!</h4>
              <p>To continue using Money Minx please choose from one of the plans below to continue.</p>
            </div>
            <span className='warning-icon'>
              <SubscriptionWarning />
            </span>
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='plan-section'>
          <div className='mm-plan-radios'>
            <input type='radio' id='mm-plan-month' value='monthly' name='mm-radio-time-interval'  />
            <label className='labels' htmlFor='mm-plan-month' >Monthly</label>
            <input type='radio' id='mm-plan-year' value='annually' name='mm-radio-time-interval' />
            <label className='labels' htmlFor='mm-plan-year'>Annually</label>
            <span className='save-text' />
            <div className='mm-radio-bg'/>
          </div>
        </div>
      </div>

      <div className='row'>
        <div className='pricing-table-wrapper'>
          <div className='price-table'>
            <div className='price-heading'>
              <h2>Early Adopter - VIP</h2>
              <p>$74 / month</p>
            </div>
            <ul className='features-list'>
              <li>
                <div className='tick-icon'>
                  <PricingTickIcon />
                </div>
                Unlimited connected accounts
              </li>
              <li>
                <div className='tick-icon'>
                  <PricingTickIcon />
                </div>
                Unlimited manual accounts
              </li>
              <li>
                <div className='tick-icon'>
                  <PricingTickIcon />
                </div>
                Current and historical asset allocation charts
              </li>
              <li>
                <div className='tick-icon'>
                  <PricingTickIcon />
                </div>
                Sync across as many devices as you need
              </li>
              <li>
                <div className='tick-icon'>
                  <PricingTickIcon />
                </div>
                Early Adopter badge
              </li>
              <li>
                <div className='tick-icon'>
                  <PricingTickIcon />
                </div>
                VIP badge
              </li>
              <li>
                <div className='tick-icon'>
                  <PricingTickIcon />
                </div>
                New features as being developed
              </li>
              <li>
                <div className='tick-icon'>
                  <PricingTickIcon />
                </div>
                Early adopter access to founders
              </li>
              <li>
                <div className='tick-icon'>
                  <PricingTickIcon />
                </div>
                Early adopter access to request new features for consideration
              </li>
            </ul>
            <button className='mm-btn-animate trial-btn bg-white text-primary ml-3 btn-xs-block'>
              Start 14 day trial
            </button>
          </div>
          <div className='price-table'>
            <div className='price-heading second-table'>
              <h2>Early Adopter - Pro</h2>
              <p>$22 / month</p>
            </div>
            <ul className='features-list'>
              <li>
                <div className='tick-icon'>
                  <PricingTickIcon />
                </div>
                30 connected accounts
              </li>
              <li>
                <div className='tick-icon'>
                  <PricingTickIcon />
                </div>
                30 manual accounts
              </li>
              <li>
                <div className='tick-icon'>
                  <PricingTickIcon />
                </div>
                Current and last 12 months asset allocation charts
              </li>
              <li>
                <div className='tick-icon'>
                  <PricingTickIcon />
                </div>
                Sync across as many devices as you need
              </li>
              <li>
                <div className='tick-icon'>
                  <PricingTickIcon />
                </div>
                Early Adopter badge
              </li>
              <li>
                <div className='tick-icon'>
                  <PricingTickIcon />
                </div>
                Pro badge
              </li>
              <li>
                <div className='tick-icon'>
                  <PricingTickIcon />
                </div>
                New features as being developed
              </li>
              <li>
                <div className='tick-icon'>
                  <PricingTickIcon />
                </div>
                Early adopter access to founders
              </li>
              <li>
                <div className='tick-icon'>
                  <PricingTickIcon />
                </div>
                Early adopter access to request new features for consideration
              </li>
            </ul>
            <button className='mm-btn-animate trial-btn bg-white text-primary ml-3 btn-xs-block'>
              Start 14 day trial
            </button>
          </div>
          <div className='price-table'>
            <div className='price-heading'>
              <h2>Early Adopter - Plus</h2>
              <p>$14 / month</p>
            </div>
            <ul className='features-list'>
              <li>
                <div className='tick-icon'>
                  <PricingTickIcon />
                </div>
                10 connected accounts
              </li>
              <li>
                <div className='tick-icon'>
                  <PricingTickIcon />
                </div>
                10 manual accounts
              </li>
              <li>
                <div className='tick-icon'>
                  <PricingTickIcon />
                </div>
                Current and last 6 months asset allocation charts
              </li>
              <li>
                <div className='tick-icon'>
                  <PricingTickIcon />
                </div>
                Sync across as many devices as you need
              </li>
              <li>
                <div className='tick-icon'>
                  <PricingTickIcon />
                </div>
                Early Adopter badge
              </li>
              <li>
                <div className='tick-icon'>
                  <PricingTickIcon />
                </div>
                Plus badge
              </li>
              <li>
                <div className='tick-icon'>
                  <PricingTickIcon />
                </div>
                New features as being developed
              </li>
              <li>
                <div className='tick-icon'>
                  <PricingTickIcon />
                </div>
                Early adopter access to founders
              </li>
              <li>
                <div className='tick-icon'>
                  <PricingTickIcon />
                </div>
                Early adopter access to request new features for consideration
              </li>
            </ul>
            <button className='mm-btn-animate trial-btn bg-white text-primary ml-3 btn-xs-block'>
              Start 14 day trial
            </button>
          </div>
          <div className='price-table'>
            <div className='price-heading'>
              <h2>Early Adopter - Green</h2>
              <p>$7 / month</p>
            </div>
            <ul className='features-list'>
              <li>
                <div className='tick-icon'>
                  <PricingTickIcon />
                </div>
                5 connected accounts
              </li>
              <li>
                <div className='tick-icon'>
                  <PricingTickIcon />
                </div>
                5 manual accounts
              </li>
              <li>
                <div className='tick-icon'>
                  <PricingTickIcon />
                </div>
                Current and last 3 months asset allocation charts
              </li>
              <li>
                <div className='tick-icon'>
                  <PricingTickIcon />
                </div>
                Sync across as many devices as you need
              </li>
              <li>
                <div className='tick-icon'>
                  <PricingTickIcon />
                </div>
                Early Adopter badge
              </li>
              <li>
                <div className='tick-icon'>
                  <PricingTickIcon />
                </div>
                Green badge
              </li>
              <li>
                <div className='tick-icon'>
                  <PricingTickIcon />
                </div>
                New features as being developed
              </li>
              <li>
                <div className='tick-icon'>
                  <PricingTickIcon />
                </div>
                Early adopter access to founders
              </li>
              <li>
                <div className='tick-icon'>
                  <PricingTickIcon />
                </div>
                Early adopter access to request new features for consideration
              </li>
            </ul>
            <button className='mm-btn-animate trial-btn bg-white text-primary ml-3 btn-xs-block'>
              Start 14 day trial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
