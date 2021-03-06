import { Dropdown } from 'react-bootstrap';
import ReactDatePicker from 'react-datepicker';
import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import { Account } from 'auth/auth.types';
import { getAccount } from 'api/request.api';
import useSettings from 'setting/hooks/useSettings';
import { getCurrencySymbol } from 'common/currency-helper';
import { numberWithCommas, fNumber } from 'common/number.helper';
import { arrGroupBy, enumerateStr, serialize } from 'common/common-helper';
import { AccountCategory, TimeIntervalEnum } from 'networth/networth.enum';
import { initialState, useNetworthDispatch, useNetworthState } from 'networth/networth.context';
import { getDateString, getMonthYear, getRelativeDate, parseDateFromString } from 'common/moment.helper';
import {
  clearFilter,
  setFilterToDate,
  setFilterAccount,
  setFilterFromDate,
  setFilterCategories,
  setFilterAccountType,
  setFilterTimeInterval,
} from 'networth/networth.actions';
import { NetworthFilterProps, NetworthState, TFilterKey } from 'networth/networth.type';

const NetworthFilter = (props: NetworthFilterProps) => {
  const dispatch = useNetworthDispatch();
  const [currentAccount, setCurrentAccount] = useState<Account[]>();
  const { data } = useSettings();

  const networthState = useNetworthState();
  const { fCategories, fTypes, fAccounts, fFromDate, fToDate, fTimeInterval, networth } = networthState;

  useEffect(() => {
    const fetchCurrentAccount = async () => {
      const { data, error } = await getAccount();

      if (!error) {
        setCurrentAccount(data);
      }
    };

    fetchCurrentAccount();
  }, []);

  const fromInterval = networth?.[0].interval || '';
  const fromDate = parseDateFromString(fromInterval);

  // need to set current time zone value to the filter
  // we will pass the utc to server but need to set the value in current time zone
  const onChange = (option: string, date: any) => {
    if (option === 'start') {
      props.handleLoad();

      return dispatch(setFilterFromDate(getDateString(date)));
    }

    if (option === 'end') {
      if (fFromDate !== undefined && getDateString(date) > fFromDate) {
        props.handleLoad();

        return dispatch(setFilterToDate(getDateString(date)));
      }
    }
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.handleLoad();

    return dispatch(setFilterCategories(event.target.value));
  };

  const handleAccountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.handleLoad();

    dispatch(setFilterAccount(+event.target.value));
  };

  const handleAccountTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.handleLoad();

    dispatch(setFilterAccountType(event.target.value));
  };

  const handleIntervalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.handleLoad();

    dispatch(setFilterTimeInterval(event.target.value as TimeIntervalEnum));
  };

  if (!currentAccount) {
    return (
      <div className='row'>
        <div className='col-12 dropdowns-container'>
          <div className='dflex-center mb-15'>
            <Skeleton width={265} height={50} count={3} />
          </div>
        </div>
      </div>
    );
  }

  const clearNetworthFilter = () => {
    return dispatch(clearFilter());
  };

  const hasFiltered = () => {
    const filterKey: TFilterKey[] = ['fCategories', 'fTypes', 'fAccounts', 'fToDate', 'fFromDate', 'fTimeInterval'];

    return filterKey.some((key) => isFiltered(key));
  };

  const isFiltered = (key: keyof NetworthState) => {
    if (serialize(networthState[key] as any) !== serialize(initialState[key] as any)) {
      return true;
    }
    return false;
  };

  const fc = (key: keyof NetworthState) => (isFiltered(key) ? 'filtered' : '');

  const currentAccountByType = arrGroupBy(currentAccount, 'category.mmAccountType');

  return (
    <div className='row'>
      <div className='col-12 dropdowns-container'>
        <div className='dflex-center justify-space-between flex-wrap-custom mb-15'>
          {hasFiltered() ? (
            <button className='btn btn-outline-danger clear-filter' onClick={clearNetworthFilter}>
              Clear Filters
            </button>
          ) : null}
          <Dropdown className='drop-box'>
            <Dropdown.Toggle variant='' className={fc('fCategories')}>
              All Categories
            </Dropdown.Toggle>
            <Dropdown.Menu className='mm-dropdown-menu'>
              <ul className='checkbox-list'>
                {enumerateStr(AccountCategory).map((cat, index) => {
                  return (
                    <li key={index}>
                      <label>
                        <input
                          name='category'
                          type='checkbox'
                          aria-describedby={cat}
                          value={cat}
                          aria-checked={fCategories?.includes(cat)}
                          checked={fCategories?.includes(cat)}
                          onChange={handleCategoryChange}
                        />
                        <span className='pl-3'>{cat}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown className='drop-box'>
            <Dropdown.Toggle variant='' className={fc('fAccounts')}>
              All Accounts
            </Dropdown.Toggle>
            <Dropdown.Menu className='mm-dropdown-menu dd-my-accounts'>
              <div className='dropdown-box'>
                <ul className='success'>
                  {currentAccount.map((account, index) => {
                    return (
                      <li key={account.id}>
                        <div className='account-filter-dd-row'>
                          <label>
                            <input
                              name='accBox'
                              type='checkbox'
                              aria-describedby='Investment assets'
                              value={account.id}
                              aria-checked={fAccounts.includes(account.id)}
                              checked={fAccounts.includes(account.id)}
                              onChange={handleAccountChange}
                            />
                            <span />
                          </label>
                          <div className='pr-1'>
                            <h5>{account.accountName}</h5>
                            <span>{getRelativeDate(account.balancesFetchedAt)}</span>
                          </div>
                          <div className='account-filter-dd-balance'>
                            {data?.currency ? getCurrencySymbol(data.currency) : ''}
                            {numberWithCommas(fNumber(account.balance, 2))}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown className='drop-box'>
            <Dropdown.Toggle variant='' className={fc('fTypes')}>
              All Types
            </Dropdown.Toggle>
            <Dropdown.Menu className='mm-dropdown-menu'>
              <ul className='checkbox-list'>
                {Object.keys(currentAccountByType).map((accountName, index) => {
                  return (
                    <li key={index}>
                      <label>
                        <input
                          name='types'
                          type='checkbox'
                          aria-describedby={accountName}
                          value={accountName}
                          aria-checked={fTypes?.includes(accountName)}
                          checked={fTypes?.includes(accountName)}
                          onChange={handleAccountTypeChange}
                        />
                        <span className='pl-3'>{accountName}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown className='drop-box'>
            <Dropdown.Toggle variant='' className={fc('fTimeInterval')}>
              {fTimeInterval || 'Monthly'}
            </Dropdown.Toggle>
            <Dropdown.Menu className='mm-dropdown-menu dropsm'>
              <ul className='radiolist'>
                {enumerateStr(TimeIntervalEnum).map((interval, index) => {
                  return (
                    <li key={interval}>
                      <label>
                        <input
                          type='radio'
                          name='m-list'
                          aria-checked={fTimeInterval === interval}
                          value={interval}
                          checked={fTimeInterval === interval}
                          onChange={handleIntervalChange}
                        />
                        <span>{interval}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </Dropdown.Menu>
          </Dropdown>
          {
            // since filter date will be current timezone string
            // no need to parse this to utc for setting up simply date must work
          }
          <ReactDatePicker
            selected={fFromDate ? new Date(fFromDate) : fromDate}
            onChange={(date) => onChange('start', date)}
            // selectsStart
            startDate={fFromDate ? new Date(fFromDate) : fromDate}
            dateFormat='MM/yyyy'
            showMonthYearPicker
            minDate={new Date('1900-01-01')}
            maxDate={new Date()}
            className='ml-md-3'
            // selectsRange
            customInput={
              <div className='drop-box'>
                <div className='date-box'>
                  <input
                    type='text'
                    className={['month_year', fc('fFromDate')].join(' ')}
                    value={fFromDate ? getMonthYear(fFromDate) : getMonthYear(fromDate)}
                    aria-label='From Date Filter'
                    readOnly
                  />
                </div>
              </div>
            }
          />
          <span className='date-separator'>to</span>
          <ReactDatePicker
            selected={fToDate ? new Date(fToDate) : null}
            onChange={(date) => onChange('end', date)}
            // selectsStart
            startDate={fToDate ? new Date(fToDate) : null}
            dateFormat='MM/yyyy'
            showMonthYearPicker
            minDate={fFromDate ? new Date(fFromDate) : null}
            maxDate={new Date()}
            className='mr-md-3'
            // selectsRange
            customInput={
              <div className='drop-box'>
                <div className='date-box'>
                  <input
                    type='text'
                    className={['month_year', fc('fToDate')].join(' ')}
                    value={getMonthYear(fToDate)}
                    aria-label='To Date Filter'
                    readOnly
                  />
                </div>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default NetworthFilter;
