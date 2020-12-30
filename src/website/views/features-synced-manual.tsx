import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import WebsiteLayout from 'website/website.layout';
import Sync21k from 'assets/images/features/over-21k-institutions.svg';
import ManualAccountsImg from 'assets/images/features/manual-accounts.svg';

const FeaturesSyncedManual = () => {
  return (
    <WebsiteLayout>
      <Helmet>
        <title>Synced or Manual Accounts | Money Minx</title>
      </Helmet>
      <div className='mm-new-container'>
        <FeaturesSyncedManualTopSection />
        <FeaturesSyncedManualBottomSection />
      </div>
    </WebsiteLayout>
  );
};
export default FeaturesSyncedManual;

export const FeaturesSyncedManualTopSection = () => {
  return (
    <section>
      <div className='row mm-about-top-section'>
        <div className='col-12 col-xl-7'>
          <div>
            <h1>Synced or Manual Accounts</h1>
            <div className='p-b-10'>
              <p className='text'>
                Money Minx allows you to track all of your assets and liabilities in one place to help you track your net worth.
                We are still in Beta but already support over 21,000 institutions worldwide so you can automatically track your accounts.{' '}
              </p>
              <p className='text'>
                We are currently working on allowing you to automatically track your cryptos, precious metals like gold, currencies, real estate and more.{' '}
              </p>
              <p className='text'>
                You can also use our manual accounts feature to track anything you want by adding accounts, positions and transactions on your own..
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
            <img src={Sync21k} alt={'Sync 21k institutions'} />
          </div>
        </div>
      </div>
    </section>
  );
};

export const FeaturesSyncedManualBottomSection = () => {
  return (
    <section className='feature-section feature-section-reversed'>
      <div className='row'>
        <div className='col-lg-7 feature-image'>
          <img src={ManualAccountsImg} alt={'Sync 21k institutions'} className='features-manual-account'/>
        </div>
        <div className='col-lg-5 feature-content'>
          <h2>Manual Accounts</h2>
          <p>
            With manual accounts you can track anything that has value in Money Minx and add it to your net worth.
            This could be anything and everything you want. You can also add holdings within those account and even transactions.
            This is also a great way for you to track your net worth if you are not comfortable with providing your banking details.
            Note: Money Minx takes security very seriously, learn more about our <a href='/security'>security practices here</a>.
          </p>
        </div>
      </div>
    </section>
  );
};
