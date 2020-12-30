import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import DefaultAvatar from 'assets/icons/default-avatar.svg';
import FastLinkModal from 'yodlee/fast-link.modal';
import LoadingScreen from 'common/loading-screen';
import moment from 'moment';
import useToast from 'common/hooks/useToast';
import useAccounts from 'auth/hooks/useAccounts';
import useAnalytics from 'common/hooks/useAnalytics';
import useGetSubscription from 'auth/hooks/useGetSubscription';
import useCurrentSubscription from 'auth/hooks/useCurrentSubscription';
import {
  AccountRowProps,
  AccountCardProps,
  ManualAccountProps,
  AccountOverviewProps,
  AccountDialogBoxProps,
  SubscriptionConnectionWarningProps,
} from 'setting/setting.type';
import { Account } from 'auth/auth.types';
import { events } from '@mm/data/event-list';
import { useModal } from 'common/components/modal';
import { getFastlinkUpdate } from 'api/request.api';
import { groupByProviderName } from 'auth/auth.helper';
import { getRelativeDate } from 'common/moment.helper';
import { FastLinkOptionsType } from 'yodlee/yodlee.type';
import { appRouteConstants } from 'app/app-route.constant';
import { Placeholder } from 'networth/views/inc/placeholder';
import { pricingDetailConstant } from 'common/common.constant';
import { fNumber, numberWithCommas } from 'common/number.helper';
import { useAuthDispatch, useAuthState } from 'auth/auth.context';
import { ReactComponent as IconEdit } from 'assets/icons/icon-edit.svg';
import { ReactComponent as DeleteIcon } from 'assets/icons/icon-delete.svg';
import { ReactComponent as BackArrow } from 'assets/images/subscription/back-arrow.svg';
import { ReactComponent as DefaultProviderLogo } from 'assets/icons/mm-default-provider.svg';
import { ReactComponent as SubscriptionWarning } from 'assets/images/subscription/warning.svg';
import { deleteAccounts, deleteAccountById, fetchConnectionInfo, getRefreshedAccount } from 'auth/auth.service';

export const AccountOverview: React.FC<AccountOverviewProps> = ({ reviewSubscriptionFlag = false }) => {
  const history = useHistory();
  const { mmToast } = useToast();
  const { accounts } = useAuthState();
  const dispatch = useAuthDispatch();
  const { fetchingCurrentSubscription, currentSubscription } = useCurrentSubscription();
  const { fetchingSubscription, subscriptionDetail: subscription } = useGetSubscription(currentSubscription?.priceId);

  const accountLength = accounts.length;
  useEffect(() => {
    if (!accountLength) {
      const getUser = async () => {
        await fetchConnectionInfo({ dispatch });
      };
      getUser();
    }
  }, [accountLength, dispatch]);

  const loading = fetchingCurrentSubscription || fetchingSubscription;

  if (loading || !accountLength) {
    return <LoadingScreen />;
  }

  const manualAccounts = accounts.filter((acc) => acc.isManual);
  const connectedAccounts = accounts.filter((acc) => !acc.isManual);

  const numberOfConnectedAccounts = subscription?.details?.[pricingDetailConstant.CONNECTED_ACCOUNT] || '0';
  const numberOfManualAccounts = subscription?.details?.[pricingDetailConstant.MANUAL_ACCOUNT] || '0';

  const verifyAccountNumbers = (event: React.ChangeEvent<any>) => {
    event.preventDefault();
    if (
      numberOfConnectedAccounts === 'Unlimited' ||
      (manualAccounts.length <= +numberOfManualAccounts && connectedAccounts.length <= +numberOfConnectedAccounts)
    ) {
      history.push(appRouteConstants.networth.NET_WORTH);
      return;
    }
    mmToast('Kindly remove accounts first.', { type: 'error' });
  };

  return (
    <section className='mm-account-overview'>
      {reviewSubscriptionFlag && (
        <SubscriptionConnectionWarning
          availableConnectedAccounts={numberOfConnectedAccounts}
          availableManualAccounts={numberOfManualAccounts}
        />
      )}
      <AccountCard
        accountList={connectedAccounts}
        availableAccounts={numberOfConnectedAccounts}
        reviewSubscriptionFlag={reviewSubscriptionFlag}
      />
      <ManualAccounts
        manualAccountList={manualAccounts}
        availableAccounts={numberOfManualAccounts}
        reviewSubscriptionFlag={reviewSubscriptionFlag}
      />
      {reviewSubscriptionFlag && (
        <AccountDialogBox
          verifyAccountNumbers={verifyAccountNumbers}
          availableConnectedAccounts={numberOfConnectedAccounts}
          availableManualAccounts={numberOfManualAccounts}
          accountList={connectedAccounts}
          manualAccountList={manualAccounts}
        />
      )}
    </section>
  );
};

export const ManualAccounts: React.FC<ManualAccountProps> = ({
  manualAccountList,
  availableAccounts,
  reviewSubscriptionFlag,
}) => {
  const history = useHistory();
  const { mmToast } = useToast();
  const dispatch = useAuthDispatch();
  const [deleting, setDeleting] = useState<boolean>(false);
  const needUpgrade = manualAccountList.length >= availableAccounts;

  const addAccount = () => {
    if (reviewSubscriptionFlag) {
      history.push(appRouteConstants.subscription.SUBSCRIPTION);
      return;
    }
    if (!needUpgrade) {
      history.push(appRouteConstants.auth.CONNECT_ACCOUNT);
    } else {
      history.push(`${appRouteConstants.settings.SETTINGS}?active=Plan`);
    }
  };

  const removeAccounts = async (accounts: Account[]) => {
    setDeleting(true);
    const { error } = await deleteAccounts({ dispatch, accounts });
    if (error) {
      mmToast('Error occurred deleting account', { type: 'error' });
    }
    setDeleting(false);
  };

  return (
    <>
      <div className='card mm-setting-card'>
        <div className='d-md-flex flex-wrap justify-content-between align-items-center'>
          <div className={`mm-account-overview__add-account m-b-8 mb-md-0 ${needUpgrade ? 'text-danger' : ''}`}>
            <span>
              Manual Accounts ({manualAccountList.length}/{availableAccounts})
            </span>
            {needUpgrade ? <span className='upgrade-caption'>Upgrade your account to add more accounts</span> : null}
          </div>
          <div>
            <button type='button' className='btn btn-outline-primary mm-button btn-lg' onClick={addAccount}>
              {needUpgrade || reviewSubscriptionFlag ? 'Upgrade Plan' : 'Add Account'}
            </button>
          </div>
        </div>
      </div>
      <div className='card mm-setting-card mm-account-overview__account'>
        <div className='row pb-2 pt-1'>
          <div className='col-10 col-md-6'>
            <div>
              <DefaultProviderLogo className='mr-3 mr-md-4' />
              <span className='mm-account-overview__block-title'>Money Minx Manual</span>
            </div>
          </div>
        </div>
        {manualAccountList.length === 0 && <Placeholder type='manual' />}
        {manualAccountList.map((acc, index) => {
          return <AccountRow account={acc} key={index} reviewSubscriptionFlag={reviewSubscriptionFlag} />;
        })}
        <div className='row py-3 align-items-center'>
          <div className='col-12 col-md-6' />
          <div className='col-12 col-md-6 text-md-right'>
            <button
              className='btn text-danger mm-button__flat mm-account-overview__delete-link'
              aria-label='Delete Manual Account'
              onClick={() => {
                removeAccounts(manualAccountList);
              }}
              disabled={deleting}
            >
              {deleting ? <span className='spinner-grow spinner-grow-sm' role='status' aria-hidden='true' /> : null}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export interface AccountsByProvider {
  provider_name: string;
  accounts: Account[];
}

export interface AccountByStatus {
  success: AccountsByProvider[];
  warning: AccountsByProvider[];
  error: AccountsByProvider[];
}

export const AccountCard: React.FC<AccountCardProps> = ({ accountList, availableAccounts, reviewSubscriptionFlag }) => {
  const history = useHistory();
  const { event } = useAnalytics();
  const { mmToast } = useToast();
  const dispatch = useAuthDispatch();
  const [deleting, setDeleting] = useState<boolean>(false);
  const [fastLinkOptions, setFastLinkOptions] = useState<FastLinkOptionsType>({
    fastLinkURL: '',
    token: { tokenType: 'AccessToken', tokenValue: '' },
    config: { flow: '', configName: 'Aggregation', providerAccountId: 0 },
  });
  const fastlinkModal = useModal();
  const [loading, setLoading] = useState(false);
  const { loading: fetchingNewAccounts } = useAccounts();

  const needUpgrade = accountList.length >= +availableAccounts;
  const accountsByProvider = groupByProviderName(accountList);

  const handleConnectAccountSuccess = async () => {
    setLoading(true);
    const { error } = await getRefreshedAccount({ dispatch });

    setLoading(false);

    if (error) {
      mmToast('Error Occurred on Fetching user Details', { type: 'error' });
    }
  };

  const handleConnectAccount = async (accId: number) => {
    const { data, error } = await getFastlinkUpdate(accId);

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

  const accountsByStatus: AccountByStatus = {
    error: [],
    warning: [],
    success: [],
  };

  for (let p_name in accountsByProvider) {
    const status = accountsByProvider[p_name][0].providerAccount?.status;
    const nextUpdateScheduled = accountsByProvider[p_name][0].providerAccount?.dataset?.[0]?.nextUpdateScheduled;
    if (
      status === 'LOGIN_IN_PROGRESS' ||
      status === 'IN_PROGRESS' ||
      status === 'PARTIAL_SUCCESS' ||
      (status === 'SUCCESS' && nextUpdateScheduled >= moment().toISOString())
    ) {
      accountsByStatus.success.push({ provider_name: p_name, accounts: accountsByProvider[p_name] });
    } else if (
      status === 'USER_INPUT_REQUIRED' ||
      (status === 'SUCCESS' && nextUpdateScheduled < moment().toISOString()) ||
      (status === 'SUCCESS' && nextUpdateScheduled === null)
    ) {
      accountsByStatus.warning.push({ provider_name: p_name, accounts: accountsByProvider[p_name] });
    } else {
      accountsByStatus.error.push({ provider_name: p_name, accounts: accountsByProvider[p_name] });
    }
  }

  const addAccount = () => {
    if (reviewSubscriptionFlag) {
      history.push(appRouteConstants.subscription.SUBSCRIPTION);
      return;
    }
    if (!needUpgrade) {
      history.push(appRouteConstants.auth.CONNECT_ACCOUNT);
    } else {
      history.push(`${appRouteConstants.settings.SETTINGS}?active=Plan`);
    }
  };

  const removeAccounts = async (accounts: Account[]) => {
    setDeleting(true);
    const { error } = await deleteAccounts({ dispatch, accounts });
    if (error) {
      mmToast('Error occurred deleting account', { type: 'error' });
    }
    setDeleting(false);
  };

  const getStatusClassName = (status: string) => {
    if (status === 'success') {
      return 'mm-account-overview__connected';
    } else if (status === 'warning') {
      return 'mm-account-overview__info';
    }
    return 'mm-account-overview__error';
  };

  if (loading || fetchingNewAccounts) {
    return <LoadingScreen onAccountFetching />;
  }

  return (
    <>
      <div className='card mm-setting-card'>
        <div className='d-md-flex flex-wrap justify-content-between align-items-center'>
          <div className={`mm-account-overview__add-account m-b-8 mb-md-0 ${needUpgrade ? 'text-danger' : ''}`}>
            <span>
              Connected Accounts ({accountList.length}/{availableAccounts})
            </span>
            {needUpgrade ? <span className='upgrade-caption'>Upgrade your account to add more connections</span> : null}
          </div>
          <div>
            <button type='button' className='btn btn-outline-primary mm-button btn-lg' onClick={addAccount}>
              {needUpgrade || reviewSubscriptionFlag ? 'Upgrade Plan' : 'Add Account'}
            </button>
          </div>
        </div>
      </div>
      {Object.entries(accountsByStatus).map(([status, groupArr], i) => (
        <div key={i}>
          {groupArr.map((group: AccountsByProvider, index: number) => (
            <div key={index}>
              <div className={['card mm-setting-card', getStatusClassName(status)].join(' ')}>
                {status === 'error' && (
                  <div className='row pb-3 align-items-center no-gutters fix-connection-sec'>
                    <div className='col-6 text-danger'>
                      <span>Connection Error</span>
                    </div>
                    <div className='col-6 mt-2 text-md-right'>
                      <button
                        type='button'
                        className='btn btn-outline-primary mm-button btn-lg'
                        onClick={() => handleConnectAccount(group.accounts[0].id)}
                      >
                        Fix Connection
                      </button>
                    </div>
                  </div>
                )}
                {status === 'warning' && (
                  <div className='row pb-3 align-items-center no-gutters fix-connection-sec'>
                    <div className='col-12 col-md-6 text-warning'>
                      <span>Needs Attention</span>
                    </div>
                    <div className='col-12 col-md-6 mt-2 text-md-right'>
                      <button
                        type='button'
                        className='btn btn-outline-primary mm-button btn-lg'
                        onClick={() => handleConnectAccount(group.accounts[0].id)}
                      >
                        Fix Connection
                      </button>
                    </div>
                  </div>
                )}

                <div className={['row pb-2 pt-1 align-items-center', status === 'error' ? 'pt-4' : ''].join(' ')}>
                  <div className='col-10 col-md-7'>
                    <div>
                      <img
                        src={group.accounts[0].providerLogo || DefaultAvatar}
                        className='mr-3 mr-md-4 accounts-provider-logo'
                        alt={`${group.provider_name} logo`}
                      />
                      <span className='mm-account-overview__block-title'>{group.provider_name}</span>
                    </div>
                  </div>
                  {/* TODO Refresh single account when API is ready
                        <div className='col-2 col-md-1 order-md-2 text-right'>
                          <Refresh />
                        </div>*/}
                  <div className='col-12 col-md-5 order-md-1 text-md-right pt-2 pt-md-0'>
                    <small className='text--grayText'>
                      Last updated {getRelativeDate(accountList[0].balancesFetchedAt)}
                    </small>
                  </div>
                </div>

                {group.accounts?.map((account: Account, accountIndex: number) => {
                  return (
                    <AccountRow key={accountIndex} account={account} reviewSubscriptionFlag={reviewSubscriptionFlag} />
                  );
                })}

                <div className='row py-3 align-items-center no-gutters'>
                  <div className='col-12 col-md-6'>
                    {!reviewSubscriptionFlag ? (
                      <div className='mm-account-overview__update-link mb-3 mb-md-0'>
                        <span
                          className='purple-links update-credentials'
                          onClick={() => handleConnectAccount(group.accounts[0].id)}
                          role='button'
                        >
                          Update Credentials
                        </span>
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                  <div className='col-12 col-md-6 mt-2 text-md-right'>
                    <button
                      className='btn text-danger mm-button__flat mm-account-overview__delete-link '
                      onClick={() => {
                        removeAccounts(group.accounts);
                      }}
                      disabled={deleting}
                    >
                      {deleting ? (
                        <span className='spinner-grow spinner-grow-sm' role='status' aria-hidden='true' />
                      ) : null}
                      <span className={'ml-1'}> {deleting ? 'Deleting...' : 'Delete account and remove data'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
      <FastLinkModal
        fastLinkModal={fastlinkModal}
        fastLinkOptions={fastLinkOptions}
        handleSuccess={handleConnectAccountSuccess}
      />
    </>
  );
};

export const AccountRow: React.FC<AccountRowProps> = ({ account, reviewSubscriptionFlag }) => {
  const { mmToast } = useToast();
  const dispatch = useAuthDispatch();
  const [deleting, setDeleting] = useState<boolean>(false);

  const deleteAccount = async (id: number) => {
    setDeleting(true);
    const { error } = await deleteAccountById({ dispatch, id });
    if (error) {
      mmToast('Error occurred deleting account', { type: 'error' });
    }
    setDeleting(false);
  };

  return (
    <div className='row py-3 align-items-center no-gutters'>
      <div className='col-6 col-md-8'>
        {/*TODO Ability to switch accounts on or off (needs API)*/}
        {/*<span className='mm-switch-block mr-md-2'>
            <input type='checkbox' className='mm-switch-input' id={`mc3-${account.id}`} name='Switch' />
            <label className='mm-switch' htmlFor={`mc3-${account.id}`}></label>
          </span>*/}
        <Link className='gray-links' to={`/account-details/${account.id}`} aria-label='Account Details'>
          {account.accountName} {account.accountNumber ? ` (${account.accountNumber.slice(-4)})` : null}
        </Link>
      </div>
      <div className='col-3 col-md-2'>${numberWithCommas(fNumber(account.balance, 2))}</div>
      <div className='col-3 col-md-2'>
        <div className='float-right'>
          {!reviewSubscriptionFlag ? (
            <Link to={`/account-details/${account.id}`} aria-label='Edit Account'>
              <IconEdit className='edit-icon' />
            </Link>
          ) : null}
          {deleting ? (
            <span className='spinner-grow spinner-grow-sm m-1' role='status' aria-hidden='true' />
          ) : (
            <DeleteIcon className='ml-2 ml-md-3 trash-icon' onClick={() => deleteAccount(account.id)} />
          )}
        </div>
      </div>
    </div>
  );
};

export const SubscriptionConnectionWarning: React.FC<SubscriptionConnectionWarningProps> = ({
  availableConnectedAccounts,
  availableManualAccounts,
}) => {
  return (
    <div className='row'>
      <div className='subs-ended-msg-box'>
        <div className='subs-ended-left'>
          <h4>Too many connections for current plan!</h4>
          <p>
            Your current plan only allows for {availableConnectedAccounts} connections, please remove connections to
            continue using Money Minx.
          </p>
        </div>
        <span className='warning-icon'>
          <SubscriptionWarning />
        </span>
      </div>
    </div>
  );
};

const AccountDialogBox: React.FC<AccountDialogBoxProps> = ({
  verifyAccountNumbers,
  availableConnectedAccounts,
  availableManualAccounts,
  manualAccountList,
  accountList,
}) => {
  const disable =
    availableManualAccounts === 'Unlimited' ||
    (manualAccountList.length <= availableManualAccounts && accountList.length <= availableConnectedAccounts)
      ? false
      : true;
  const connectedAccountDiff = accountList.length - parseInt(availableConnectedAccounts as string, 10);
  const manualAccountDiff = manualAccountList.length - parseInt(availableManualAccounts as string, 10);

  return (
    <div className='action-overlay'>
      <div className='subscription-bottom-text'>
        <div className='subs-content one'>
          <a href='/subscription'>
            <span className='btn-change-plan'>
              <BackArrow /> <span className='hide-sm'>Change Plan</span>
            </span>
          </a>
        </div>
        <div className='subs-content three'>
          <p>
            Remove {connectedAccountDiff > 0 ? connectedAccountDiff : 0} connected accounts and{' '}
            {manualAccountDiff > 0 ? manualAccountDiff : 0} manual accounts to keep current plan.
          </p>
        </div>
        <div className='subs-content four'>
          <button
            className='finish-btn'
            disabled={disable}
            onClick={(event) => {
              verifyAccountNumbers(event);
            }}
          >
            Finish
          </button>
        </div>
      </div>
    </div>
  );
};
