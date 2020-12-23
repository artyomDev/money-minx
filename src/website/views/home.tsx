// tslint:disable: react-a11y-accessible-headings
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import useSize from 'common/hooks/useSize';
import { BreakPoint } from 'app/app.constant';
import WebsiteLayout from 'website/website.layout';
import { fetchBlogs } from 'website/website.service';
import { appRouteConstants } from 'app/app-route.constant';
import Joe from 'assets/images/testimonials/joe-magnotti.jpeg';
import Zahid from 'assets/images/testimonials/zahid-lilani.jpg';
import Faraz from 'assets/images/testimonials/faraz-sharafi.jpeg';
import HomeBlogImgOne from 'assets/images/home/home-blog-img1.png';
import CircularSpinner from 'common/components/spinner/circular-spinner';
import { ReactComponent as Quotes } from 'assets/images/testimonials/quote.svg';
import { ReactComponent as CSMinxWinks } from 'assets/images/home/cs-minx-winks.svg';
import { ReactComponent as FeatureIconRealEstate } from 'assets/icons/icon-real-estate.svg';
import { ReactComponent as FeatureIconTwo } from 'assets/images/home/feature-icon2.svg';
import { ReactComponent as FeatureIconSix } from 'assets/images/home/feature-icon6.svg';
import { ReactComponent as HomeBannerImg } from 'assets/images/home/home-banner-img.svg';
import { ReactComponent as SyncedOrManual } from 'assets/images/home/synced-or-manual.svg';
import { ReactComponent as FeatureIconFour } from 'assets/images/home/feature-icon4.svg';
import { ReactComponent as FeatureIconThree } from 'assets/images/home/feature-icon3.svg';
import { ReactComponent as HomeNetWorthChart } from 'assets/images/features/net-worth-calculator.svg';
import { ReactComponent as HomeMulticurrency } from 'assets/images/features/multicurrency.svg';
import { ReactComponent as HomeAllocationChart } from 'assets/images/home/allocation-pie-chart.svg';
import { ReactComponent as InvestmentsAndCryptos} from 'assets/images/features/investment-assets-cryptos.svg';
import { ReactComponent as HomeTransactionHistory } from 'assets/images/features/transaction-history.svg';

const Home = () => {
  return (
    <WebsiteLayout>
      <div className='mm-new-container'>
        <HomeTopSection />
        <HomeTestimonials />
        <HomeNetWorthSection />
        <HomeAllocationSection />
        <HomeMulticurrencySection />
        <HomeCryptosSection />
        <HomeSyncedManualSection />
        <HomeTransactionHistorySection />
        <HomeComingSoonSection />
        <HomeBlogSection />
      </div>
    </WebsiteLayout>
  );
};

export default Home;
export const HomeTopSection = () => {
  return (
    <section>
      <div className='row'>
        <div className='col-xl-7'>
          <div className='mm-home-left-banner'>
            <h1>Take your investing to the next level.</h1>
            <p className='text'>
              Track your net worth and investment portfolio in one place with technology built for the diversified investor.
            </p>
            <Link to={appRouteConstants.auth.SIGNUP}>
              <button className='mm-btn-animate mm-btn-primary'>Get Started</button>
            </Link>
            <small className='d-block mt-3 mt-md-4'>No credit card needed.</small>
          </div>
        </div>
        <div className='col-xl-5'>
          <div className='mm-home-right-img-banner text-center mt-xl-n5'>
            <HomeBannerImg />
          </div>
        </div>
      </div>
      <div className='mm-scroll-container-parent mm-mb-hide'>
        <div className='mm-scroll-container'>
          <div className='mouse'>
            <div className='scroll' />
          </div>
        </div>
      </div>
    </section>
  );
};

export const HomeTestimonials = () => {
  return (
    <section className='testimonial'>
      <div>
        <span className='black title-in-post medium-heading-light'>What users are saying</span>
        <div className='testimonial-row'>
          <div className='testimonial-block'>
            <Quotes className='testimonial-quote'/>
            <div className='testimonial-card'>
              <p>I am most looking forward to seeing the fancy charts telling me where my money is at!</p>
            </div>
            <img className='testimonial-user' src={Joe} alt='Joe Magnotti'/>
            <div className='testimonial-name'>Joe Magnotti <span>Empire Flippers</span></div>
          </div>
          <div className='testimonial-block'>
            <Quotes className='testimonial-quote'/>
            <div className='testimonial-card'>
              <p>I am most excited to see the accumulated value of my portfolio with a future forecast.</p>
            </div>
            <img className='testimonial-user' src={Faraz} alt='Faraz Sharafi'/>
            <div className='testimonial-name'>Faraz Sharafi <span>Intuit</span></div>
          </div>
          <div className='testimonial-block'>
            <Quotes className='testimonial-quote'/>
            <div className='testimonial-card'>
              <p>I am looking forward to learning about my income projections based on my dividend portfolio.</p>
            </div>
            <img className='testimonial-user' src={Zahid} alt='Zahid Lilani'/>
            <div className='testimonial-name'>Zahid Lilani <span>Dividend.fun</span></div>
          </div>
        </div>
      </div>
    </section>
  );
};
export const HomeNetWorthSection = () => {
  return (
    <section className='feature-section feature-text-left'>
      <span className='highlighted-text p-b-9'>A few of our many features</span>
        <div className='row'>
          <div className='col-lg-5 feature-content'>
              <a href='/features/net-worth'>
                <h2>Net Worth Calculator</h2>
              </a>
              <p>
                Stay up-to-date with your assets and liabilities. Track your wealth by using our Net Worth Calculator.
              </p>
            </div>
          <div className='col-lg-7 feature-image'>
              <HomeNetWorthChart />
          </div>
      </div>
    </section>
  );
};
export const HomeAllocationSection = () => {
  return (
    <section className='feature-section feature-section-reversed'>
        <div className='row'>
          <div className='col-lg-7 feature-image'>
            <HomeAllocationChart />
          </div>
          <div className='col-lg-5 feature-content'>
            <a href='/features/allocations'>
              <h2>Asset Allocation</h2>
            </a>
            <p>
              With our asset allocation calculator, you will have a 360 degree view of your investments and your portfolio diversification.
            </p>
          </div>
        </div>
    </section>
  );
};
export const HomeMulticurrencySection = () => {
  return (
    <section className='feature-section feature-text-left'>
        <div className='row'>
          <div className='col-lg-5 feature-content'>
            <a href='/features/multicurrency'>
              <h2>Multi Currency</h2>
            </a>
            <p>
              Money Minx is built with the international investor in mind. Choose a home base currency, convert and view your accounts in any currency.
            </p>
          </div>
          <div className='col-lg-7 feature-image'>
            <HomeMulticurrency />
          </div>
        </div>
    </section>
  );
};
export const HomeCryptosSection = () => {
  return (
    <section className='feature-section feature-section-reversed'>
        <div className='row'>
          <div className='col-lg-7 feature-image'>
            <InvestmentsAndCryptos className='mm-custom-networth-chart' />
          </div>
          <div className='col-lg-5 feature-content'>
              <a href='/features/cryptos'>
                <h2>Crypto Tracker
                  <span className='badge badge-pill badge-primary mm-coming-soon'>Coming Soon!</span>
                </h2>
              </a>
              <p>
                Connect your cryptocurrency wallets, including Coinbase, Binance, Gemini and more.
                Keep an eye on your Bitcoin, Ethereum and other cryptos at all times.
              </p>
          </div>
        </div>
    </section>
  );
};
export const HomeSyncedManualSection = () => {
  return (
    <section className='feature-section feature-text-left'>
        <div className='row'>
          <div className='col-lg-5 feature-content'>
            <a href='/features/synced-and-manual'>
              <h2>Synced or Manual Accounts</h2>
            </a>
            <p className='text'>
              Sync with over 21k supported institutions or use manual accounts.
              Manual accounts are a great way to track non-traditional investments, like comic books, art, rare legos and more - no logins necessary.
            </p>
          </div>
          <div className='col-lg-7 feature-image'>
            <SyncedOrManual />
          </div>
        </div>
    </section>
  );
};
export const HomeTransactionHistorySection = () => {
  return (
    <section className='feature-section feature-section-reversed'>
      <div className='row'>
        <div className='col-lg-7 feature-image'>
          <HomeTransactionHistory />
        </div>
        <div className='col-lg-5 feature-content'>
          <a href='/features/transaction-history'>
            <h2>Transaction History</h2>
          </a>
          <p>
            Keep an eye on all of your accounts from one place.
            Review the transaction history and holdings of each account.
          </p>
        </div>
      </div>
    </section>
  );
};
export const HomeComingSoonSection = () => {
  return (
    <section>
      <div className='mm-home-feature-section'>
        <div className='highlighted-text p-b-12 text-on-darkBG'>And Much More Coming Soon!</div>
        <div className='row mm-home-feature-wrapper'>
          <div className='col-12 col-md-6 col-xl-4'>
            <div className='feature-content'>
              <div className='feature-icon py-3'>
                <FeatureIconTwo />
              </div>
              <h3 className='py-3'>International Banks</h3>
              <p>Additional international banks will be supported soon.</p>
            </div>
          </div>
          <div className='col-12 col-md-6 col-xl-4'>
            <div className='feature-content'>
              <div className='feature-icon py-3'>
                <CSMinxWinks />
              </div>
              <h3 className='py-3'>Minx Winks</h3>
              <p>Get tips and strategies from our wealth of investment knowledge</p>
            </div>
          </div>
          <div className='col-12 col-md-6 col-xl-4'>
            <div className='feature-content'>
              <div className='feature-icon py-3'>
                <FeatureIconFour />
              </div>
              <h3 className='py-3'>Minx Measure-up</h3>
              <p>Compare your portfolio to other investors with similar profiles and get helpful insights from others
                with real world experience.</p>
            </div>
          </div>
          <div className='col-12 col-md-6 col-xl-4'>
            <div className='feature-content'>
              <div className='feature-icon py-3'>
                <FeatureIconThree />
              </div>
              <h3 className='py-3'>Performance Tracking</h3>
              <p>See how all of your investments are performing in one full financial picture. Money Weighted or Time Weighted returns.</p>
            </div>
          </div>
          <div className='col-12 col-md-6 col-xl-4'>
            <div className='feature-content'>
              <div className='feature-icon py-3'>
                <FeatureIconSix />
              </div>
              <h3 className='py-3'>Income Projections</h3>
              <p>Track which investments are paying interest, dividends or royalties and create an income projection schedule.</p>
            </div>
          </div>
          <div className='col-12 col-md-6 col-xl-4'>
            <div className='feature-content'>
              <div className='feature-icon py-3'>
                <FeatureIconRealEstate />
              </div>
                <h3 className='py-3'>Real Estate</h3>
              <p>Add the addresses of your properties and we'll track the market value for you.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export const HomeBlogSection = () => {
  const { width } = useSize();
  const [blogs, setBlogs] = useState<any[]>();
  const [loading, setLoading] = useState<boolean>();

  useEffect(() => {
    setLoading(true);
    fetchBlogs()
      .then((res) => {
        setBlogs(res.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  }, []);

  if (loading || !blogs?.length) {
    return <CircularSpinner />;
  }

  return (
    <div className='home-blog-section'>
      <div className='blog-content-left'>
        <h4>Learn about investing platforms and strategies</h4>
        <p>
          <span className='block'>Visit our blog to learn about alternative investing,</span>
          diversifying your portfolio and crowdfunding.
        </p>
      </div>
      <div className='home-list blog-list'>
        <div>
          <div className='mm-blog-btn'>
            <a
              className='mm-nav-link mm-link-blog-btn'
              target='_blank'
              rel='noopener noreferrer'
              href='https://www.moneyminx.com/blog'
            >
              <button className='mm-btn-animate mm-btn-primary'>Visit Blog</button>
            </a>
          </div>
        </div>
        <div className='row'>
          {blogs.map((blog: any, index: number) => {
            const span = document.createElement('span');
            span.innerHTML = blog?.title?.rendered;
            const title = span.textContent || span.innerText;
            span.innerHTML = blog?.excerpt?.rendered;
            const excerpt = span.textContent || span.innerText;

            if (width <= BreakPoint.DESK && index === blogs?.length - 1) {
              return null;
            }

            return (
              <div className='col-md-6 col-xl-4' key={index}>
                <div>
                  <div className='mm-blog-details'>
                    <div className='blog-img mm-blog-img'>
                      <img alt={blog?.slug} src={blog?.jetpack_featured_media_url || HomeBlogImgOne} />
                    </div>
                    <h4 className='blog-header'>
                      <a href={blog?.link || '/'} target='_blank' rel='noopener noreferrer'>
                        {title || ''}
                      </a>
                    </h4>
                    <p className='blog-content'>{excerpt}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div>
          <a
            className='mm-nav-link d-xl-none'
            target='_blank'
            rel='noopener noreferrer'
            href='https://www.moneyminx.com/blog'
          >
            <button className='mm-btn-animate mm-btn-primary'>Visit Blog</button>
          </a>
        </div>
      </div>
    </div>
  );
};
