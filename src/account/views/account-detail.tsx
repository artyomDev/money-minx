import Skeleton from 'react-loading-skeleton';
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
import { enumerateStr } from 'common/common-helper';
import { useAuthDispatch } from 'auth/auth.context';
import useAnalytics from 'common/hooks/useAnalytics';
import { getRefreshedAccount } from 'auth/auth.service';
import { FastLinkOptionsType } from 'yodlee/yodlee.type';
import { TimeIntervalEnum } from 'networth/networth.enum';
import { appRouteConstants } from 'app/app-route.constant';
import { getCurrencySymbol } from 'common/currency-helper';
import { Placeholder } from 'networth/views/inc/placeholder';
import { fNumber, numberWithCommas } from 'common/number.helper';
import AccountSettingsSideBar from 'auth/views/account-settings-sidebar';
import CircularSpinner from 'common/components/spinner/circular-spinner';
import { ReactComponent as InfoIcon } from 'assets/images/signup/info.svg';
import { ReactComponent as NotLinked } from 'assets/images/account/Not Linked.svg';
import { ReactComponent as NeedsInfo } from 'assets/images/account/Needs Info.svg';
import { ReactComponent as SettingsGear } from 'assets/icons/icon-settings-gear.svg';
import { ReactComponent as CheckCircle } from 'assets/images/account/check-circle.svg';
import { ReactComponent as CheckCircleGreen } from 'assets/images/account/check-circle-green.svg';
import { getAccountDetails, getAccountHoldings, getAccountActivity, getFastlinkUpdate } from 'api/request.api';
import { getDate, getMonthYear, getQuarter, getRelativeDate, getYear, parseDateFromString } from 'common/moment.helper';

import AccountTable from './account-table';
import ActivityTable from './activity-table';
import AccountBarGraph from './account-bar-graph';
import ActivityDetailsModal from './activity-details.modal';
import AccountSubNavigation from './account-sub-navigation';
import HoldingsDetailsModal from './holdings-details.modal';
import { AccountChartItem, AccountHolingsProps, AccountTransactionsProps } from '../account.type';

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
  const [tableType, setTableType] = useState<string>('holdings');
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
      if (tableType === 'holdings') fetchAccountHoldings(accountId, fromDate, toDate, timeInterval, baseCurrency);
      if (tableType === 'activity') fetchAccountActivity(accountId, fromDate, toDate, timeInterval, baseCurrency);
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

  const isCurrent = (interval: string) =>
    getMonthYear() === interval || getYear() === interval || getQuarter() === interval;

  let curAccountHoldingsItem;
  if (AccountHoldings?.charts) {
    curAccountHoldingsItem = AccountHoldings?.charts.filter((accountChartItem: AccountChartItem) =>
      isCurrent(accountChartItem.interval)
    );
  }

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
        <div className='content-wrapper'>
          <div className='container'>
            <div className='mm-account'>
              <div className='mm-account__selection mb-3'>
                <Skeleton width={200} height={50} count={1} />
              </div>
              <div className='mb-40'>
                <Skeleton width={1232} height={450} />
              </div>
              <div className='d-flex justify-content-between flex-wrap'>
                <div className='mm-plan-radios mb-4'>
                  <Skeleton width={200} height={50} count={1} />
                </div>
              </div>
              <Skeleton width={1232} height={250} />
            </div>
          </div>
        </div>
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
                      {filterloading && <CircularSpinner />}
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
                              {AccountDetails?.providerAccount?.status === 'LOGIN_IN_PROGRESS' ||
                              AccountDetails?.providerAccount?.status === 'IN_PROGRESS' ||
                              AccountDetails?.providerAccount?.status === 'PARTIAL_SUCCESS' ||
                              (AccountDetails?.providerAccount?.status === 'SUCCESS' &&
                                AccountDetails?.providerAccount?.dataset?.[0]?.nextUpdateScheduled >=
                                  moment().toISOString()) ||
                              (AccountDetails?.providerAccount?.status === 'SUCCESS' &&
                                AccountDetails?.providerAccount?.dataset?.[0]?.nextUpdateScheduled === null) ? (
                                <>
                                  <CheckCircleGreen />
                                  <span className='good'>Good</span>
                                </>
                              ) : AccountDetails?.providerAccount?.status === 'USER_INPUT_REQUIRED' ||
                                (AccountDetails?.providerAccount?.status === 'SUCCESS' &&
                                  AccountDetails?.providerAccount?.dataset?.[0]?.nextUpdateScheduled <
                                    moment().toISOString()) ? (
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
                                      handleConnectAccount={() => handleConnectAccount(AccountDetails.id, true, false)}
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
                    {AccountHoldings?.holdings.length !== 0 ? (
                      <div className='graphbox'>
                        <ul>
                          {AccountDetails?.category?.mmCategory === 'Investment Assets' && (
                            <li className='inv-data'>
                              <span className='graphbox-label'>Value</span>
                              <span className='graphbox-amount'>
                                {currencySymbol}
                                {curAccountHoldingsItem?.[0]?.value
                                  ? numberWithCommas(fNumber(curAccountHoldingsItem?.[0]?.value, 0))
                                  : 0}
                              </span>
                            </li>
                          )}
                          {AccountDetails?.category?.mmCategory === 'Other Assets' && (
                            <li className='other-data'>
                              <span className='graphbox-label'>Value</span>
                              <span className='graphbox-amount'>
                                {currencySymbol}
                                {curAccountHoldingsItem?.[0].value
                                  ? numberWithCommas(fNumber(curAccountHoldingsItem?.[0].value, 0))
                                  : 0}
                              </span>
                            </li>
                          )}
                          {AccountDetails?.category?.mmCategory === 'Liabilities' && (
                            <li className='lty-data'>
                              <span className='graphbox-label'>Value</span>
                              <span className='graphbox-amount'>
                                {currencySymbol}
                                {curAccountHoldingsItem?.[0].value
                                  ? numberWithCommas(fNumber(curAccountHoldingsItem?.[0].value, 0))
                                  : 0}
                              </span>
                            </li>
                          )}
                        </ul>
                        <div className='chartbox'>
                          {AccountHoldings && curAccountHoldingsItem && (
                            <AccountBarGraph
                              data={AccountHoldings.charts}
                              curInterval={curAccountHoldingsItem[0]?.interval}
                              currencySymbol={currencySymbol}
                              mmCategory={AccountDetails?.category?.mmCategory}
                            />
                          )}
                        </div>
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
                      <input
                        type='radio'
                        id='mm-account-activity'
                        value='activity'
                        name='mm-radio-holding-activity'
                        aria-checked='false'
                        checked={tableType === 'activity' ? true : false}
                        onChange={(e) => setTableType('activity')}
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
  AccountDetails: Account;
  handleConnectAccount: () => void;
}

const Popup: React.FC<PopupProps> = ({ AccountDetails, handleConnectAccount }) => {
  return (
    <div className='popup'>
      <span className='pb-2'>Connection Status</span>
      <span className='pb-2'>
        Last updated {getRelativeDate(AccountDetails?.providerAccount?.dataset[0]?.lastUpdated.toString())}
      </span>
      <span className='pt-2 pb-3'>Reauthorize your connection to continue syncing your account</span>
      <button type='button' className='mm-btn-animate mm-btn-primary' onClick={handleConnectAccount}>
        Fix Connection
      </button>
    </div>
  );
};
