import React from 'react';
import WebsiteLayout from 'website/website.layout';
import { ReactComponent as PricingPieChart } from 'assets/images/pricing/pricing-pie-chart.svg';
import { ReactComponent as SubscriptionWarning } from 'assets/images/subscription/warning.svg';
import { ReactComponent as OwnAccountIcon } from 'assets/images/subscription/own-account-icon.svg';
import { ReactComponent as BackIcon } from 'assets/images/subscription/back-btn.svg';

import { ReactComponent as AboutWealthFrontIcon } from 'assets/images/about/wealthfront.svg';
import PeerStreetLogo from 'assets/images/subscription/peerstreetlogo.png';
import MerrilEdgeLogo from 'assets/images/subscription/merriledgelogo.png';

const SubscriptionEnded = () => {
  return (
    <WebsiteLayout>
      <SubscriptionEndedTopSection />
      <PricingTable />
    </WebsiteLayout>
  );
};

export default SubscriptionEnded;
export const SubscriptionEndedTopSection = () => {
  return (
    <div className='mm-container-right pricing-banner-container'>
      <div className='row pricing-top'>
        <div className='col-lg-5'>
          <div className='pricing-left-banner'>
            <h1>
              <span className='block'>Early adopter </span>pricing (25% off)
            </h1>
            <p className='text'>
              No credit card needed, sign up now and use Money <span className='block'>Minx free for 30 days.</span>
            </p>

            <button className='mm-btn-animate bg-primary mm-btn-primary-outline'>Get Started</button>
            <p className='info-text'>No credit card needed.</p>
          </div>
        </div>
        <div className='col-lg-7 pricing-chart-wrapper'>
          <div className='banner-piechart'>
            <PricingPieChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export const PricingTable = () => {
  return (
    <div className='container-fluid subscription-ended bottom'>
      <div className='row'>
        <div className='subs-ended-msg-box'>
          <div className='subs-ended-left'>
            <h4>Too many connections for current plan!</h4>
            <p>
              Your current plan only allows for 5 connections, please remove connections to continue using Money Minx.
            </p>
          </div>
          <span className='warning-icon'>
            <SubscriptionWarning />
          </span>
        </div>
        <div className='col-lg-12'>
          <div className='subscription-account-wrap'>
            <h3>Connected Accounts</h3>
            <ul className='subscribed-list'>
              <li>
                <div className='account-wrap'>
                  <p>
                    <span className='logo-icon'>
                      <AboutWealthFrontIcon />
                    </span>
                    Wealthfront
                  </p>
                  <button className='delete-btn'>
                    <a href='link9'>Delete Account</a>
                  </button>
                </div>
              </li>
              <li>
                <div className='account-wrap'>
                  <p>
                    <span className='logo-icon'>
                      <img alt='Peer Street' src={PeerStreetLogo} />
                    </span>
                    Peer Street
                  </p>
                  <button className='delete-btn'>
                    <a href='link9'>Delete Account</a>
                  </button>
                </div>
              </li>
              <li>
                <div className='account-wrap'>
                  <p>
                    <span className='logo-icon'>
                      <img src={MerrilEdgeLogo} alt='Peer Street' />
                    </span>
                    Merill Edge IRA
                  </p>
                  <button className='delete-btn'>
                    <a href='link9'>Delete Account</a>
                  </button>
                </div>
              </li>
            </ul>
            <h3>Manual Accounts</h3>
            <ul className='subscribed-list'>
              <li>
                <div className='account-wrap'>
                  <p>
                    <span className='logo-icon'>
                      <OwnAccountIcon />
                    </span>
                    My own account
                  </p>
                  <button className='delete-btn'>
                    <a href='link9'>Delete Account</a>
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='subscription-bottom-text'>
          <div className='subs-content one'>
            <a href='link12'>
              <span className='back-btn'>
                <BackIcon />
              </span>
            </a>
          </div>
          <div className='subs-content two'>
            <p>
              4/1 <span className='hidden-text'>connected </span>
              <br />
              5/4 <span className='hidden-text'>manual</span>
            </p>
          </div>
          <div className='subs-content three'>
            <p>You need to delete 3 connected accounts and 1 manual to be able to use this plan.</p>
          </div>
          <div className='subs-content four'>
            <button className='finish-btn'>
              <a href='link11'>Finish</a>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};