import { Table } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';

import { events } from '@mm/data/event-list';
import useProfile from 'auth/hooks/useProfile';
import GALink from 'common/components/ga-link';
import { useAuthState } from 'auth/auth.context';
import { useAlert } from 'common/components/alert';
import { useModal } from 'common/components/modal';
import useSettings from 'setting/hooks/useSettings';
import useNetworth from 'networth/hooks/useNetworth';
import useAnalytics from 'common/hooks/useAnalytics';
import NetworthLayout from 'networth/networth.layout';
import { isCurrent, gc } from 'common/interval-parser';
import useSearchParam from 'auth/hooks/useSearchParam';
import { AccountCategory } from 'networth/networth.enum';
import useInitialModal from 'auth/hooks/useInitialModal';
import { appRouteConstants } from 'app/app-route.constant';
import { getCurrencySymbol } from 'common/currency-helper';
import MeasureIcon from 'assets/images/networth/measure.svg';
import BlurChart from 'assets/images/networth/chart-blur.png';
import SignUpDoneModal from 'auth/views/inc/signup-done.modal';
import { fNumber, numberWithCommas } from 'common/number.helper';
import AccountAddedModal from 'auth/views/inc/account-added-modal';
import CircularSpinner from 'common/components/spinner/circular-spinner';
import { useNetworthState, useNetworthDispatch } from 'networth/networth.context';
import { setToggleInvestment, setToggleOther, setToggleLiabilities, setToggleNet } from 'networth/networth.actions';

import NetworthHead from './inc/networth-head';
import { Placeholder } from './inc/placeholder';
import NetworthFilter from './inc/networth-filter';
import NetworthBarGraph from './networth-bar-graph';
import NetworthSkeleton from './inc/networth-skeleton';

interface IState {
  state: { isFromFastlink: boolean };
}

const Networth = () => {
  useProfile();
  const history = useHistory();
  const { data } = useSettings();
  const { event } = useAnalytics();
  const { loading } = useNetworth();
  const connectionAlert = useAlert();
  const signupDoneModal = useModal();
  const accountAddedModal = useModal();
  const { onboarded } = useAuthState();
  const { state }: IState = useLocation();
  const [currencySymbol, setCurrencySymbol] = useState<string>('');
  const {
    accounts,
    networth,
    fToggleNet,
    fCategories,
    fToggleOther,
    fToggleInvestment,
    fToggleLiabilities,
  } = useNetworthState();
  const dispatch = useNetworthDispatch();
  const [loadCounter, setCounter] = useState(0);

  const from = useSearchParam('from');
  const isFromFastlink = state?.isFromFastlink;
  const isSignupModal = !isFromFastlink && from === 'accountSettings' && onboarded !== undefined && onboarded === false;

  useInitialModal(true, connectionAlert);
  useInitialModal(isFromFastlink, accountAddedModal);
  useInitialModal(isSignupModal, signupDoneModal);

  useEffect(() => {
    if (data) {
      setCurrencySymbol(getCurrencySymbol(data.currency));
    }
  }, [data]);

  if (!networth?.length || !accounts) {
    return <NetworthSkeleton />;
  }

  if (loading && !loadCounter) {
    return <CircularSpinner />;
  }

  const otherAssets = accounts[AccountCategory.OTHER_ASSETS];
  const liabilities = accounts[AccountCategory.LIABILITIES];
  const investmentAssets = accounts[AccountCategory.INVESTMENT_ASSETS];

  const handleLoad = () => {
    setCounter((c) => c + 1);
  };

  const gotoConnectAccount = () => {
    return history.push(`${appRouteConstants.auth.CONNECT_ACCOUNT}?action=addMoreAccount`);
  };

  const [curNetworthItem] = networth.filter((networthItem) => isCurrent(networthItem.interval));
  const currentNetworth = curNetworthItem?.networth || 0;
  const currentOtherAssets = curNetworthItem?.otherAssets || 0;
  const currentLiabilities = curNetworthItem?.liabilities || 0;
  const currentInvestmentAsset = curNetworthItem?.investmentAssets || 0;

  const handleAccountDetail = (accountId: number) => {
    event({
      category: 'Net Worth',
      action: 'Clicked on Account',
      label: `Accessed account ${accountId}`,
    });

    history.push(`/account-details/${accountId}`);
  };

  const toggleInvestment = () => {
    dispatch(setToggleInvestment(!fToggleInvestment));
  };
  const toggleOther = () => {
    dispatch(setToggleOther(!fToggleOther));
  };
  const toggleLiabilities = () => {
    dispatch(setToggleLiabilities(!fToggleLiabilities));
  };
  const toggleNet = () => {
    dispatch(setToggleNet(!fToggleNet));
  };

  return (
    <NetworthLayout>
      <section className='content-container'>
        <NetworthHead />
        <hr className='m-0' />
        <div className='content-wrapper'>
          <div className='container'>
            <NetworthFilter handleLoad={handleLoad} />
            <div className='row mb-40'>
              <div className='col-lg-9 mob-btm'>
                <div className={['ct-box', Object.keys(accounts).length === 0 ? 'ct-box-placeholder' : ''].join(' ')}>
                  {Object.keys(accounts).length !== 0 ? (
                    <div className='graphbox'>
                      <ul>
                        {(fCategories.length === 0 || fCategories.length === 3) && (
                          <li className='nw-data'>
                            <span className='graphbox-label'>Net Worth</span>
                            <span className='graphbox-amount'>
                              {currencySymbol}
                              {numberWithCommas(fNumber(currentNetworth, 0))}
                            </span>
                          </li>
                        )}
                        {(fCategories.length === 0 || fCategories.includes('Investment Assets')) && (
                          <li className='inv-data'>
                            <span className='graphbox-label'>Investment Assets</span>
                            <span className='graphbox-amount'>
                              {currencySymbol}
                              {numberWithCommas(fNumber(currentInvestmentAsset, 0))}
                            </span>
                          </li>
                        )}
                        {(fCategories.length === 0 || fCategories.includes('Other Assets')) && (
                          <li className='other-data'>
                            <span className='graphbox-label'>Other Assets</span>
                            <span className='graphbox-amount'>
                              {currencySymbol}
                              {numberWithCommas(fNumber(currentOtherAssets, 0))}
                            </span>
                          </li>
                        )}
                        {(fCategories.length === 0 || fCategories.includes('Liabilities')) && (
                          <li className='lty-data'>
                            <span className='graphbox-label'>Liabilities</span>
                            <span className='graphbox-amount'>
                              {currencySymbol}
                              {numberWithCommas(fNumber(currentLiabilities, 0))}
                            </span>
                          </li>
                        )}
                      </ul>
                      <div className='chartbox'>
                        <NetworthBarGraph
                          networth={networth}
                          fCategories={fCategories}
                          currencySymbol={currencySymbol}
                        />
                      </div>
                    </div>
                  ) : (
                    <Placeholder type='chart' />
                  )}
                </div>
              </div>

              <div className='col-lg-3 mob-btm'>
                <div className='ct-box padd-20'>
                  <div className='measure-box'>
                    <h1>
                      <img src={MeasureIcon} alt='Measure UP' /> Minx Measure-up
                    </h1>
                    <div
                      className='bgbox'
                      style={{
                        backgroundImage: `url(${BlurChart})`,
                      }}
                    >
                      <p>Portfolio comparisons are coming soon. Complete your profile for better results once live.</p>
                      <GALink
                        to='/settings?active=Profile'
                        className='mm-btn-animate mm-btn-primary'
                        eventArgs={events.completeProfile}
                      >
                        Complete Profile
                      </GALink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {(fCategories.length === 0 || fCategories.includes('Investment Assets')) && (
              <div className='row mb-40'>
                <div className='col-12'>
                  <div className='ct-box box-b'>
                    {Object.keys(accounts).includes('Investment Assets') ? (
                      <div className='table-holder'>
                        <Table className='tb-responsive' id='table-investment-xls'>
                          <thead onClick={toggleInvestment}>
                            <tr data-toggle='collapse'>
                              <th>
                                <span className={!fToggleInvestment ? 't-span' : ''}>Investment Assets</span>
                              </th>
                              <th className={!fToggleInvestment ? 'd-hide' : ''}>Type</th>

                              {investmentAssets?.[0]?.balances.map((item, idx) => (
                                <th key={idx} className={gc(item.interval)}>
                                  {item.interval}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          {fToggleInvestment ? (
                            <tbody>
                              {investmentAssets
                                ? investmentAssets.map((iAsset, index) => {
                                    return (
                                      <tr key={index} onClick={() => handleAccountDetail(iAsset.accountId)}>
                                        <td>{iAsset.accountName}</td>
                                        <td className={`hide-type`}>{iAsset.accountType}</td>
                                        {iAsset.balances.map((b, idx) => (
                                          <td
                                            key={`${index}-${idx}`}
                                            className={[b.type === `projection` && `projection`, gc(b.interval)].join(
                                              ' '
                                            )}
                                          >
                                            <span className={gc(b.interval)}>{b.interval}</span>
                                            {currencySymbol}
                                            {numberWithCommas(fNumber(b.balance, 2))}
                                          </td>
                                        ))}
                                      </tr>
                                    );
                                  })
                                : // show place holder here
                                  null}
                            </tbody>
                          ) : null}
                          <tfoot className={'projection'}>
                            <tr data-href='#'>
                              <td>
                                <Link
                                  to='#'
                                  className='warning-popover'
                                  data-classname='warning-pop'
                                  data-container='body'
                                  title='Warning'
                                  data-toggle='popover'
                                  data-placement='right'
                                  data-content=''
                                >
                                  Total
                                </Link>
                              </td>
                              <td className={[!fToggleInvestment ? 'd-hide' : '', `hide-type`].join(' ')}>{''}</td>
                              {networth?.map((nItem, idx) => (
                                <td
                                  key={idx}
                                  className={[nItem.type === `projection` && `projection`, gc(nItem.interval)].join(
                                    ' '
                                  )}
                                >
                                  <span className={gc(nItem.interval)}>{nItem.interval}</span>
                                  {currencySymbol}
                                  {numberWithCommas(fNumber(nItem.investmentAssets, 2))}
                                </td>
                              ))}
                            </tr>
                          </tfoot>
                        </Table>
                      </div>
                    ) : (
                      <Placeholder type='investment' />
                    )}
                  </div>
                </div>
              </div>
            )}
            {(fCategories.length === 0 || fCategories.includes('Other Assets')) && (
              <div className='row mb-40'>
                <div className='col-12'>
                  <div className='ct-box box-g'>
                    {Object.keys(accounts).includes('Other Assets') ? (
                      <div className='table-holder'>
                        <Table className='tb-responsive' id='table-other-xls'>
                          <thead onClick={toggleOther}>
                            <tr>
                              <th>
                                <span className={!fToggleOther ? 't-span' : ''}>Other Assets</span>
                              </th>
                              <th className={!fToggleOther ? 'd-hide' : ''}>Type</th>
                              {otherAssets?.[0]?.balances.map((item, idx) => (
                                <th key={idx} className={gc(item.interval)}>
                                  {item.interval}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          {fToggleOther ? (
                            <tbody>
                              {otherAssets?.map((oAsset, index) => {
                                return (
                                  <tr key={index} onClick={() => handleAccountDetail(oAsset.accountId)}>
                                    <td>{oAsset.accountName}</td>
                                    <td className={`hide-type`}>{oAsset.accountType}</td>
                                    {oAsset.balances.map((b, idx) => (
                                      <td
                                        key={`${index}-${idx}`}
                                        className={[b.type === `projection` && `projection`, gc(b.interval)].join(' ')}
                                      >
                                        <span className={gc(b.interval)}>{b.interval}</span>
                                        {currencySymbol}
                                        {numberWithCommas(fNumber(b.balance, 2))}
                                      </td>
                                    ))}
                                  </tr>
                                );
                              })}
                            </tbody>
                          ) : null}
                          <tfoot className={'projection'}>
                            <tr data-href='#'>
                              <td className={'text--primary'}>Total</td>
                              <td className={[!fToggleOther ? 'd-hide' : '', `hide-type`].join(' ')}>{''}</td>
                              {networth?.map((nItem, idx) => (
                                <td
                                  key={idx}
                                  className={[nItem.type === `projection` && `projection`, gc(nItem.interval)].join(
                                    ' '
                                  )}
                                >
                                  <span className={gc(nItem.interval)}>{nItem.interval}</span>
                                  {currencySymbol}
                                  {numberWithCommas(fNumber(nItem.otherAssets, 2))}
                                </td>
                              ))}
                            </tr>
                          </tfoot>
                        </Table>
                      </div>
                    ) : (
                      <Placeholder type='other' />
                    )}
                  </div>
                </div>
              </div>
            )}
            {(fCategories.length === 0 || fCategories.includes('Liabilities')) && (
              <div className='row mb-40'>
                <div className='col-12'>
                  <div className='ct-box box-r'>
                    {Object.keys(accounts).includes('Liabilities') ? (
                      <div className='table-holder'>
                        <Table className='tb-responsive' id='table-liabilities-xls'>
                          <thead onClick={toggleLiabilities}>
                            <tr>
                              <th>
                                <span className={!fToggleLiabilities ? 't-span' : ''}>Liabilities</span>
                              </th>
                              <th className={!fToggleLiabilities ? 'd-hide' : ''}>Type</th>
                              {liabilities?.[0]?.balances.map((item, idx) => (
                                <th key={idx} className={gc(item.interval)}>
                                  {item.interval}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          {fToggleLiabilities ? (
                            <tbody className={'projection'}>
                              {liabilities?.map((liability, index) => {
                                return (
                                  <tr key={index} onClick={() => handleAccountDetail(liability.accountId)}>
                                    <td>{liability.accountName}</td>
                                    <td className={`hide-type`}>{liability.accountType}</td>
                                    {liability.balances.map((b, idx) => (
                                      <td
                                        key={`${index}-${idx}`}
                                        className={[b.type === `projection` && `projection`, gc(b.interval)].join(' ')}
                                      >
                                        <span className={gc(b.interval)}>{b.interval}</span>
                                        {currencySymbol}
                                        {numberWithCommas(fNumber(b.balance, 2))}
                                      </td>
                                    ))}
                                  </tr>
                                );
                              })}
                            </tbody>
                          ) : null}
                          <tfoot className={'projection'}>
                            <tr>
                              <td className={'text--primary'}>Total</td>
                              <td className={[!fToggleInvestment ? 'd-hide' : '', `hide-type`].join(' ')}>{''}</td>
                              {networth?.map((nItem, idx) => (
                                <td
                                  key={idx}
                                  className={[nItem.type === `projection` && `projection`, gc(nItem.interval)].join(
                                    ' '
                                  )}
                                >
                                  <span className={gc(nItem.interval)}>{nItem.interval}</span>
                                  {currencySymbol}
                                  {numberWithCommas(fNumber(nItem.liabilities, 2))}
                                </td>
                              ))}
                            </tr>
                          </tfoot>
                        </Table>
                      </div>
                    ) : (
                      <Placeholder type='liabilities' />
                    )}
                  </div>
                </div>
              </div>
            )}
            {(fCategories.length === 0 || fCategories.length === 3) && (
              <div className='row mb-40'>
                <div className='col-12'>
                  <div className='ct-box box-v'>
                    {Object.keys(accounts).length !== 0 ? (
                      <div className='table-holder'>
                        <Table className='tb-responsive' id='table-net-xls'>
                          <thead onClick={toggleNet}>
                            <tr>
                              <th>
                                <span className={!fToggleNet ? 't-span text--primary' : 'text--primary'}>
                                  Net Worth
                                </span>
                              </th>
                              <th className='tab-hide'>{''}</th>
                              {networth?.map((nItem, idx) => (
                                <th key={idx} className={gc(nItem.interval)}>
                                  {nItem.interval}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          {fToggleNet ? (
                            <tbody className={'projection networth'}>
                              <tr data-href='#'>
                                <td>Investment Assets</td>
                                <td className='tab-hide'>{''}</td>
                                {networth?.map((nItem, idx) => (
                                  <td
                                    key={idx}
                                    className={[nItem.type === `projection` && `projection`, gc(nItem.interval)].join(
                                      ' '
                                    )}
                                  >
                                    <span className={gc(nItem.interval)}>{nItem.interval}</span>
                                    {currencySymbol}
                                    {numberWithCommas(fNumber(nItem.investmentAssets, 2))}
                                  </td>
                                ))}
                              </tr>
                              <tr data-href='#'>
                                <td>Other Assets</td>
                                <td className='tab-hide'>{''}</td>

                                {networth?.map((nItem, idx) => (
                                  <td
                                    key={idx}
                                    className={[nItem.type === `projection` && `projection`, gc(nItem.interval)].join(
                                      ' '
                                    )}
                                  >
                                    <span className={gc(nItem.interval)}>{nItem.interval}</span>
                                    {currencySymbol}
                                    {numberWithCommas(fNumber(nItem.otherAssets, 2))}
                                  </td>
                                ))}
                              </tr>
                              <tr data-href='#'>
                                <td>Liabilities</td>
                                <td className='tab-hide'>{''}</td>

                                {networth?.map((nItem, idx) => (
                                  <td
                                    key={idx}
                                    className={[nItem.type === `projection` && `projection`, gc(nItem.interval)].join(
                                      ' '
                                    )}
                                  >
                                    <span className={gc(nItem.interval)}>{nItem.interval}</span>
                                    {currencySymbol}
                                    {numberWithCommas(fNumber(nItem.liabilities, 2))}
                                  </td>
                                ))}
                              </tr>
                            </tbody>
                          ) : null}
                          <tfoot className={'projection'}>
                            <tr>
                              <td className={'text--primary'}>Net Worth</td>
                              <td className='tab-hide'>{''}</td>
                              {networth?.map((nItem, idx) => (
                                <td
                                  key={idx}
                                  className={[nItem.type === `projection` && `projection`, gc(nItem.interval)].join(
                                    ' '
                                  )}
                                >
                                  <span className={gc(nItem.interval)}>{nItem.interval}</span>
                                  {currencySymbol}
                                  {numberWithCommas(fNumber(nItem.networth || 0, 2))}
                                </td>
                              ))}
                            </tr>
                          </tfoot>
                        </Table>
                      </div>
                    ) : (
                      <Placeholder type='networth' />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/*Todo show an alert when connections are broken with count of broken connections*/}
        {/*<ConnectionAlert connectionAlert={connectionAlert} message='2 connections need attention' />*/}

        <SignUpDoneModal signupModal={signupDoneModal} handleSuccess={gotoConnectAccount} />
        <AccountAddedModal accountAddedModal={accountAddedModal} handleSuccess={gotoConnectAccount} />
      </section>
    </NetworthLayout>
  );
};

export default Networth;
