import React, { useState } from 'react';
import ReactDatePicker from 'react-datepicker';

import { fNumber, numberWithCommas } from 'common/number.helper';
import { useModal } from 'common/components/modal';
import {
  isAfter,
  isBefore,
  getNextMonth,
  getPreviousMonth,
  getMonthSubtracted,
  getLastDateOfMonth,
  getMonthYear,
} from 'common/moment.helper';
import { shortId } from 'common/common-helper';
import { useAuthState } from 'auth/auth.context';
import { MMPieChart } from 'common/components/pie-chart';
import SettingModal from 'allocation/modal/setting-modal';
import useAllocation from 'allocation/hooks/useAllocation';
import { pricingDetailConstant } from 'common/common.constant';
import ChartShareModal from 'allocation/modal/chart-share-modal';
import { SelectedAllocationProps } from 'allocation/allocation.type';
import CircularSpinner from 'common/components/spinner/circular-spinner';
import { ReactComponent as Share } from 'assets/images/allocation/share.svg';
import { ReactComponent as Calendar } from 'assets/images/allocation/calendar.svg';
import { ReactComponent as SettingsIcon } from 'assets/images/allocation/settings.svg';

import AllocationLegend from './allocation-legend';
import RestrictedChartView from './restricted-chart-view';

export const SelectedAllocations: React.FC<SelectedAllocationProps> = ({ filter, currencySymbol, gotoDetailPage }) => {
  const { subscriptionDetail } = useAuthState();
  const [hidden, setHidden] = useState<string[]>(['']);
  const [isDateValid, setIsDateValid] = useState<boolean>(true);
  const [date, setDate] = useState<Date>(getLastDateOfMonth(getPreviousMonth()));
  const { allocations, allocationChartData: chartData, lastAvailableDate } = useAllocation(filter, date);

  const chartShareModal = useModal();
  const chartSettingModal = useModal();

  if (!allocations || !chartData) {
    return <CircularSpinner />;
  }

  const toggleAllocation = (key: string) => {
    if (hidden.includes(key)) {
      const tempArr = hidden.filter((item) => item !== key);

      return setHidden(tempArr);
    }

    return setHidden([...hidden, key]);
  };

  const isHidden = (key: string) => hidden.includes(key);

  const getTotal = (key: string) => {
    return chartData.find((datum) => datum.group === key);
  };

  const getNumberOfChartHistory = () => {
    if (subscriptionDetail?.details) {
      return +subscriptionDetail?.details[pricingDetailConstant.ALLOCATION_CHART_HISTORY] || 0;
    }

    return 0;
  };

  const validateDate = (_date: Date) => {
    if (isAfter(_date)) {
      return false;
    }

    if (getNumberOfChartHistory() && isBefore(_date, getMonthSubtracted(getNumberOfChartHistory()))) {
      setIsDateValid(false);

      return true;
    }

    setIsDateValid(true);

    return true;
  };

  const setPreviousMonth = () => {
    if (validateDate(getPreviousMonth(date))) {
      return setDate(getPreviousMonth(date));
    }
  };

  const setNextMonth = () => {
    if (validateDate(getNextMonth(date))) {
      return setDate(getNextMonth(date));
    }
  };

  return (
    <div className='mm-allocation-overview__block'>
      <div className='allocation-card-top'>
        <div className='mm-allocation-overview__block--date'>
          <div className='selected-date-string'>
            <span className='arrow-left' role='button' onClick={setPreviousMonth} />
            {getMonthYear(date || undefined)}
            <span className='arrow-right' role='button' onClick={setNextMonth} />
          </div>
          <span className='float-right mm-tooltip'>
            <ReactDatePicker
              selected={date}
              customInput={<Calendar />}
              dateFormat='MM/yyyy'
              showMonthYearPicker
              minDate={lastAvailableDate}
              maxDate={new Date()}
              onChange={(val: Date) => {
                if (validateDate(val)) {
                  setDate(getLastDateOfMonth(val));
                }
              }}
            />
            {!isDateValid ? (
              <div className='mm-tooltip__body'>
                <div className='mm-tooltip__body--title'>Upgrade Plan</div>
                <div className='mm-tooltip__body--text'>
                  Your plan only allows you to go back {getNumberOfChartHistory()} month. Upgrade for more history.
                </div>
              </div>
            ) : null}
          </span>
        </div>
        <div className='mm-allocation-overview__block--title'>Previous allocations</div>
        <p className='mm-allocation-overview__block--subtitle'>Use the arrows above to see your previous allocations</p>
        <div className='mm-allocation-overview__block--action'>
          <SettingsIcon className='mr-3' onClick={() => chartSettingModal.open()} />
          <Share onClick={() => chartShareModal.open()} />
        </div>
      </div>
      {!isDateValid ? (
        <RestrictedChartView noOfMonth={getNumberOfChartHistory()} />
      ) : (
        <div className='allocation-content'>
          <div
            className='text-center text-md-left d-xl-block d-md-flex align-items-md-center justify-content-md-center allocation-page-chart-wrapper'
            id='selected-allocation-pie-chart'
          >
            <MMPieChart chartData={chartData} currencySymbol={currencySymbol} />
            <AllocationLegend chartData={chartData} currencySymbol={currencySymbol} />
          </div>
          <div className='mm-allocation-overview__table'>
            <table>
              <thead>
                <tr>
                  <th className='mm-allocation-overview__table--head'>Position</th>
                  <th className='mm-allocation-overview__table--head'>Allocation</th>
                  <th className='mm-allocation-overview__table--head'>Value</th>
                </tr>
              </thead>
              {Object.keys(allocations).map((allocationKey, index) => {
                const allocation = allocations[allocationKey];

                return (
                  <React.Fragment key={index}>
                    <tbody>
                      <tr>
                        <td className='mm-allocation-overview__table--title'>
                          <span
                            className={isHidden(allocationKey) ? 'mm-allocation-overview__table--title-collapse' : ''}
                            onClick={() => toggleAllocation(allocationKey)}
                            role='button'
                          />
                          <span role='button'>{allocationKey}</span>
                        </td>
                      </tr>
                    </tbody>
                    <tbody className={isHidden(allocationKey) ? 'hide-me' : ''}>
                      {allocation?.map((al, index) => {
                        return (
                          <React.Fragment key={shortId + index}>
                            <tr
                              className='mm-allocation-overview__table--data-row-mobile'
                              onClick={() => gotoDetailPage(al.description)}
                            >
                              <td>
                                <span className='mt-2 mb-0'>{al.description}</span>
                              </td>
                            </tr>
                            <tr
                              className='mm-allocation-overview__table--data-row'
                              onClick={() => gotoDetailPage(al.description)}
                            >
                              <td>{al.description}</td>
                              <td>
                                <span className='d-block'>Allocation</span>
                                {fNumber(al.per, 2)}%
                              </td>
                              <td>
                                <span className='d-block'>Value</span>
                                {al.allocationValue
                                  ? `${currencySymbol}${numberWithCommas(fNumber(al.allocationValue, 2))}`
                                  : 0}
                              </td>
                            </tr>
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                    <tbody>
                      <tr className='mm-allocation-overview__table--footer'>
                        <td>Total</td>
                        <td>{fNumber(getTotal(allocationKey)?.per || 0, 2)}%</td>
                        <td>
                          {currencySymbol}
                          {numberWithCommas(fNumber(getTotal(allocationKey)?.total || 0, 2))}
                        </td>
                      </tr>
                    </tbody>
                  </React.Fragment>
                );
              })}
            </table>
          </div>
        </div>
      )}

      <SettingModal settingModal={chartSettingModal} />
      <ChartShareModal
        chartShareModal={chartShareModal}
        chartComponent={<MMPieChart chartData={chartData} currencySymbol={currencySymbol} share />}
        chartLegendComponent={<AllocationLegend chartData={chartData} currencySymbol={currencySymbol} sharing />}
      />
    </div>
  );
};
