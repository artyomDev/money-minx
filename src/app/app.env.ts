import { config } from 'dotenv';

config();

export default {
  APP_ENVIRONMENT: process.env.NODE_ENV,
  BASE_URL: process.env.REACT_APP_BASE_URL,
  FACEBOOK_APP_ID: process.env.REACT_APP_FACEBOOK_APP_ID,
  STRIPE_PUBLIC_KEY:
    process.env.REACT_APP_STRIPE_PUBLIC_KEY ||
    'pk_test_51I4so7DLx1dWdl1laumKIkRWNNyviBj9qhCEgSw5oxfqgo970vyS3CUNs7g3EizldRbNO6Luh5aaWp25cqtJGpmy0024c7u8Zx',
  STRIPE_DEFAULT_PLAN: process.env.REACT_APP_STRIPE_DEFAULT_PLAN || 'price_1I609vDLx1dWdl1luxUllth2',
  ZABO_CONFIGURATION: {
    ZABO_CLIENT_ID:
      process.env.REACT_APP_ZABO_CLIENT_ID || '4bz22yXnR2lCbbUp3k4lvKwTikXSAP61D0q6GSy0GnwHiXoQYPlrgtloX6AhBaeM',
    ZABO_ENV: process.env.REACT_APP_ZABO_ENV || 'sandbox',
  },
  GOOGLE_ANALYTICS_TRACKING_ID: process.env.REACT_APP_GOOGLE_ANALYTICS_TRACKING_ID || '',
  GOOGLE_ADS_TRACKING_ID: process.env.REACT_APP_GOOGLE_ADS_TRACKING_ID || '',
  FACEBOOK_PIXEL_CODE: process.env.REACT_APP_FACEBOOK_PIXEL_CODE || '',
  CRISP_WEBSITE_ID: process.env.REACT_APP_CRISP_WEBSITE_ID || 'b3e9c107-b8dc-4e81-88a4-cdfa7b113a8f',
};
