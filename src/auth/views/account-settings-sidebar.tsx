import { Link } from 'react-router-dom';
import React, { createRef, useCallback, useEffect, useState } from 'react';

import { Dictionary } from 'lodash';
import { Account } from 'auth/auth.types';
import { setAccountSuccess } from 'auth/auth.actions';
import { groupByProviderName } from 'auth/auth.helper';
import useSearchParam from 'auth/hooks/useSearchParam';
import { fetchConnectionInfo } from 'auth/auth.service';
import { getLatestProviderAccounts } from 'api/request.api';
import { ReactComponent as LogoImg } from 'assets/icons/logo.svg';
import { useAuthState, useAuthDispatch } from 'auth/auth.context';
import { ReactComponent as SecurityIcon } from 'assets/images/signup/security.svg';

import AccountSettingForm from './inc/account-setting-form';
import AccountSettingsSidebarSkeleton from './inc/account-settings-sidebar-skeleton';

interface Props {
  setFinish?: () => void;
  closeSidebar?: () => void;
  selectedAccount?: Account;
}

const AccountSettingsSideBar: React.FC<Props> = ({ setFinish, closeSidebar, selectedAccount }) => {
  const dispatch = useAuthDispatch();
  const { accounts } = useAuthState();
  const [providerName, setProviderName] = useState('');
  const [reloadCounter, setReloadCounter] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const [clickEvent, setClickEvent] = useState<boolean>(false);
  const [currentAccount, setCurrentAccount] = useState<Account>();
  const [completedProviderName, setCompletedProviderName] = useState<string[]>([]);
  const [currentProviderAccounts, setCurrentProviderAccounts] = useState<Account[]>([]);
  const [accountsByProviderName, setAccountsByProviderName] = useState<Dictionary<Account[]>>({});

  const from = useSearchParam('from');
  const isFromFastlink = from === 'fastLink';

  /**
   * @description we will avoid the fetch connection info call
   * @if from fastlink and if initial value
   * i.e reload counter will be 0
   */
  useEffect(() => {
    if (!isFromFastlink && reloadCounter) {
      const getUser = async () => {
        await fetchConnectionInfo({ dispatch });
      };

      getUser();
    }
  }, [dispatch, reloadCounter, isFromFastlink]);

  /**
   * @if from fastlink and hit next so that reload counter is increased
   * Call the latest provider accounts
   */
  useEffect(() => {
    (async () => {
      if (isFromFastlink && reloadCounter) {
        const { error, data } = await getLatestProviderAccounts();
        if (!error) {
          dispatch(setAccountSuccess(data));
        }
      }
    })();
  }, [dispatch, isFromFastlink, reloadCounter]);

  /**
   * if accounts
   * accounts[0] for current account
   * get completed provider names
   * set current provider accounts
   */
  useEffect(() => {
    if (accounts?.length) {
      setCurrentAccount(accounts[0]);
      const accountsByProvider = groupByProviderName(accounts);
      setAccountsByProviderName(accountsByProvider);

      const completedProviders = Object.keys(accountsByProvider).filter((pName) =>
        accountsByProvider[pName].every((acc) => acc.accountDetails?.overridden === true)
      );

      setCompletedProviderName(completedProviders);

      const [curProviderName] = Object.keys(accountsByProvider);
      setProviderName(curProviderName);

      const curProviderAccounts = accountsByProvider[curProviderName];
      setCurrentProviderAccounts(curProviderAccounts);
    }
  }, [accounts]);

  /**
   * Get the first Non overridden account
   */
  useEffect(() => {
    if (accountsByProviderName) {
      const curProviderAccounts = accountsByProviderName[providerName];
      setCurrentProviderAccounts(curProviderAccounts);
      const firstNonOverriddenAccount = curProviderAccounts?.find((acc) => acc.accountDetails?.overridden !== true);

      if (firstNonOverriddenAccount) {
        return setCurrentAccount(firstNonOverriddenAccount);
      }

      if (curProviderAccounts && clickEvent) {
        return setCurrentAccount(curProviderAccounts[0]);
      }
    }
  }, [providerName, accountsByProviderName, clickEvent]);

  /**
   * set completed account id's
   */
  useEffect(() => {
    if (accounts) {
      const completedIds = accounts.filter((acc) => acc.accountDetails?.overridden).map((item) => item.id);
      setCompleted(completedIds);
    }
  }, [accounts]);

  /**
   * If accounts of the current provider is overridden goto next provider
   * If nextProvider not found set finish true
   */
  useEffect(() => {
    if (currentProviderAccounts && accountsByProviderName && !clickEvent) {
      if (currentProviderAccounts.every((acc) => acc.accountDetails?.overridden)) {
        const pName = currentProviderAccounts[0]?.providerName;
        const providerIndex = Object.keys(accountsByProviderName).indexOf(pName);
        const nextProviderName = Object.keys(accountsByProviderName)[providerIndex + 1];

        if (nextProviderName) {
          setProviderName(nextProviderName);

          return setCurrentProviderAccounts(accountsByProviderName[nextProviderName]);
        }

        if (currentProviderAccounts.length) {
          return setFinish?.();
        }
      }
    }
  }, [currentProviderAccounts, accountsByProviderName, clickEvent, setFinish]);

  if (!accounts || !currentAccount || !currentProviderAccounts) {
    return <AccountSettingsSidebarSkeleton />;
  }

  const handleProviderChange = (provider: string) => {
    setClickEvent(true);
    setProviderName(provider);
  };

  const handleChangeCurrentAccount = (curAccount: Account) => {
    setCurrentAccount(curAccount);
  };

  const getProviderClass = (pName: string) => {
    if (providerName === pName) {
      return ' selected';
    }

    if (completedProviderName.includes(pName)) {
      return ' completed';
    }

    return '';
  };

  return (
    <div className='bg-white credentials-wrapper account-setting'>
      {selectedAccount && (
        <div className='close-icon' onClick={closeSidebar} role='button'>
          ✕
        </div>
      )}

      <div className='credentials-content'>
        <Link to='/net-worth' className='logo-img-wrapper'>
          <LogoImg className='auth-logo' />
        </Link>
        {selectedAccount ? (
          selectedAccount.isManual ? (
            <div className='top-content-wrap'>
              <h2>Manual accounts</h2>
              <p>
                Manual accounts are offline accounts that you manage. Once you add the account, you will ba able to
                manage the value, holdings and transactions for this account.
              </p>
            </div>
          ) : (
            <div className='top-content-wrap'>
              <h2>Account Settings</h2>
              <p>
                Take the time to update as much of the detail below as possible. The more accurate this information is
                the better your Money Mink dashboard will be.
              </p>
            </div>
          )
        ) : (
          <div className='top-content-wrap'>
            <h2>Organize accounts</h2>
            <p>
              Great! You connected your accounts. Now you can organize them to get better insights into your portfolio.
            </p>
          </div>
        )}

        <div className='form-wrap'>
          {!selectedAccount && (
            <>
              <ul className='bank-list'>
                {accountsByProviderName
                  ? Object.keys(accountsByProviderName).map((pName, index) => {
                      const [account] = accountsByProviderName[pName];

                      return (
                        <li
                          key={index}
                          onClick={() => handleProviderChange(pName)}
                          role='button'
                          className={getProviderClass(pName)}
                        >
                          <Link to='#'>
                            {account.providerName ? (
                              account.providerLogo ? (
                                <img src={account.providerLogo} alt={pName} />
                              ) : (
                                pName
                              )
                            ) : (
                              <LogoImg className='auth-logo' />
                            )}
                          </Link>
                        </li>
                      );
                    })
                  : null}
              </ul>

              <div className='form-heading'>
                <AccountNameList
                  completedIds={completed}
                  currentAccount={currentAccount}
                  currentProviderAccounts={currentProviderAccounts}
                  changeCurrentAccount={handleChangeCurrentAccount}
                />
              </div>
            </>
          )}

          <AccountSettingForm
            currentAccount={selectedAccount ? selectedAccount : currentAccount}
            handleReload={() => setReloadCounter((c) => c + 1)}
            isFromAccount={!!selectedAccount}
            closeSidebar={closeSidebar}
          />

          <p className='flex-box learn-more-security'>
            <SecurityIcon />
            <a href='/security' target='_blank' className='purple-links'>
              Learn about our security
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsSideBar;

interface AccountNameListProps {
  currentProviderAccounts: Account[];
  currentAccount: Account;
  completedIds: number[];
  changeCurrentAccount: (curAccount: Account) => void;
}

export const AccountNameList: React.FC<AccountNameListProps> = ({
  completedIds,
  currentAccount,
  changeCurrentAccount,
  currentProviderAccounts,
}) => {
  const refList: any = [];

  currentProviderAccounts.forEach((currentProviderAccount) => {
    refList[currentProviderAccount.id] = createRef();
  });

  const scrollToCategory = useCallback(
    (id: number) => {
      if (refList.length) {
        refList[id]?.current.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      }
    },
    [refList]
  );

  useEffect(() => {
    scrollToCategory(currentAccount.id);
  }, [scrollToCategory, currentAccount]);

  const getAccountClass = (accId: number) => (currentAccount?.id === accId ? 'account-btn active' : 'account-btn');
  const completedClass = (accId: number) => (completedIds.includes(accId) ? 'completed' : '');

  return (
    <ul className='nav'>
      {currentProviderAccounts.map((providerAccount, index) => {
        return (
          <li key={index} ref={refList[providerAccount.id]}>
            <button
              className={`${getAccountClass(providerAccount.id)} ${completedClass(providerAccount.id)}`}
              onClick={() => changeCurrentAccount(providerAccount)}
            >
              {providerAccount.accountName}
            </button>
          </li>
        );
      })}
    </ul>
  );
};
