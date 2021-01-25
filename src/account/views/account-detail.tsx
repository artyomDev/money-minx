import ReactDatePicker from 'react-datepicker';
import { Button, Dropdown } from 'react-bootstrap';
import React, { useState, useRef, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import moment from 'moment';
import AppFooter from 'common/app.footer';
import { Account } from 'auth/auth.types';
import { storage } from 'app/app.storage';
import AppHeader from 'common/app.header';
import AppSidebar from 'common/app.sidebar';
import useToast from 'common/hooks/useToast';
import { events } from '@mm/data/event-list';
import MMToolTip from 'common/components/tooltip';
import FastLinkModal from 'yodlee/fast-link.modal';
import { useModal } from 'common/components/modal';
import { useAuthDispatch } from 'auth/auth.context';
import useAnalytics from 'common/hooks/useAnalytics';
import { getRefreshedAccount } from 'auth/auth.service';
import { FastLinkOptionsType } from 'yodlee/yodlee.type';
import { EAccountType } from 'account/enum/account-type';
import { TimeIntervalEnum } from 'networth/networth.enum';
import { ETableType } from 'account/enum/table-type.enum';
import { appRouteConstants } from 'app/app-route.constant';
import { getCurrencySymbol } from 'common/currency-helper';
import { Placeholder } from 'networth/views/inc/placeholder';
import { enumerateStr, parseAmount } from 'common/common-helper';
import AccountSettingsSideBar from 'auth/views/account-settings-sidebar';
import CircularSpinner from 'common/components/spinner/circular-spinner';
import { ReactComponent as InfoIcon } from 'assets/images/signup/info.svg';
import AccountDetailSkeleton from 'account/components/account-detail-skeleton';
import { ReactComponent as NotLinked } from 'assets/images/account/Not Linked.svg';
import { ReactComponent as NeedsInfo } from 'assets/images/account/Needs Info.svg';
import { ReactComponent as SettingsGear } from 'assets/icons/icon-settings-gear.svg';
import { ReactComponent as CheckCircle } from 'assets/images/account/check-circle.svg';
import { ReactComponent as SubscriptionWarning } from 'assets/images/subscription/warning.svg';
import { ReactComponent as CheckCircleGreen } from 'assets/images/account/check-circle-green.svg';
import { getDate, getMonthYear, getRelativeDate, parseDateFromString } from 'common/moment.helper';
import {
  getAccountDetails,
  getAccountHoldings,
  getAccountActivity,
  getFastlinkUpdate,
  getAccountDetailBalances,
} from 'api/request.api';

import AccountTable from './account-table';
import BalanceTable from './balance-table';
import ActivityTable from './activity-table';
import ChartSkeleton from './chart-skeleton';
import AccountBarGraph from './account-bar-graph';
import ActivityDetailsModal from './activity-details.modal';
import AccountSubNavigation from './account-sub-navigation';
import HoldingsDetailsModal from './holdings-details.modal';
import { AccountChartItem, AccountHolingsProps, AccountTransactionsProps, IBalanceData } from '../account.type';

const AccountDetail: React.FC = () => {
  const history = useHistory();
  const { event } = useAnalytics();

  const [openLeftNav, setOpenLeftNav] = useState<boolean>(false);
  const [openRightNav, setOpenRightNav] = useState<boolean>(false);
  const [AccountDetails, setAccountDetails] = useState<Account>();
  const [AccountHoldings, setAccountHoldings] = useState<AccountHolingsProps>();
  const [AccountActivity, setAccountActivity] = useState<AccountTransactionsProps>();
  const [fromDate, setFromDate] = useState<string>();
  const [toDate, setToDate] = useState<string>();
  const [timeInterval, setTimeInterval] = useState<string>('Monthly');
  const [tableType, setTableType] = useState<string>('balance');
  const [dateFromFilterOn, setDateFromFilterOn] = useState<boolean>(false);
  const [dateToFilterOn, setDateToFilterOn] = useState<boolean>(false);
  const [intervalFilterOn, setIntervalFilterOn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterloading, setFilterLoading] = useState<boolean>(false);
  const [accSetting, setAccSetting] = useState<boolean>(false);
  const [newPositonModalOpen, setNewPositonModalOpen] = useState<boolean>(false);
  const [editPositonModalOpen, setEditPositonModalOpen] = useState<boolean>(false);
  const [newActivityModalOpen, setNewActivityModalOpen] = useState<boolean>(false);
  const [editActivityModalOpen, setEditActivityModalOpen] = useState<boolean>(false);
  const [baseCurrency, setBaseCurrency] = useState<boolean>(false);
  const [currencySymbol, setCurrencySymbol] = useState<string>('');
  const [popup, setPopup] = useState<boolean>(false);
  const [fDate, setFDate] = useState<string>('');
  const [fastLinkOptions, setFastLinkOptions] = useState<FastLinkOptionsType>({
    fastLinkURL: '',
    token: { tokenType: 'AccessToken', tokenValue: '' },
    config: { flow: '', configName: 'Aggregation', providerAccountId: 0 },
  });
  const [balanceData, setBalanceData] = useState<IBalanceData>();

  const { pathname } = useLocation();
  const accountId = pathname.split('/')[2];
  const { mmToast } = useToast();
  const fastlinkModal = useModal();
  const dispatch = useAuthDispatch();
  const dropdownToggle = useRef(null);
  const holdingsDetailsModal = useModal();
  const activityDetailsModal = useModal();

  useEffect(() => {
    const fetchAccountDetails = async (accId: string, bCurrency: boolean) => {
      const { data, error } = await getAccountDetails(accId, bCurrency);
      if (!error) {
        setAccountDetails(data);
      }
      if (error?.statusCode === 403) {
        return history.push(appRouteConstants.networth.NET_WORTH);
      }
    };

    fetchAccountDetails(accountId, baseCurrency);

    if (
      (fromDate === undefined && toDate === undefined) ||
      (fromDate !== undefined && toDate !== undefined && new Date(toDate) >= new Date(fromDate))
    ) {
      setFilterLoading(true);
      if (tableType === 'holdings') {
        fetchAccountHoldings(accountId, fromDate, toDate, timeInterval, baseCurrency);
      }
      if (tableType === 'activity') {
        fetchAccountActivity(accountId, fromDate, toDate, timeInterval, baseCurrency);
      }
      if (tableType === 'balance') {
        setFilterLoading(false);
        setLoading(false);
      }
    }
  }, [
    toDate,
    history,
    fromDate,
    accountId,
    tableType,
    accSetting,
    timeInterval,
    baseCurrency,
    newPositonModalOpen,
    editPositonModalOpen,
    newActivityModalOpen,
    editActivityModalOpen,
  ]);

  useEffect(() => {
    if (AccountDetails) {
      setCurrencySymbol(getCurrencySymbol(AccountDetails.currency));
    }
  }, [AccountDetails]);

  /**
   * Get Balances if balance tab is selected
   * @if !balance return
   */
  useEffect(() => {
    (async () => {
      if (tableType !== 'balance') {
        return false;
      }
      setFilterLoading(true);
      const { data, error } = await getAccountDetailBalances({ accountId, baseCurrency });
      setFilterLoading(false);
      if (!error) {
        setBalanceData(data);
      }
    })();
  }, [accountId, tableType, baseCurrency]);

  const handleConnectAccountSuccess = async () => {
    setLoading(true);
    const { error } = await getRefreshedAccount({ dispatch });

    setLoading(false);

    if (error) {
      return mmToast('Error occurred on fetching refreshed account', { type: 'error' });
    }
  };

  const handleConnectAccount = async (accId: number, update: boolean, refresh: boolean) => {
    const { data, error } = await getFastlinkUpdate(accId, update, refresh);

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

  const clickElement = (dToggle: any) => {
    dToggle.current?.click();
  };

  const fetchAccountHoldings = async (
    accountId: string,
    fromDate: any,
    toDate: any,
    timeInterval: string,
    baseCurrency: boolean
  ) => {
    const { data, error } = await getAccountHoldings({ accountId, fromDate, toDate, timeInterval, baseCurrency });
    if (!error) {
      setFDate(data.charts?.[0].interval);
      setAccountHoldings(data);
      setLoading(false);
      setFilterLoading(false);
      if (storage.get('isNew').data) {
        setAccSetting(true);
      }
    }
  };

  const fetchAccountActivity = async (
    accountId: string,
    fromDate: any,
    toDate: any,
    timeInterval: string,
    baseCurrency: boolean
  ) => {
    const { data, error } = await getAccountActivity({ accountId, fromDate, toDate, timeInterval, baseCurrency });
    if (!error) {
      setAccountActivity(data);
      setFilterLoading(false);
    }
  };

  const onChange = (option: string, date: any) => {
    if (option === 'start') {
      setDateFromFilterOn(true);
      setFromDate(getDate(new Date(date)));
    } else if (option === 'end') {
      setDateToFilterOn(true);
      setToDate(getDate(new Date(date)));
    }
  };

  const handleIntervalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIntervalFilterOn(true);
    setTimeInterval(event.target.value);
  };

  const clearFilters = () => {
    setDateFromFilterOn(false);
    setDateToFilterOn(false);
    setIntervalFilterOn(false);
    setToDate(undefined);
    setFromDate(undefined);
    setTimeInterval('Monthly');
    setFilterLoading(false);
  };

  const closeSidebar = () => {
    setAccSetting(false);
    storage.clear('isNew');
  };

  const openNewPositonModal = () => {
    setNewPositonModalOpen(true);
    holdingsDetailsModal.open();
  };

  const openNewActivityModal = () => {
    setNewActivityModalOpen(true);
    activityDetailsModal.open();
  };

  const closeRightNav = () => {
    setOpenRightNav(false);
  };

  const renderCharItem = (chartData: AccountChartItem[]) => {
    return (
      <AccountBarGraph
        data={chartData}
        curInterval=''
        currencySymbol={currencySymbol}
        mmCategory={AccountDetails?.category?.mmCategory}
      />
    );
  };

  const renderChart = () => {
    const hasHoldingChart = AccountHoldings && AccountHoldings.charts && tableType === 'holdings';
    const hasActivityChart = AccountActivity && AccountActivity.charts && tableType === 'activity';
    const hasBalanceChart = tableType === 'balance' && balanceData?.balances;

    const hasEitherChart = hasHoldingChart || hasActivityChart || hasBalanceChart;

    if (!hasEitherChart || filterloading) {
      return <ChartSkeleton />;
    }

    return (
      <div className='chartbox'>
        {AccountHoldings && AccountHoldings.charts && tableType === 'holdings'
          ? renderCharItem(AccountHoldings.charts)
          : null}

        {AccountActivity && AccountActivity.charts && tableType === 'activity'
          ? renderCharItem(AccountActivity.charts.map((b: any) => ({ ...b, value: b.balance || 0 })))
          : null}

        {tableType === 'balance' && balanceData?.balances
          ? renderCharItem(balanceData.balances.map((b) => ({ ...b, value: b.balance || 0 })))
          : null}
      </div>
    );
  };

  const isLiabilities = AccountDetails?.category?.mmCategory === EAccountType.LIABILITIES;

  const renderChartAmount = () => {
    if (tableType === ETableType.HOLDINGS) {
      const curHoldingValue = AccountHoldings?.charts.find((accountHolding) => accountHolding.interval === 'Today')
        ?.value;

      return parseAmount(curHoldingValue || 0, currencySymbol);
    }
    if (tableType === ETableType.BALANCE) {
      const curBalanceAmount = balanceData?.balances?.find((balance) => balance.interval === 'Today')?.balance;

      return parseAmount(curBalanceAmount || 0, currencySymbol);
    }
    if (tableType === ETableType.ACTIVITY) {
      const curAccountValue = (AccountActivity?.charts as any)?.find(
        (accountActivity: any) => accountActivity.interval === 'Today'
      )?.balance;

      return parseAmount(curAccountValue || 0, currencySymbol);
    }
    return parseAmount(0, currencySymbol);
  };

  const hasChartData =
    AccountHoldings?.charts?.length || AccountActivity?.charts?.length || balanceData?.balances?.length;

  let providerStatus;
  if (
    AccountDetails?.isManual === true ||
    (AccountDetails?.providerAccount?.status === 'LOGIN_IN_PROGRESS' &&
      AccountDetails?.providerAccount?.dataset?.[0]?.updateEligibility !== 'DISALLOW_UPDATE') ||
    AccountDetails?.providerAccount?.status === 'IN_PROGRESS' ||
    AccountDetails?.providerAccount?.status === 'PARTIAL_SUCCESS' ||
    (AccountDetails?.providerAccount?.status === 'SUCCESS' &&
      AccountDetails?.providerAccount?.dataset?.[0]?.nextUpdateScheduled >= moment().toISOString()) ||
    (AccountDetails?.providerAccount?.status === 'SUCCESS' &&
      AccountDetails?.providerAccount?.dataset?.[0]?.nextUpdateScheduled === null)
  ) {
    providerStatus = 'GOOD';
  } else if (
    AccountDetails?.providerAccount?.status === 'USER_INPUT_REQUIRED' ||
    (AccountDetails?.providerAccount?.status === 'LOGIN_IN_PROGRESS' &&
      AccountDetails?.providerAccount?.dataset?.[0]?.updateEligibility === 'DISALLOW_UPDATE')
  ) {
    providerStatus = 'ATTENTION_WAIT';
  } else if (
    AccountDetails?.providerAccount?.status === 'SUCCESS' &&
    AccountDetails?.providerAccount?.dataset?.[0]?.nextUpdateScheduled < moment().toISOString()
  ) {
    providerStatus = 'ATTENTION';
  } else if (AccountDetails?.providerAccount?.dataset?.[0]?.additionalStatus === 'INCORRECT_CREDENTIALS') {
    providerStatus = 'ERROR_NEW_CREDENTIALS';
  } else {
    providerStatus = 'ERROR';
  }

  return (
    <div className='mm-setting'>
      <aside className='setting-aside' style={{ left: accSetting ? '0' : '-665px' }}>
        <AccountSettingsSideBar closeSidebar={closeSidebar} selectedAccount={AccountDetails} />
      </aside>
      {accSetting && <div className='backdrop' onClick={closeSidebar} role='button' />}
      <AppHeader
        toggleLeftMenu={() => setOpenLeftNav(!openLeftNav)}
        toggleRightMenu={() => setOpenRightNav(!openRightNav)}
        open={openRightNav}
      />
      {providerStatus === 'ERROR' || providerStatus === 'ERROR_NEW_CREDENTIALS' ? (
        <div className='connection-issue-container error'>
          <span className='connection-status-icon'>
            <SubscriptionWarning />
          </span>
          <div className='connection-issue-left'>
            <div className='connection-label-container'>
              <span className='label'>Connection Lost</span>
              <span className='time'>
                Last updated {getRelativeDate(AccountDetails?.providerAccount?.dataset[0]?.lastUpdated.toString())}
              </span>
            </div>
            <div className='connection-error-msg'>
              {providerStatus === 'ERROR_NEW_CREDENTIALS' ? (
                <span>Please update your account credentials</span>
              ) : (
                <span>Reauthorize your connection to continue syncing your account</span>
              )}
            </div>
            <div>
              <button
                type='button'
                className='mm-btn-animate mm-btn-white'
                onClick={() => handleConnectAccount(AccountDetails?.id || 0, true, false)}
              >
                Fix Connection
              </button>
            </div>
          </div>
        </div>
      ) : providerStatus === 'ATTENTION' || providerStatus === 'ATTENTION_WAIT' ? (
        <div className='connection-issue-container warning'>
          <span className='connection-status-icon'>
            <SubscriptionWarning />
          </span>
          <div className='connection-issue-left'>
            <div className='connection-label-container'>
              <span className='label'>Refresh Connection</span>
              <span className='time'>
                Last updated {getRelativeDate(AccountDetails?.providerAccount?.dataset[0]?.lastUpdated.toString())}
              </span>
            </div>
            <div className='connection-error-msg'>
              {providerStatus === 'ATTENTION_WAIT' ? (
                <span>
                  For security reasons, your account cannot be refreshed at this time. Please try again in 15 minutes.
                </span>
              ) : (
                <span>Additional security information required to complete updating your account.</span>
              )}
            </div>
            {providerStatus !== 'ATTENTION_WAIT' ? (
              <div>
                <button
                  type='button'
                  className='mm-btn-animate mm-btn-white'
                  onClick={() => handleConnectAccount(AccountDetails?.id || 0, false, true)}
                >
                  Fix Connection
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
      {!loading && AccountDetails && (
        <AccountSubNavigation
          AccountDetails={AccountDetails}
          baseCurrency={baseCurrency}
          toggleBaseCurrency={() => setBaseCurrency(!baseCurrency)}
        />
      )}
      <hr className='mt-0' />
      <AppSidebar openLeft={openLeftNav} openRight={openRightNav} />
      <div className='mm-slider-bg-overlay' onClick={closeRightNav} role='button' />
      {loading ? (
        <AccountDetailSkeleton />
      ) : (
        <div className='content-wrapper'>
          <div className='container'>
            <div className='mm-account'>
              <div className='mm-account__selection mb-3'>
                <div className='mm-account__selection--info'>
                  <SettingsGear className='float-left mr-2 settings-gear-button' onClick={() => setAccSetting(true)} />
                  <ul>
                    <li>{AccountDetails?.accountName}</li>
                    {AccountDetails?.accountNumber ? <li>{AccountDetails?.accountNumber.slice(4)}</li> : null}
                    <li>{AccountDetails?.category?.mmCategory}</li>
                    <li>{AccountDetails?.category?.mmAccountType}</li>
                    {AccountDetails?.category?.mmAccountSubType && (
                      <li>{AccountDetails?.category?.mmAccountSubType}</li>
                    )}
                    <li>{AccountDetails?.accountDetails?.currency}</li>
                  </ul>
                </div>
                <div className='d-md-flex justify-content-between mt-3'>
                  <div className='d-flex'>
                    <div className='dflex-center'>
                      {(dateFromFilterOn || dateToFilterOn || intervalFilterOn) && (
                        <button type='button' className='btn btn-outline-danger clear-filter' onClick={clearFilters}>
                          Clear Filters
                        </button>
                      )}
                      <ReactDatePicker
                        selected={fromDate ? new Date(fromDate) : fDate ? parseDateFromString(fDate) : null}
                        onChange={(date) => onChange('start', date)}
                        // selectsStart
                        startDate={fromDate ? new Date(fromDate) : fDate ? parseDateFromString(fDate) : null}
                        dateFormat='MM/yyyy'
                        showMonthYearPicker
                        minDate={new Date('1900-01-01')}
                        maxDate={new Date()}
                        // selectsRange
                        customInput={
                          <div className='drop-box'>
                            <div className='date-box'>
                              <input
                                type='text'
                                className={['month_year', dateFromFilterOn ? 'active' : ''].join(' ')}
                                value={
                                  fromDate
                                    ? getMonthYear(fromDate)
                                    : fDate
                                    ? getMonthYear(fDate)
                                    : getMonthYear(new Date())
                                }
                                readOnly
                              />
                            </div>
                          </div>
                        }
                      />
                      <span
                        className={['date-separator', dateFromFilterOn && dateToFilterOn ? 'active' : ''].join(' ')}
                      >
                        to
                      </span>
                      <ReactDatePicker
                        selected={toDate ? new Date(toDate) : null}
                        onChange={(date) => onChange('end', date)}
                        // selectsStart
                        startDate={toDate ? new Date(toDate) : null}
                        dateFormat='MM/yyyy'
                        showMonthYearPicker
                        minDate={fromDate ? new Date(fromDate) : null}
                        maxDate={new Date()}
                        // selectsRange
                        customInput={
                          <div className='drop-box'>
                            <div className='date-box'>
                              <input
                                type='text'
                                className={['month_year', dateToFilterOn ? 'active' : ''].join(' ')}
                                value={getMonthYear(toDate)}
                                readOnly
                              />
                            </div>
                          </div>
                        }
                      />
                      <Dropdown className={['drop-box m-l-2', intervalFilterOn ? 'active' : ''].join(' ')}>
                        <Dropdown.Toggle variant='' ref={dropdownToggle}>
                          {timeInterval}
                        </Dropdown.Toggle>
                        <Dropdown.Menu className='mm-dropdown-menu dropsm'>
                          <ul className='radiolist'>
                            {enumerateStr(TimeIntervalEnum).map((interval, index) => {
                              return (
                                <li key={index}>
                                  <label>
                                    <input
                                      type='radio'
                                      name='m-list'
                                      aria-checked={timeInterval === interval}
                                      value={interval}
                                      checked={timeInterval === interval}
                                      onChange={handleIntervalChange}
                                      onClick={() => clickElement(dropdownToggle)}
                                    />
                                    <span>{interval}</span>
                                  </label>
                                </li>
                              );
                            })}
                          </ul>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                    <div className='mm-account__selection--type'>
                      {AccountDetails?.syncError ? (
                        <div className='attention-section'>
                          <NeedsInfo />
                          <span className='needsInfo'>Processing</span>
                        </div>
                      ) : (
                        <>
                          {AccountDetails?.isManual ? (
                            <>
                              <CheckCircle />
                              <span className='manual'>Manual</span>
                            </>
                          ) : (
                            <>
                              {providerStatus === 'GOOD' ? (
                                <>
                                  <CheckCircleGreen />
                                  <span className='good'>Good</span>
                                </>
                              ) : providerStatus === 'ATTENTION' || providerStatus === 'ATTENTION_WAIT' ? (
                                <div
                                  className='attention-section'
                                  onMouseEnter={() => setPopup(true)}
                                  onMouseLeave={() => setPopup(false)}
                                >
                                  <NeedsInfo />
                                  <span className='needsInfo'>Attention</span>
                                  {popup && (
                                    <Popup
                                      AccountDetails={AccountDetails}
                                      handleConnectAccount={() =>
                                        handleConnectAccount(AccountDetails?.id || 0, false, true)
                                      }
                                      providerStatus={providerStatus}
                                    />
                                  )}
                                </div>
                              ) : AccountDetails ? (
                                <div
                                  className='attention-section'
                                  onMouseEnter={() => setPopup(true)}
                                  onMouseLeave={() => setPopup(false)}
                                >
                                  <NotLinked />
                                  <span className='attention'>Error</span>
                                  {popup && (
                                    <Popup
                                      AccountDetails={AccountDetails}
                                      handleConnectAccount={() => handleConnectAccount(AccountDetails.id, true, false)}
                                      providerStatus={providerStatus}
                                    />
                                  )}
                                </div>
                              ) : (
                                <></>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={[
                  'account-ct-box mb-40',
                  AccountHoldings?.holdings.length === 0 ? 'ct-box-placeholder' : '',
                  AccountDetails?.syncError ? 'sync-error' : '',
                ].join(' ')}
              >
                {AccountDetails?.syncError ? (
                  <Placeholder type='syncError' />
                ) : (
                  <>
                    {hasChartData ? (
                      <div className='graphbox'>
                        <ul>
                          {AccountDetails?.category?.mmCategory === EAccountType.INVESTMENT_ASSETS && (
                            <li className='inv-data'>
                              <span className='graphbox-label'>Value</span>
                              <span className='graphbox-amount'>{renderChartAmount()}</span>
                            </li>
                          )}
                          {AccountDetails?.category?.mmCategory === EAccountType.OTHER_ASSETS && (
                            <li className='other-data'>
                              <span className='graphbox-label'>Value</span>
                              <span className='graphbox-amount'>{renderChartAmount()}</span>
                            </li>
                          )}

                          {AccountDetails?.category?.mmCategory === EAccountType.LIABILITIES && (
                            <li className='lty-data'>
                              <span className='graphbox-label'>Value</span>
                              <span className='graphbox-amount'>{renderChartAmount()}</span>
                            </li>
                          )}
                        </ul>

                        {renderChart()}
                      </div>
                    ) : (
                      <Placeholder type='acctDetail' />
                    )}
                  </>
                )}
              </div>
              {AccountDetails?.syncError ? null : (
                <>
                  <div className='d-flex justify-content-between flex-wrap'>
                    <div className='mm-plan-radios mb-4'>
                      <input
                        type='radio'
                        id='mm-account-balance'
                        value='balance'
                        name='mm-radio-holding-activity'
                        aria-checked='true'
                        checked={tableType === 'balance' ? true : false}
                        onChange={(e) => setTableType('balance')}
                      />
                      <label className='labels' htmlFor='mm-account-balance'>
                        Balance
                      </label>
                      {!isLiabilities ? (
                        <>
                          <input
                            type='radio'
                            id='mm-account-holding'
                            value='holdings'
                            name='mm-radio-holding-activity'
                            aria-checked='true'
                            checked={tableType === 'holdings' ? true : false}
                            onChange={(e) => setTableType('holdings')}
                          />
                          <label className='labels' htmlFor='mm-account-holding'>
                            Holdings
                          </label>
                        </>
                      ) : null}

                      <input
                        type='radio'
                        id='mm-account-activity'
                        value='activity'
                        name='mm-radio-holding-activity'
                        aria-checked='false'
                        checked={tableType === 'activity' ? true : false}
                        onChange={(e) => setTableType('activity')}
                        className={isLiabilities ? 'second' : ''}
                      />
                      <label className='labels' htmlFor='mm-account-activity'>
                        Activity
                      </label>
                      <div className='mm-radio-bg' />
                    </div>
                    {AccountDetails?.isManual && tableType === 'holdings' && (
                      <Button variant='primary' className='mb-4 mm-account__btn' onClick={openNewPositonModal}>
                        Add Position
                      </Button>
                    )}
                    {AccountDetails?.isManual && tableType === 'activity' && (
                      <Button variant='primary' className='mb-4 mm-account__btn' onClick={openNewActivityModal}>
                        Add Activity
                      </Button>
                    )}
                  </div>
                  {AccountHoldings && tableType === 'holdings' && (
                    <AccountTable
                      holdingsData={AccountHoldings.holdings}
                      openEditPositionModalFun={() => setEditPositonModalOpen(true)}
                      closeEditPositionModalFun={() => setEditPositonModalOpen(false)}
                      accountDetails={AccountDetails}
                      currencySymbol={currencySymbol}
                    />
                  )}

                  {tableType === 'balance' ? (
                    <BalanceTable balanceData={balanceData} currencySymbol={currencySymbol} />
                  ) : null}

                  {tableType === 'activity' && (
                    <div className='mm-account-activity-block'>
                      <div className='d-flex align-items-center mb-4'>
                        <p className='mb-0'>
                          To properly calculate performance make sure that all withdrawals and deposits are accurately
                          tracked below as Cash Flow
                        </p>
                        <MMToolTip
                          placement='top'
                          message='Performance calculations are coming soon. To ensure proper performance returns please mark cash flow transactions properly.'
                        >
                          <InfoIcon className='mt-n1 ml-2' />
                        </MMToolTip>
                      </div>
                      {AccountActivity && (
                        <ActivityTable
                          transactionsData={AccountActivity.transactions}
                          openEditActivityModalFun={() => setEditActivityModalOpen(true)}
                          closeEditActivityModalFun={() => setEditActivityModalOpen(false)}
                          currencySymbol={currencySymbol}
                        />
                      )}
                    </div>
                  )}
                  {newPositonModalOpen && (
                    <HoldingsDetailsModal
                      holdingsDetailsModal={holdingsDetailsModal}
                      accountId={AccountDetails?.id}
                      closeNewPositionModal={() => setNewPositonModalOpen(false)}
                      currencySymbol={currencySymbol}
                    />
                  )}
                  {newActivityModalOpen && (
                    <ActivityDetailsModal
                      activityDetailsModal={activityDetailsModal}
                      accountId={AccountDetails?.id}
                      closeNewActivityModal={() => setNewActivityModalOpen(false)}
                      currencySymbol={currencySymbol}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <FastLinkModal
        fastLinkModal={fastlinkModal}
        fastLinkOptions={fastLinkOptions}
        handleSuccess={handleConnectAccountSuccess}
      />
      {!loading && <AppFooter />}
    </div>
  );
};

export default AccountDetail;

export interface PopupProps {
  AccountDetails?: Account;
  handleConnectAccount: () => void;
  providerStatus: string;
}

const Popup: React.FC<PopupProps> = ({ AccountDetails, handleConnectAccount, providerStatus }) => {
  if (!AccountDetails) {
    return <CircularSpinner />;
  }

  return (
    <div className='popup'>
      <span className='pb-2'>Connection Status</span>
      <span className='pb-2'>
        Last updated {getRelativeDate(AccountDetails.providerAccount?.dataset[0]?.lastUpdated.toString())}
      </span>
      {providerStatus === 'ATTENTION_WAIT' ? (
        <span className='pt-2 pb-3'>
          For security reasons, your account cannot be refreshed at this time. Please try again in 15 minutes.
        </span>
      ) : (
        <span className='pt-2 pb-3'>Reauthorize your connection to continue syncing your account</span>
      )}
      {providerStatus !== 'ATTENTION_WAIT' ? (
        <button type='button' className='mm-btn-animate mm-btn-primary' onClick={handleConnectAccount}>
          Fix Connection
        </button>
      ) : null}
    </div>
  );
};
