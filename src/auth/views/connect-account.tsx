import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';

import Zabo from 'zabo-sdk-js';
import appEnv from 'app/app.env';
import { events } from '@mm/data/event-list';
import { AuthLayout } from 'layouts/auth.layout';
import { useAuthState } from 'auth/auth.context';
import MMToolTip from 'common/components/tooltip';
import { useModal } from 'common/components/modal';
import FastLinkModal from 'yodlee/fast-link.modal';
import useAnalytics from 'common/hooks/useAnalytics';
import useGetFastlink from 'auth/hooks/useGetFastlink';
import { FastLinkOptionsType } from 'yodlee/yodlee.type';
import { appRouteConstants } from 'app/app-route.constant';
import { ReactComponent as LogoImg } from 'assets/icons/logo.svg';
import CircularSpinner from 'common/components/spinner/circular-spinner';
// import { ReactComponent as ZillowIcon } from 'assets/images/signup/zillow.svg';
import { ReactComponent as LoginLockIcon } from 'assets/images/login/lock-icon.svg';
import { ReactComponent as LoginShieldIcon } from 'assets/images/login/shield-icon.svg';

import ConnectAccountSteps from './inc/connect-steps';
import ManualAccountModal from './inc/manual-account.modal';

const config = {
  clientId: appEnv.ZABO_CONFIGURATION.ZABO_CLIENT_ID,
  env: appEnv.ZABO_CONFIGURATION.ZABO_ENV,
};

const ConnectAccount = () => {
  return (
    <AuthLayout>
      <ConnectAccountMainSection />
    </AuthLayout>
  );
};
export default ConnectAccount;
export const ConnectAccountMainSection = () => {
  const location = useLocation();
  const { event } = useAnalytics();
  const { onboarded } = useAuthState();
  const manualAccountModal = useModal();
  const [zabo, setZabo] = useState<Record<string, () => Record<string, any>>>({});

  useEffect(() => {
    const initializeZabo = async () => {
      const zaboConfig = await Zabo.init(config);
      setZabo(zaboConfig);
    };
    initializeZabo();
  }, []);

  const { error, data, loading } = useGetFastlink();
  const fastlinkModal = useModal();
  const history = useHistory();

  const handleConnectAccount = () => {
    event(events.connectAccount);

    return fastlinkModal.open();
  };

  const handleManualAccount = () => {
    event(events.manualConnectAccount);

    return manualAccountModal.open();
  };

  const handleCryptoExchange = () => {
    event(events.cryptoExchange);

    zabo
      .connect()
      .onConnection((account: Record<string, string>) => {
        // Todo On Connection implementation
        // tslint:disable-next-line:no-console
        console.log('account connected:', account);
      })
      .onError((errorOnConnection: Record<string, string>) => {
        // Todo OnError implementation
      })
      .onEvent((eventName: Record<string, string>, metadata: Record<string, string>) => {
        // Todo On each event implementation
        // tslint:disable-next-line:no-console
        console.info(`[EVENT] ${eventName}`, metadata);
      });
  };

  const handleConnectAccountSuccess = () => {
    location.pathname = appRouteConstants.auth.ACCOUNT_SETTING;

    return history.push(location);
  };

  if (loading || error || !data) {
    return <CircularSpinner />;
  }

  const fastLinkOptions: FastLinkOptionsType = {
    fastLinkURL: data.fastLinkUrl || '',
    token: data.accessToken || '',
  };

  return (
    <div className='main-table-wrapper'>
      <div className=''>
        <div className='row login-wrapper'>
          <div className='guide-content'>
            <Link to='/net-worth'>
              <LogoImg className='icon auth-logo' />
            </Link>

            <div className='auth-left-content'>
              <h1>Three easy steps to get started with Money Minx</h1>
              <ul>
                <li>Find your accounts</li>
                <li>Connect it securely to Money Minx</li>
                <li>Let Money Minx do the rest</li>
              </ul>
              <div className='guide-bottom'>
                <h2>Serious about security</h2>
                <div className='guide-icon-wrap'>
                  <span className='locked-icon'>
                    <LoginLockIcon />
                  </span>
                  <p>The security of your information is our top priority</p>
                </div>
                <h2>Trusted by investors</h2>
                <div className='guide-icon-wrap'>
                  <span className='shield-icon'>
                    <LoginShieldIcon />
                  </span>
                  <p>Investors from all over the world are using Money Minx</p>
                </div>
              </div>
            </div>
          </div>
          <div className='bg-white credentials-wrapper connect-wrap'>
            <div className='credentials-content connect-account'>
              <div className='logo-img-wrapper'>
                <LogoImg className='auth-logo' />
              </div>
              <h2>Connect accounts</h2>
              <p>
                We partnered with financial technology industry veterans, to facilitate aggregation of your accounts.
                Your account credentials are never shared with Money Minx.
              </p>
              <div className='connect-account-buttons'>
                <button
                  className='connect-account-btn mm-btn-primary mm-btn-animate'
                  type='button'
                  onClick={handleConnectAccount}
                >
                  Add Banks and Investments
                </button>
                <MMToolTip
                  placement='top'
                  message='Stay tuned, crypto accounts are almost ready.'
                >
                  <button
                    className='connect-account-btn mm-btn-primary mm-btn-animate mm-btn-crypto'
                    type='button'
                    /*onClick={handleCryptoExchange}*/
                  >
                    Add Crypto Exchanges
                  </button>
                </MMToolTip>
                <span className='badge badge-pill badge-primary mm-coming-soon'>Coming Soon!</span>
              </div>
              <div className='manual-account-section'>
                <h2>
                  <span className='manual-heading'>Add a manual account instead</span>
                </h2>
                <p>
                  If your financial institution is not support or if you want to track a non traditional asset or
                  liability you can add the details manually.
                </p>
                <button
                  className='connect-account-btn btn-outline-primary mm-btn-animate'
                  type='submit'
                  onClick={handleManualAccount}
                >
                  Add Manual Account
                </button>
                {/*<h2>
                  <span className='manual-heading'>Add real estate</span>
                </h2>
                <div className='zillow-wrap d-block d-md-flex'>
                  <button className='connect-account-btn btn-outline-primary mm-btn-animate' type='submit'>
                    Add Real Estate
                  </button>
                  <span className='zillow-img'>
                    <ZillowIcon className='mt-2' />
                  </span>
                </div>*/}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ManualAccountModal manualAccountModal={manualAccountModal} />
      {!onboarded ? <ConnectAccountSteps isConnectAccount /> : null}
      <FastLinkModal
        fastLinkModal={fastlinkModal}
        fastLinkOptions={fastLinkOptions}
        handleSuccess={handleConnectAccountSuccess}
      />
    </div>
  );
};
