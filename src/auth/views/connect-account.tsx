import React, { useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';

import Zabo from 'zabo-sdk-js';
import appEnv from 'app/app.env';
import AppHeader from 'common/app.header';
import AppSidebar from 'common/app.sidebar';
import useToast from 'common/hooks/useToast';
import { events } from '@mm/data/event-list';
import { STATUS_CODE } from 'app/app.status';
import useAccounts from 'auth/hooks/useAccounts';
import { AuthLayout } from 'layouts/auth.layout';
import MMToolTip from 'common/components/tooltip';
import LoadingScreen from 'common/loading-screen';
import FastLinkModal from 'yodlee/fast-link.modal';
import { useModal } from 'common/components/modal';
import useAnalytics from 'common/hooks/useAnalytics';
import { getRefreshedAccount } from 'auth/auth.service';
import { FastLinkOptionsType } from 'yodlee/yodlee.type';
import { appRouteConstants } from 'app/app-route.constant';
import UpgradeAccountModal from 'common/upgrade-account.modal';
import { pricingDetailConstant } from 'common/common.constant';
import { useAuthDispatch, useAuthState } from 'auth/auth.context';
import { ReactComponent as LogoImg } from 'assets/icons/logo.svg';
import { ReactComponent as LoginLockIcon } from 'assets/images/login/lock-icon.svg';
import { ReactComponent as LoginShieldIcon } from 'assets/images/login/shield-icon.svg';
import { ReactComponent as SSLSecure } from 'assets/icons/ssl-secure.svg';
import { getAccount, getCurrentSubscription, getFastlink, getSubscription } from 'api/request.api';

import ConnectAccountSteps from './inc/connect-steps';
import ManualAccountModal from './inc/manual-account.modal';

const config = {
  clientId: appEnv.ZABO_CONFIGURATION.ZABO_CLIENT_ID,
  env: appEnv.ZABO_CONFIGURATION.ZABO_ENV,
};

const ConnectAccount = () => {
  const { onboarded } = useAuthState();
  const [openRightNav, setOpenRightNav] = useState<boolean>(false);
  const [openLeftNav, setOpenLeftNav] = useState<boolean>(false);

  const closeRightNav = () => {
    setOpenRightNav(false);
  };

  return (
    <AuthLayout>
      {onboarded ? (
        <AppHeader
          toggleLeftMenu={() => setOpenLeftNav(!openLeftNav)}
          toggleRightMenu={() => setOpenRightNav(!openRightNav)}
          open={openRightNav}
        />
      ) : null}
      <AppSidebar openLeft={openLeftNav} openRight={openRightNav} />
      <div className='mm-slider-bg-overlay' onClick={closeRightNav} role='button' />
      <ConnectAccountMainSection />
    </AuthLayout>
  );
};
export default ConnectAccount;
export const ConnectAccountMainSection = () => {
  const location = useLocation();
  const { mmToast } = useToast();
  const { event } = useAnalytics();
  const { onboarded } = useAuthState();
  const manualAccountModal = useModal();
  const [fastLinkOptions, setFastLinkOptions] = useState<FastLinkOptionsType>({
    fastLinkURL: '',
    token: { tokenType: 'AccessToken', tokenValue: '' },
    config: { flow: '', configName: 'Aggregation', providerAccountId: 0 },
  });
  const dispatch = useAuthDispatch();
  const upgradeAccountModal = useModal();
  const [loading, setLoading] = useState(false);
  const [manualMax, setManualMax] = useState<boolean>(false);
  const [autoLoading, setAutoLoading] = useState<boolean>(false);
  const [availableNumber, setAvailableNumber] = useState<number>(0);
  const [manualLoading, setManualLoading] = useState<boolean>(false);
  const [zaboLoading, setZaboLoading] = useState<boolean>(false);
  const { loading: accountFetching, fetchLatestProviderAccounts, fetchAccounts } = useAccounts();

  const fastlinkModal = useModal();
  const history = useHistory();

  const handleConnectAccount = async () => {
    const { data, error } = await getFastlink();

    if (error) {
      return mmToast('Error Occurred to Get Fastlink', { type: 'error' });
    }

    const fLinkOptions: FastLinkOptionsType = {
      fastLinkURL: data.fastLinkUrl,
      token: data.accessToken,
      config: data.params,
    };

    setFastLinkOptions(fLinkOptions);

    event(events.connectAccount);

    return fastlinkModal.open();
  };

  const checkConnectedAccountLimit = async () => {
    setAutoLoading(true);
    const { data } = await getCurrentSubscription();
    if (data?.subscriptionStatus === 'active' || data?.subscriptionStatus === 'trialing') {
      const accounts = await getAccount();
      const autoAccounts = accounts?.data?.filter((account: Record<string, string>) => !account.isManual).length;
      const subscriptionDetails = await getSubscription({ priceId: data.priceId });
      let autoLimit = subscriptionDetails?.data?.details[pricingDetailConstant.CONNECTED_ACCOUNT];
      if (autoLimit === 'Unlimited') autoLimit = 100;
      if (autoAccounts < autoLimit) {
        setAutoLoading(false);
        return handleConnectAccount();
      } else {
        setAvailableNumber(autoLimit);
        setAutoLoading(false);
        return upgradeAccountModal.open();
      }
    }
    setAutoLoading(false);
    return history.push(appRouteConstants.subscription.SUBSCRIPTION);
  };

  const checkManualAccountLimit = async () => {
    setManualLoading(true);
    const { data } = await getCurrentSubscription();
    if (data?.subscriptionStatus === 'active' || data?.subscriptionStatus === 'trialing') {
      const accounts = await getAccount();
      const manualAccounts = accounts?.data?.filter((account: Record<string, string>) => account.isManual).length;
      const subscriptionDetails = await getSubscription({ priceId: data.priceId });
      let manualLimit = subscriptionDetails?.data?.details[pricingDetailConstant.MANUAL_ACCOUNT];
      if (manualLimit === 'Unlimited') manualLimit = 100;
      if (manualAccounts < manualLimit) {
        setManualLoading(false);
        return handleManualAccount();
      } else {
        setManualLoading(false);
        setManualMax(true);
        return upgradeAccountModal.open();
      }
    }
    setManualLoading(false);
    return history.push(appRouteConstants.subscription.SUBSCRIPTION);
  };

  const handleManualAccount = () => {
    event(events.manualConnectAccount);

    return manualAccountModal.open();
  };
  // eslint-disable-next-line
  const handleCryptoExchange = async () => {
    setZaboLoading(true);
    const zaboConfig = await Zabo.init(config);
    event(events.cryptoExchange);

    zaboConfig
      .connect()
      .onConnection((account: Record<string, string>) => {
        // Todo On Connection implementation
        // tslint:disable-next-line:no-console
        console.log('account connected:', account);
        setZaboLoading(false);
      })
      .onError((errorOnConnection: Record<string, string>) => {
        // Todo OnError implementation
        setZaboLoading(false);
      })
      .onEvent((eventName: Record<string, string>, metadata: Record<string, string>) => {
        // Todo On each event implementation
        // tslint:disable-next-line:no-console
        setZaboLoading(false);
        console.info(`[EVENT] ${eventName}`, metadata);
      });
  };

  const handleConnectAccountSuccess = async () => {
    setLoading(true);
    const { error, data } = await getRefreshedAccount({ dispatch });
    if (STATUS_CODE.SERVER_ACCEPTED === error?.code) {
      await fetchAccounts();
      setLoading(false);

      return history.push(appRouteConstants.auth.NET_WORTH);
    }
    await fetchLatestProviderAccounts();
    if (data) {
      setLoading(false);
    }

    if (error) {
      mmToast('Error Occurred on Fetching user Details', { type: 'error' });
    }
    location.pathname = appRouteConstants.auth.ACCOUNT_SETTING;
    location.search = 'from=fastLink';

    return history.push(location);
  };

  if (loading || accountFetching) {
    return <LoadingScreen onAccountFetching />;
  }

  return (
    <div className='main-table-wrapper'>
      <div>
        <div className='row login-wrapper'>
          <div className='guide-content'>
            {!onboarded ? (
              <Link to='/net-worth'>
                <LogoImg className='icon auth-logo' />
              </Link>
            ) : null}
            <div className='auth-left-content'>
              <h1>Three easy steps to get started with Money Minx</h1>
              <ul>
                <li>Find your accounts.</li>
                <li>Connect securely to Money Minx.</li>
                <li>Let Money Minx do the rest.</li>
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
              <Link to='/net-worth' className='logo-img-wrapper'>
                <LogoImg className='auth-logo' />
              </Link>
              <h2>Add an account</h2>
              <p>
                Money Minx is your place to track everything. Add your accounts, credit cards, investments, collectables, real estate and more. Get started by clicking on one of the buttons below.
              </p>

              <div className='add-account-card'>
                <div className='card-body'>
                  <span className='title'>Banks, Cards, Loans, Investments & More</span>
                  <p className='description'>Connect via our aggregation partner to your accounts. Your login credentials are never shared with Money Minx.</p>
                  <div className='add-card-bottom'>
                  <button
                    className='connect-account-btn mm-btn-primary mm-btn-animate'
                    type='button'
                    onClick={checkConnectedAccountLimit}
                  >
                    {autoLoading && (
                      <span className='spinner-grow spinner-grow-sm mr-2' role='status' aria-hidden='true' />
                    )}
                    Add Connected Account
                  </button>
                  <SSLSecure className='hide-sm'/>
                  </div>
                </div>
              </div>
              <div className='add-account-card small crypto'>
                <div className='card-body'>
                  <span className='title'>Crypto Exchanges</span>
                  <p className='description'>Add your crypto wallets, Bitcoin, Ethereum and other coins. <span className='badge badge-pill badge-primary mm-coming-soon'>Coming Soon!</span></p>
                  <div className='add-card-bottom'>
                    <MMToolTip placement='top' message='Stay tuned, crypto accounts are almost ready.'>
                      <button
                        className='connect-account-btn mm-btn-primary mm-btn-animate mm-btn-crypto d-flex align-items-center justify-content-center'
                        type='button'
                        onClick={handleCryptoExchange}
                      >
                        {zaboLoading && (
                          <span className='spinner-grow spinner-grow-sm mr-2' role='status' aria-hidden='true' />
                        )}
                        Add Crypto Exchange
                      </button>
                    </MMToolTip>
                  </div>
                </div>
              </div>
              <div className='add-account-card small'>
                <div className='card-body'>
                  <span className='title'>Manual Accounts</span>
                  <p className='description'>No logins needed, add balances and transactions on your own.</p>
                  <div className='add-card-bottom'>
                    <button
                      className='connect-account-btn btn-outline-primary mm-btn-animate d-flex align-items-center justify-content-center'
                      type='submit'
                      onClick={checkManualAccountLimit}
                    >
                      {manualLoading && (
                        <span className='spinner-grow spinner-grow-sm mr-2' role='status' aria-hidden='true' />
                      )}
                      Add Manual Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ManualAccountModal manualAccountModal={manualAccountModal} handleSuccess={handleConnectAccountSuccess} />
      {!onboarded ? <ConnectAccountSteps isConnectAccount /> : null}
      <FastLinkModal
        fastLinkModal={fastlinkModal}
        fastLinkOptions={fastLinkOptions}
        handleSuccess={handleConnectAccountSuccess}
      />
      {(availableNumber || manualMax) && (
        <UpgradeAccountModal
          upgradeAccountModal={upgradeAccountModal}
          availableNumber={availableNumber}
          manualMax={manualMax}
        />
      )}
    </div>
  );
};
