import { config } from 'dotenv';

config();

export default {
  APP_ENVIRONMENT: process.env.NODE_ENV,
  BASE_URL: 'https://api.moneyminx.com/',
  FACEBOOK_APP_ID: process.env.REACT_APP_FACEBOOK_APP_ID,
  STRIPE_PUBLIC_KEY: process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_51H8PpUAjc68kwXCHuXGg5Kjb6YrCsLRSqfiCTeayJJ3zk3ydXl7SdEJRqa7fKJHEyZJ7BdPHAcdH3GpMPrT8lG5y00HehFXF0D',
  STRIPE_DEFAULT_PLAN: 'price_1HrYgeAjc68kwXCH1KRmw4H1',
  ZABO_CONFIGURATION: {
    ZABO_CLIENT_ID: process.env.REACT_APP_ZABO_CLIENT_ID || '4bz22yXnR2lCbbUp3k4lvKwTikXSAP61D0q6GSy0GnwHiXoQYPlrgtloX6AhBaeM',
    ZABO_ENV: process.env.REACT_APP_ZABO_ENV || 'sandbox',
  },
  GOOGLE_ANALYTICS_TRACKING_ID: process.env.REACT_APP_GOOGLE_ANALYTICS_TRACKING_ID || '',
  GOOGLE_ADS_TRACKING_ID: process.env.REACT_APP_GOOGLE_ADS_TRACKING_ID || '',
  FACEBOOK_PIXEL_CODE: process.env.REACT_APP_FACEBOOK_PIXEL_CODE || '',
};
