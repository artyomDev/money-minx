import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';

import CircularSpinner from 'common/components/spinner/circular-spinner';
import DefaultAvatar from 'assets/icons/default-avatar.svg';
import FastLinkModal from 'yodlee/fast-link.modal';
import useCurrentSubscription from 'auth/hooks/useCurrentSubscription';
import useGetSubscription from 'auth/hooks/useGetSubscription';
import useToast from 'common/hooks/useToast';
import useGetFastlink from 'auth/hooks/useGetFastlink';
import { Account } from 'auth/auth.types';
import { events } from '@mm/data/event-list';
import { groupByProviderName } from 'auth/auth.helper';
import { deleteAccounts, deleteAccountById, fetchConnectionInfo } from 'auth/auth.service';
import { appRouteConstants } from 'app/app-route.constant';
import { getRelativeDate } from 'common/moment.helper';
import { pricingDetailConstant } from 'common/common.constant';
import { useAuthDispatch, useAuthState } from 'auth/auth.context';
import { fNumber, numberWithCommas } from 'common/number.helper';
/*import { ReactComponent as Refresh } from 'assets/icons/refresh.svg';*/
import { ReactComponent as DeleteIcon } from 'assets/icons/icon-delete.svg';
import { ReactComponent as IconEdit } from 'assets/icons/icon-edit.svg';
import { ReactComponent as DefaultProviderLogo } from 'assets/icons/mm-default-provider.svg';

import {
  AccountRowProps,
  AccountCardProps,
  ManualAccountProps,
  AccountOverviewProps,
  AccountDialogBoxProps,
  SubscriptionConnectionWarningProps,
} from 'setting/setting.type';
import { ReactComponent as BackIcon } from 'assets/images/subscription/back-btn.svg';
import { ReactComponent as SubscriptionWarning } from 'assets/images/subscription/warning.svg';
import { FastLinkOptionsType } from 'yodlee/yodlee.type';
import { useModal } from 'common/components/modal';
import useAnalytics from 'common/hooks/useAnalytics';

export const AccountOverview: React.FC<AccountOverviewProps> = ({ reviewSubscriptionFlag = false }) => {
  const history = useHistory();
  const { mmToast } = useToast();
  const { accounts } = useAuthState();
  const dispatch = useAuthDispatch();
  const { fetchingCurrentSubscription, currentSubscription } = useCurrentSubscription();
  const { fetchingSubscription, subscription } = useGetSubscription(currentSubscription?.priceId);

  useEffect(() => {
    if (!accounts) {
      const getUser = async () => {
        await fetchConnectionInfo({ dispatch });
      };
      getUser();
    }
  }, [accounts, dispatch]);

  const loading = fetchingCurrentSubscription || fetchingSubscription;

  if (loading || !accounts) {
    return <CircularSpinner />;
  }

  const manualAccounts = accounts.filter((acc) => acc.isManual);
  const connectedAccounts = accounts.filter((acc) => !acc.isManual);

  const numberOfConnectedAccounts = subscription?.details?.[pricingDetailConstant.CONNECTED_ACCOUNT] || 0;
  const numberOfManualAccounts = subscription?.details?.[pricingDetailConstant.MANUAL_ACCOUNT] || 0;

  const verifyAccountNumbers = (event: React.ChangeEvent<any>) => {
    event.preventDefault();
    if (
      numberOfConnectedAccounts === 'Unlimited' ||
      (manualAccounts.length <= numberOfManualAccounts && connectedAccounts.length <= numberOfConnectedAccounts)
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
              <span className='mm-account-overview__block-title'>My own account</span>
            </div>
          </div>
        </div>

        {manualAccountList.map((acc, index) => {
          return <AccountRow account={acc} key={index} reviewSubscriptionFlag={reviewSubscriptionFlag} />;
        })}

        <div className='row py-3 align-items-center'>
          <div className='col-12 col-md-6' />
          <div className='col-12 col-md-6 text-md-right'>
            <button
              className='btn text-danger mm-button__flat mm-account-overview__delete-link '
              onClick={() => {
                removeAccounts(manualAccountList);
              }}
              disabled={deleting}
            >
              {deleting ? <span className='spinner-grow spinner-grow-sm' role='status' aria-hidden='true' /> : null}
              <span className={'ml-1'}> {deleting ? 'Deleting...' : 'Delete account and remove data'}</span>
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
  const location = useLocation();
  const history = useHistory();
  const { event } = useAnalytics();
  const { mmToast } = useToast();
  const dispatch = useAuthDispatch();
  const [deleting, setDeleting] = useState<boolean>(false);
  const needUpgrade = accountList.length >= availableAccounts;
  const accountsByProvider = groupByProviderName(accountList);
  const fastlinkModal = useModal();

  const { error, data, loading } = useGetFastlink();

  if (loading || error || !data) {
    return <CircularSpinner />;
  }

  const fastLinkOptions: FastLinkOptionsType = {
    fastLinkURL: data.fastLinkUrl || '',
    token: data.accessToken || '',
  };

  const handleConnectAccountSuccess = () => {
    location.pathname = appRouteConstants.auth.ACCOUNT_SETTING;

    return history.push(location);
  };

  const handleConnectAccount = () => {
    event(events.connectAccount);

    return fastlinkModal.open();
  };

  let accountsByStatus: AccountByStatus = {
    success: [],
    warning: [],
    error: [],
  };

  for (let p_name in accountsByProvider) {
    let status = accountsByProvider[p_name][0].providerAccount?.status;
    if (
      status === 'LOGIN_IN_PROGRESS' ||
      status === 'IN_PROGRESS' ||
      status === 'PARTIAL_SUCCESS' ||
      status === 'SUCCESS'
    ) {
      accountsByStatus.success.push({ provider_name: p_name, accounts: accountsByProvider[p_name] });
    } else if (status === 'USER_INPUT_REQUIRED') {
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
                    <div className='col-12 col-md-6 text-danger pl-3'>
                      <span>Connection error</span>
                    </div>
                    <div className='col-12 col-md-6 mt-2 text-md-right'>
                      <button type='button' className='btn btn-outline-primary mm-button btn-lg' onClick={handleConnectAccount}>
                        Fix Connection
                      </button>
                    </div>
                  </div>
                )}
                {status === 'warning' && (
                  <div className='row pb-3 align-items-center no-gutters fix-connection-sec'>
                    <div className='col-12 col-md-6 text-warning pl-3'>
                      <span>Needs more info</span>
                    </div>
                    <div className='col-12 col-md-6 mt-2 text-md-right'>
                      <button type='button' className='btn btn-outline-primary mm-button btn-lg' onClick={handleConnectAccount}>
                        Fix Connection
                      </button>
                    </div>
                  </div>
                )}

                <div className={['row pb-2 pt-1 align-items-center', status === 'error' ? 'pt-4' : ''].join(' ')}>
                  <div className='col-10 col-md-6'>
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
                  <div className='col-12 col-md-6 order-md-1 text-md-right pt-2 pt-md-0'>
                    <small className='text-gray'>
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
                        <span className='purple-links update-credentials' onClick={handleConnectAccount}>Update Credentials</span>
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
        {account.accountName} {account.accountNumber ? ` (${account.accountNumber.slice(-4)})` : null}
      </div>
      <div className='col-3 col-md-2'>${numberWithCommas(fNumber(account.balance, 2))}</div>
      <div className='col-3 col-md-2'>
        <div className='float-right'>
          {!reviewSubscriptionFlag ? (
            <Link to={`/account-details/${account.id}`}>
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
          <a
            href='link12'
            onClick={(event) => {
              verifyAccountNumbers(event);
            }}
          >
            <span className='back-btn'>
              <BackIcon />
            </span>
          </a>
        </div>
        <div className='subs-content three'>
          <p>
            You need to delete {connectedAccountDiff > 0 ? connectedAccountDiff : 0} connected accounts and{' '}
            {manualAccountDiff > 0 ? manualAccountDiff : 0} manual to be able to use this plan.
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
