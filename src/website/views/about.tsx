import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import WebsiteLayout from 'website/website.layout';
/*import OwnerOneImg from 'assets/images/about/hussein.png';
import OwnerTwoImg from 'assets/images/about/jessica.png';
import OwnerLeftImg from 'assets/images/about/owner-left-img.png';*/
import PeerStreetLogo from 'assets/images/subscription/peerstreetlogo.png';
import { ReactComponent as AboutSwitchIcon } from 'assets/images/about/switch.svg';
import { ReactComponent as AboutNetWorthChart } from 'assets/images/about/networth.svg';
import { ReactComponent as AboutWealthFrontIcon } from 'assets/images/about/wealthfront.svg';
/*import { ReactComponent as OwnerTwitterIcon } from 'assets/images/about/owner-twitter-icon.svg';*/


const About = () => {
  return (
    <WebsiteLayout>
      <Helmet>
        <title>About Net Worth and Investments Tracker | Money Minx</title>
      </Helmet>
      <div className='mm-new-container'>
        <AboutTopSection />
       {/* <AboutOwnerSection />*/}
        <AboutNetWorthSection />
      </div>
    </WebsiteLayout>
  );
};
export default About;
export const AboutTopSection = () => {
  return (
    <section>
      <div className='row mm-about-top-section'>
        <div className='col-12 col-xl-7'>
          <div className=''>
            <h1>About Money Minx</h1>
            <div className='p-b-10'>
              <p className='text'>
              Money Minx makes (professional-level) investment tracking and portfolio visualizer tools accessible to
              investors of all wealth levels, including those just getting started.{' '}
            </p>
              <p className='text'>
              With a focus on modern technology, beautiful design and a friendly, intuitive user experience, Money
              Minx’s mission is to empower people of all walks life to be more informed, confident and successful in
              building and diversifying their portfolios.{' '}
            </p>
              <p className='text'>
              By developing wealth-building tools that are traditionally available to professional investors and the
              ultra wealthy, Money Minx aims to transform the way every day investors track and see their investments -
              and in turn plan for bright futures.
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

/*export const AboutOwnerSection = () => {
  return (
    <section>
      <div className='mm-about-owner-section bg-white'>
        <div className='row'>
          <div className='col-xl-5 mm-owner-section-img'>
            <div className='left-owner-img'>
              <img alt='OWNER IMG' src={OwnerLeftImg} />
            </div>
          </div>
          <div className='col-xl-7 mm-owner-section-info'>
            <div className='owner-info'>
              <h2 className='mb-3'>Money Minx Founders</h2>
              <p className='text'>
                Money Minx was started by Hussein and Jessica, a husband/wife team and investors from Southern California.
            </p>
              <p className='text'>
                Hussein is a veteran technologist with time as CIO for multiple financial service companies. Jessica is a
                market research and communications pro who loves to work for start-ups. As we expanded our investments
                outside of 401K, IRAs and the stock market, we needed a way to track it all in one place. Like most
                investors, we used Excel…but we knew there should be a better way. Something user-friendly, accessible and
                nice to look at - something like Money Minx. We hope our tools help you grow and diversify your portfolio.
                Be invested!
            </p>
              <ul className='owner-list'>
                <li>
                  <img alt='Owner' src={OwnerOneImg} />
                  <h3>Hussein</h3>
                    <a href='https://www.twitter.com/husseinyahfoufi' target='_blank' rel='noopener noreferrer'>
                      @husseinyahfoufi
                    <span className='twitter-icon'>
                        <OwnerTwitterIcon />
                      </span>
                    </a>
                </li>
                <li>
                  <img alt='Owner' src={OwnerTwoImg} />
                  <h3>Jessica</h3>
                  <a href='http://www.twitter.com/jessicayahfoufi' target='_blank' rel='noopener noreferrer'>
                    @jessicayahfoufi
                    <span className='twitter-icon'>
                      <OwnerTwitterIcon />
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};*/

export const AboutNetWorthSection = () => {
  return (
    <div className=''>
      <div className='row'>
        <div className='col-xl-5'>
          <div className='networth-text'>
            <p>
              <span className='highlighted-text'>Feature Highlight</span>
            </p>
            <h2>Net Worth Calculator</h2>
            <p className='text'>
              By adding all of your assets and investments to Money Minx you will be able to easily calculate your Net Worth. We support
              banks, crowdfunding sites, financial firms, multiple currencies and more. Crypto wallets are also coming soon.
            </p>
          </div>
        </div>
        <div className='col-xl-7'>
          <div className='mm-networth-chart text-center'>
            <AboutNetWorthChart className='mm-about-net-worth-chart' />
          </div>
        </div>
      </div>
    </div>
  );
};
