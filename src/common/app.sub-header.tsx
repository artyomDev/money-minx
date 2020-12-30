import React, { useEffect, useRef, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';

import { Account } from 'auth/auth.types';
import { appRouteConstants } from 'app/app-route.constant';
import { getAccountWithProvider } from 'api/request.api';

import { fNumber, numberWithCommas } from './number.helper';
import { getRelativeDate } from './moment.helper';
import { getCurrencySymbol } from './currency-helper';
import moment from 'moment';

export interface AppSubHeaderProps {
  AccountDetails?: Account;
}

const AppSubHeader: React.FC<AppSubHeaderProps> = ({ AccountDetails }) => {
  const history = useHistory();
  const [successAccounts, setSuccessAccounts] = useState<Account[]>([]);
  const [warningAccounts, setWarningAccounts] = useState<Account[]>([]);
  const [errorAccounts, setErrorAccounts] = useState<Account[]>([]);
  const dropdownToggle = useRef(null);

  useEffect(() => {
    const fetchCurrentAccount = async () => {
      const { data, error } = await getAccountWithProvider();
      if (!error) {
        const successAccounts = data.filter((acc: Account) => (
          acc.isManual ||
          acc.providerAccount.status === 'LOGIN_IN_PROGRESS' ||
          acc.providerAccount.status === 'IN_PROGRESS' ||
          acc.providerAccount.status === 'PARTIAL_SUCCESS' ||
          (acc.providerAccount.status === 'SUCCESS' && acc.providerAccount.dataset?.[0]?.nextUpdateScheduled >= moment().toISOString())));
        const warningAccounts = data.filter((acc: Account) => (
          (!acc.isManual && acc.providerAccount.status === 'USER_INPUT_REQUIRED') ||
            (!acc.isManual && acc.providerAccount.status === 'SUCCESS' && acc.providerAccount.dataset?.[0]?.nextUpdateScheduled < moment().toISOString())
        ));
        const errorAccounts = data.filter((acc: Account) => (
          !acc.isManual &&
          (acc.providerAccount.status === 'FAILED' || !acc.providerAccount.status)));
        setSuccessAccounts(successAccounts);
        setWarningAccounts(warningAccounts);
        setErrorAccounts(errorAccounts);
      }
    };
    fetchCurrentAccount();
  }, [AccountDetails]);

  const clickElement = (dropdownToggle: any) => {
    dropdownToggle.current?.click();
  };

  return (
    <div className='left-box d-flex align-items-center float-lg-left'>
      <button className='mm-btn-primary mm-btn-animate plus-btn' onClick={() => history.push(appRouteConstants.auth.CONNECT_ACCOUNT)}>Add Account</button>
      <div className='myaccount-drop'>
        <Dropdown className='m-l-4'>
          <Dropdown.Toggle className='dropdown-toggle my-accounts' ref={dropdownToggle}>My Accounts</Dropdown.Toggle>
          <Dropdown.Menu className='dropdown-menu'>
            <div className='dropdown-box'>
              {errorAccounts.length > 0 &&
                <div>
                  <div className='dropdown-head'>
                    <h4>Connection Error</h4>
                  </div>
                  <ul className='error'>
                    {errorAccounts.map((account: Account, index: number) => {
                      return (
                        <li key={index}>
                          <Link to={`/account-details/${account.id}`} onClick={() => clickElement(dropdownToggle)}>
                            <div className='pr-1'>
                              <h5>{account.accountName}</h5>
                              <span>{account.balancesFetchedAt !== null ?  getRelativeDate(account.balancesFetchedAt) : ''}</span>
                            </div>
                            <div>{getCurrencySymbol(account.currency)}{numberWithCommas(fNumber(account.balance, 2))}</div>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                  <hr className='hr-darkBg' />
                </div>
              }
              {warningAccounts.length > 0 &&
                <div>
                  <div className='dropdown-head'>
                    <h4 className='attention'>Needs Attention</h4>
                  </div>
                  <ul className='warning'>
                    {warningAccounts.map((account: Account, index: number) => {
                      return (
                        <li key={index}>
                          <Link to={`/account-details/${account.id}`} onClick={() => clickElement(dropdownToggle)}>
                            <div>
                              <h5>{account.accountName}</h5>
                              <span>{account.balancesFetchedAt !== null ?  getRelativeDate(account.balancesFetchedAt) : ''}</span>
                            </div>
                            <div>{getCurrencySymbol(account.currency)}{numberWithCommas(fNumber(account.balance, 2))}</div>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                  <hr className='hr-darkBg' />
                </div>
              }
              {successAccounts.length > 0 &&
                <ul className='success'>
                  {successAccounts.map((account: Account, index: number) => {
                    return (
                      <li key={index}>
                        <Link to={`/account-details/${account.id}`} onClick={() => clickElement(dropdownToggle)}>
                          <div className='pr-1'>
                            <h5>{account.accountName}</h5>
                            <span>{account.balancesFetchedAt !== null ?  getRelativeDate(account.balancesFetchedAt) : ''}</span>
                          </div>
                          <div>{getCurrencySymbol(account.currency)}{numberWithCommas(fNumber(account.balance, 2))}</div>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              }
            </div>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default AppSubHeader;
