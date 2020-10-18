// tslint:disable: react-a11y-accessible-headings

import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import useSize from 'common/hooks/useSize';
import { BreakPoint } from 'app/app.constant';
import WebsiteLayout from 'website/website.layout';
import { fetchBlogs } from 'website/website.service';
import { appRouteConstants } from 'app/app-route.constant';
import HomeBlogImgOne from 'assets/images/home/home-blog-img1.png';
import CircularSpinner from 'common/components/spinner/circular-spinner';

import { ReactComponent as FeatureIconOne } from 'assets/images/home/feature-icon1.svg';
import { ReactComponent as FeatureIconTwo } from 'assets/images/home/feature-icon2.svg';
import { ReactComponent as FeatureIconSix } from 'assets/images/home/feature-icon6.svg';
import { ReactComponent as HomeBannerImg } from 'assets/images/home/home-banner-img.svg';
import { ReactComponent as HomeMinxMeasure } from 'assets/images/home/measure-chart.svg';
import { ReactComponent as FeatureIconFour } from 'assets/images/home/feature-icon4.svg';
import { ReactComponent as FeatureIconFive } from 'assets/images/home/feature-icon5.svg';
import { ReactComponent as HomeMinxwinksImg } from 'assets/images/home/minxwinks-img.svg';
import { ReactComponent as FeatureIconThree } from 'assets/images/home/feature-icon3.svg';
import { ReactComponent as HomeNetWorthChart } from 'assets/images/home/home-networth.svg';
import { ReactComponent as HomeEarlyAdapter } from 'assets/images/home/early-adopter-icon.svg';
import { ReactComponent as PerformanceLegend } from 'assets/images/home/performance-legend.svg';
import { ReactComponent as HomePerformanceChart } from 'assets/images/home/performance-chart.svg';
import { ReactComponent as HomeAllocationChart } from 'assets/images/home/allocation-pie-chart.svg';

const Home = () => {
  return (
    <WebsiteLayout>
      <div className='mm-new-container'>
        <HomeTopSection />
        <HomeEarlyAdopterSection />
        <HomeFeatureSection />
        <HomeBlogSection />
        <HomeNetWorthSection />
        <HomeAllocationSection />
        <HomePerformanceSection />
        <MinxWinksSection />
        <MinxMeasureSection />
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
            <h1>The easiest way to track all of your investments, in one place</h1>
            <p className='text'>
              Track your stocks, bonds, mutual funds, alternatives and much more all in one simple, accessible
              dashboard.
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

export const HomeEarlyAdopterSection = () => {
  return (
    <section>
      <div className=''>
        <div className='adopter-top-wrap'>
          <h3>Early Adopter Perks</h3>
          <p>
            Money Minx early adopters get these awesome perks. <br /> Only available while we are in Beta.
          </p>
        </div>
        <div className='row'>
          <div className='col-12 col-xl-4 my-3'>
            <div className='adopter-content h-100'>
              <h3>25% Discount on all plans</h3>
              <p>Get 25% off for the life of your account even after we go live!</p>
            </div>
          </div>
          <div className='col-12 col-xl-4 my-3'>
            <div className='adopter-content h-100'>
              <div className='early-adopter-tag'>
                <span>
                  <HomeEarlyAdapter />
                </span>
              </div>
              <h3>Early Adopter profile badge</h3>
              <p>
                Get an early adopter badge that will go up in the community once we go live. This badge will never be
                available again.
              </p>
            </div>
          </div>
          <div className='col-12 col-xl-4 my-3'>
            <div className='adopter-content h-100'>
              <h3>Get insights before anyone else</h3>
              <p>Know about new features before others and help us drive the development of new features.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export const HomeFeatureSection = () => {
  return (
    <section>
      <div className='mm-home-feature-section'>
        <div className='row mm-home-feature-wrapper'>
          <div className='col-12 col-md-6 col-xl-4'>
            <div className='feature-content'>
              <div className='feature-icon py-3'>
                <FeatureIconOne />
              </div>
              <h2 className='py-3'>Asset Allocation</h2>
              <p>Simple, up-to-date and shareable asset allocation charts</p>
            </div>
          </div>
          <div className='col-12 col-md-6 col-xl-4'>
            <div className='feature-content'>
              <div className='feature-icon py-3'>
                <Link to='/net-worth'>
                  <FeatureIconTwo />
                </Link>
              </div>
              <h2 className='py-3'>Net Worth</h2>
              <p>Ready to view networth summary categories by investments, assets and liabilities</p>
            </div>
          </div>
          <div className='col-12 col-md-6 col-xl-4'>
            <div className='feature-content'>
              <div className='feature-icon py-3'>
                <FeatureIconThree />
              </div>
              <h2 className='py-3'>Account Details</h2>
              <p>View the details behind each account in one place.</p>
            </div>
          </div>
          <div className='col-12 col-md-6 col-xl-4'>
            <div className='feature-content'>
              <div className='feature-icon py-3'>
                <FeatureIconFour />
              </div>
              <h2 className='py-3'>Synced Automatically</h2>
              <p>We sync directly with your banks and brokerages to keep your information up to date.</p>
            </div>
          </div>
          <div className='col-12 col-md-6 col-xl-4'>
            <div className='feature-content'>
              <div className='feature-icon py-3'>
                <FeatureIconFive />
              </div>
              <h2 className='py-3'>Bank Level Security</h2>
              <p>We utilizing banking level security to keep your account safe and secure.</p>
            </div>
          </div>
          <div className='col-12 col-md-6 col-xl-4'>
            <div className='feature-content'>
              <div className='feature-icon py-3'>
                <FeatureIconSix />
              </div>
              <div className=''>
                <h2 className='py-3'>
                  Income Projections <span className='badge badge-pill badge-primary mm-coming-soon'>Coming Soon!</span>
                </h2>
              </div>
              <p>
                Track which investments are paying interest, dividends or royalties and create an income projection
                schedule
              </p>
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
        <h2>Learn about investing platforms and strategies</h2>
        <p>
          <span className='block'>Visit our blog to learn about alternative investing,</span>
          diversifying your portfolio and crowdfunding.
        </p>
      </div>
      <div className='home-list blog-list'>
        <div className=''>
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
                    <h2 className='blog-header'>
                      <a href={blog?.link || '/'} target='_blank' rel='noopener noreferrer'>
                        {title || ''}
                      </a>
                    </h2>
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

export const HomeNetWorthSection = () => {
  return (
    <section>
      <div className='mm-networth-section-overview'>
        <p>
          <span className='highlighted-text'>A FEW of our many features</span>
        </p>
        <div className='row'>
          <div className='col-12 col-xl-5'>
            <div className='networth-text'>
              <h2>Net Worth</h2>
              <p className='text'>
                Easy to use dashboard of your investments, assets, liabilities and net worth from all of your accounts,
                all in one modern, easy-to-use place.
              </p>
            </div>
          </div>
          <div className='col-12 col-xl-7'>
            <div className='mm-networth-chart'>
              <HomeNetWorthChart />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const HomeAllocationSection = () => {
  return (
    <section>
      <div className='networth-section rtl'>
        <div className='row'>
          <div className='col-lg-5'>
            <div className='networth-text pt-0'>
              <h2>Allocations</h2>
              <p className='text'>
                Always up to date asset allocation pie chart gives you a 360 degree view of your investments and how
                diversified your portfolio is. This at-a-glance visual give you immediate insight on where your money is
                and where to go next. It’s easily shareable too so you can get the insights from contacts you trust.
                (Click here to see Money Minx founder’s allocation chart.)
              </p>
            </div>
          </div>
          <div className='col-lg-7'>
            <div className='networth-chart'>
              <HomeAllocationChart />
              <PerformanceLegend className='mm-networth-chart-legend mt-3' />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const HomePerformanceSection = () => {
  return (
    <section>
      <div className='mm-home-performance-section networth-section'>
        <div className='row'>
          <div className='col-xl-5'>
            <div className='networth-text'>
              <h2>
                Performance<span className='badge badge-pill badge-primary mm-coming-soon'>Coming Soon!</span>
              </h2>
              <p className='text'>
                Easy to use dashboard of your investments, assets, liabilities and net worth, from all your
                institutions, all consolidated in one place.
              </p>
            </div>
          </div>
          <div className='col-xl-7'>
            <div className='mm-home-performance-section-chart'>
              <HomePerformanceChart />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const MinxWinksSection = () => {
  return (
    <section>
      <div className='mm-winks-section networth-section rtl'>
        <div className='row align-items-center'>
          <div className='col-xl-5'>
            <div className='networth-text pt-4 mb-5'>
              <h2>
                <span className='badge badge-pill badge-primary mm-coming-soon'>!Coming Soon</span>Minx Winks
              </h2>
              <p className='text'>
                Get inside insights, recommendations, and tips from Money Minx. Get inside insights, recommendations,
                and tips from Money Minx. Get inside insights, recommendations, and tips from Money Minx.
              </p>
            </div>
          </div>
          <div className='col-xl-7'>
            <div className='networth-chart'>
              <HomeMinxwinksImg className='mm-custom-networth-chart' />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const MinxMeasureSection = () => {
  return (
    <section>
      <div className='mm-measure-section networth-section'>
        <div className='row'>
          <div className='col-lg-5'>
            <div className='networth-text'>
              <h2>
                Minx Measure-up<span className='badge badge-pill badge-primary mm-coming-soon'>Coming Soon!</span>
              </h2>
              <p className='text'>
                Put your portfolio to the test against similar investors. How does yours stack up? What do you need to
                add? How can you further diversify?
              </p>
            </div>
          </div>
          <div className='col-lg-7'>
            <div className='mm-networth-chart'>
              <HomeMinxMeasure />
            </div>
          </div>
          <div className='home-coming-soon'>
            <span className='highlighted-text'>And Much More Coming Soon!</span>
          </div>
        </div>
      </div>
    </section>
  );
};
