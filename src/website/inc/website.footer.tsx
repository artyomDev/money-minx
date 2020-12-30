import React from 'react';

import SignupToday from 'website/partials/signup-today.footer';
import { ReactComponent as TwitterIcon } from 'assets/icons/twitter.svg';
import { ReactComponent as YoutubeIcon } from 'assets/icons/youtube.svg';
import { ReactComponent as FacebookIcon } from 'assets/icons/facebook.svg';
import { ReactComponent as LinkedinIcon } from 'assets/icons/linkedin.svg';
import { ReactComponent as InstagramIcon } from 'assets/icons/instagram.svg';
import { ReactComponent as PinterestIcon } from 'assets/icons/pinterest.svg';
import { ReactComponent as AppStoreLogo } from 'assets/icons/app-store-black.svg';
import { ReactComponent as GooglePlayLogo } from 'assets/icons/google-play-black.svg';

const FooterList = () => {
  return (
    <div className='row'>
      <div className='col-sm-3'>
        <div className='wf-list-wrapper py-2'>
          <span className='footer-feature-title'>Resources</span>
          <div className='wf-list-items'>
            <span className='footer-feature'><a className='text-white' href='/blog'>Blog</a></span>
            <span className='footer-feature'><a className='text-white' href='/security'>Security</a></span>
          </div>
        </div>
      </div>
      <div className='col-sm-5'>
        <div className='wf-list-wrapper py-2'>
          <span className='footer-feature-title'>Features</span>
          <div className='wf-list-items'>
            <h3 className='footer-feature'><a className='text-white' href='/features/net-worth'>Net Worth Calculator</a></h3>
            <h3 className='footer-feature'><a className='text-white' href='/features/allocations'>Asset Allocation</a></h3>
            <h3 className='footer-feature'><a className='text-white' href='/features/cryptos'>Crypto Tracker</a></h3>
            <h3 className='footer-feature'><a className='text-white' href='/features/synced-and-manual'>Synced or Manual Accounts</a></h3>
            <h3 className='footer-feature'><a className='text-white' href='/features/multicurrency'>Multi Currency</a></h3>
            <h3 className='footer-feature'><a className='text-white' href='/features/transaction-history'>Transaction History</a></h3>
          </div>
        </div>
      </div>
      <div className='col-sm-4'>
        <div className='wf-list-wrapper py-2'>
          <span className='footer-feature-title'>Company</span>
          <div className='wf-list-items'>
            <h3 className='footer-feature'><a className='text-white' href='/about'>About Us</a></h3>
            <h3 className='footer-feature'><a className='text-white' href='/pricing'>Pricing</a></h3>
            <h3 className='footer-feature'><a className='text-white' href='/notices'>Notices</a></h3>
            <h3 className='footer-feature'><a className='text-white' href='/privacy'>Privacy</a></h3>
            <h3 className='footer-feature'><a className='text-white' href='/terms'>Terms of Service</a></h3>
          </div>
        </div>
      </div>
    </div>
  );
};

const social = [
  {
    icon: <FacebookIcon />,
    link: 'https://www.facebook.com/moneyminx',
    label: 'Money Minx on Facebook'
  },
  {
    icon: <TwitterIcon />,
    link: 'https://twitter.com/moneyminxapp',
    label: 'Money Minx on Twitter'
  },
  {
    icon: <InstagramIcon />,
    link: 'https://instagram.com/moneyminxapp',
    label: 'Money Minx on Instagram'
  },
  {
    icon: <LinkedinIcon />,
    link: 'https://linkedin.com/company/moneyminx',
    label: 'Money Minx on LinkedIn'
  },
  {
    icon: <YoutubeIcon />,
    link: 'https://www.youtube.com/channel/UCmWuUaetlK3fABjglo9cEaQ',
    label: 'Money Minx on YouTube'
  },
  {
    icon: <PinterestIcon />,
    link: 'https://www.pinterest.com/moneyminx/',
    label: 'Money Minx on Pinterest'
  },
];

const SocialList: React.FC = () => (
  <ul className='navbar-nav'>
    {social.map(({ icon, link, label }, idx) => {
      return (
        <li key={idx} className='social-links'>
          <a href={link} target='_blank' rel='noopener noreferrer' aria-label={label}>
            {icon}
          </a>
        </li>
      );
    })}
  </ul>
);

const footerListComponent = <FooterList />;

interface WebsiteFooter {
  isSignupToday?: boolean;
}

const WebsiteFooter: React.FC<WebsiteFooter> = ({ isSignupToday = true }) => {
  return (
    <div className='website-footer'>
      {isSignupToday ? <SignupToday /> : null}

      <div className='website-footer-wrapper bg-secondary text-white'>
        <div className='footer-hero-wrapper'>
          <div className='row align-items-center'>
            <div className='col-lg-6'>
              <div className='coming-soon-wrapper'>
                <p className='large-heading-light'>Coming Soon</p>
                <p className='light-80'>
                  Money Minx is currently available online and coming soon to iOS and Android devices.
                </p>
              </div>
            </div>
            <div className='col-lg-6'>
              <div className='download-btn-wrapper'>
                <AppStoreLogo className='first-svg-item' />
                <GooglePlayLogo className='ml-3 text-white' color='white' />
              </div>
            </div>
          </div>
        </div>

        <div className='footer-end-section p-t-40'>
          <div className='row'>
            <div className='col-lg-6'>
              <div className='mm-links-wrapper'>{footerListComponent}</div>
            </div>
            <div className='col-lg-6'>
              <div className='info-copyright-wrapper'>
                <div className='info-wrapper light py-2'>
                  Money Minx is a financial publisher that does not offer any personal financial advice or advocate the
                  purchase or sale of any security or investment for any specific individual. Members should be aware that
                  investment markets have inherent risks, and past performance does not guarantee future results.
                  Money Minx has advertising relationships with some of the offers listed on this website.
                  Money Minx attempts to take a reasonable and good faith approach to maintaining objectivity towards
                  providing referrals that are in the best interest of readers. Money Minx strives to keep its information
                  accurate and up to date.</div>
                <div className='social-links-wrapper d-flex flex-row'>
                  <SocialList />
                </div>
                <div className='copyright-wrapper'>© 2020-{(new Date().getFullYear())} Money Minx. All Rights Reserved.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteFooter;
