import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import WebsiteLayout from 'website/website.layout';
import LiquidNetWorth from 'assets/images/features/liquid-net-worth.svg';
import PeerStreetLogo from 'assets/images/subscription/peerstreetlogo.png';
import HomeNetWorthProjections from 'assets/images/home/net-worth-projections.svg';
import { ReactComponent as AboutSwitchIcon } from 'assets/images/about/switch.svg';
import { ReactComponent as AboutWealthFrontIcon } from 'assets/images/about/wealthfront.svg';

const FeaturesNetWorth = () => {
  return (
    <WebsiteLayout>
      <Helmet>
        <title>Net Worth Calculator | Money Minx</title>
      </Helmet>
      <div className='mm-new-container'>
        <FeaturesNetWorthTopSection />
        <FeaturesNetWorthNetWorthSection />
        <FeaturesNetWorthProjections />
      </div>
    </WebsiteLayout>
  );
};
export default FeaturesNetWorth;

export const FeaturesNetWorthTopSection = () => {
  return (
    <section>
      <div className='row mm-about-top-section'>
        <div className='col-12 col-xl-7'>
          <div>
            <h1>Net Worth Calculator</h1>
            <div className='p-b-10'>
              <p className='text'>
                Money Minx lets you track all of your assets and liabilities in one place so you have a quick and easy way to
                monitor your net worth and progress toward your financial goal.
              </p>
              <p className='text'>
                We are currently in Beta and already support over 21,000 institutions worldwide. That makes it easy for you to
                connect your accounts and automatically track your balances.
              </p>
              <p className='text'>
                Our next priority is building support to help you track your cryptos, precious metals, currencies, real estate
                and more. This is in the works and will be available soon.
              </p>
              <p className='text'>
                If you don't want to connect your accounts for automatic updating, you can always use our manual accounts
                feature to track anything you want. Simply add accounts, positions and transactions on your own.
              </p>
            </div>
            <Link to='/signup'>
              <button className='mm-btn-animate mm-btn-primary'>Get Started</button>
            </Link>
            <p className='info-text'>No credit card needed.</p>
          </div>
        </div>
        <div className='col-12 col-xl-5'>
          <div className='mm-about-right-banner'>
            <div className='account-wrap bg-white top-box'>
              <span className='medium-heading-light'>Connected Accounts</span>
              <p>Go ahead, add more accounts</p>
            </div>
            <div className='account-wrap bg-white border'>
              <span className='logo-icon'>
                <AboutWealthFrontIcon />
              </span>
              <span className='company-name'>Wealthfront</span>
              <ul className='account-list'>
                <li>
                  <span className='switch-icon'>
                    <AboutSwitchIcon />{' '}
                  </span>
                  Joint Cash Account
                </li>
                <li>
                  <span className='switch-icon'>
                    <AboutSwitchIcon />
                  </span>{' '}
                  Investment Account
                </li>
              </ul>
            </div>
            <div className='account-wrap bg-white border small-box'>
              <span className='logo-icon'>
                <img alt='Peer Street' src={PeerStreetLogo} />
              </span>
              <span className='company-name'>Peer Street</span>
              <ul className='account-list'>
                <li>
                  <span className='switch-icon'>
                    <AboutSwitchIcon />{' '}
                  </span>
                  Individual Investor Account
                </li>
                <li>
                  <span className='switch-icon'>
                    <AboutSwitchIcon />
                  </span>{' '}
                  Self-directed IRA
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const FeaturesNetWorthNetWorthSection = () => {
  return (
    <section className='feature-section feature-section-reversed'>
      <div className='row'>
        <div className='col-lg-7 feature-image'>
          <img src={LiquidNetWorth} alt='Calculate liquid net worth' />
        </div>
        <div className='col-lg-5 feature-content'>
          <h2>Liquid Net Worth</h2>
          <p>
            Classify your assets into investment assets and other assets, set liquidity levels and always know what your
            current liquid net worth is.
          </p>
        </div>
      </div>
    </section>
  );
};
export const FeaturesNetWorthProjections = () => {
  return (
    <section className='feature-section feature-text-left'>
      <div className='row'>
        <div className='col-lg-5 feature-content'>
          <h2>Future Net Worth</h2>
          <p>
            Money Minx will use the data your provide and estimated returns to give you a sense of what your net worth
            will look like into the future.
          </p>
        </div>
        <div className='col-lg-7 feature-image'>
          <img src={HomeNetWorthProjections} alt='Calculate future projection' />
        </div>
      </div>
    </section>
  );
};
