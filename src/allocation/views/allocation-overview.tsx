import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { shortId } from 'common/common-helper';
import { useModal } from 'common/components/modal';
import useSettings from 'setting/hooks/useSettings';
import { getStringDate } from 'common/moment.helper';
import { MMPieChart } from 'common/components/pie-chart';
import SettingModal from 'allocation/modal/setting-modal';
import { getCurrencySymbol } from 'common/currency-helper';
import ChartShareModal from 'allocation/modal/chart-share-modal';
import { fNumber, numberWithCommas } from 'common/number.helper';
import FieldChangeModal from 'allocation/modal/field-change-modal';
import { AllocationSectionEnum } from 'allocation/allocation.enum';
import { AllocationOverviewProps } from 'allocation/allocation.type';
import { ReactComponent as Share } from 'assets/images/allocation/share.svg';
import { ReactComponent as Download } from 'assets/images/allocation/download.svg';
import { ReactComponent as SettingsIcon } from 'assets/images/allocation/settings.svg';
import { ReactComponent as MeasureUpIcon } from 'assets/images/allocation/measure-up-icon.svg';
import { ReactComponent as AllocationChartSVG } from 'assets/images/allocation/allocation-chart.svg';
import { ReactComponent as AllocationLegendSVG } from 'assets/images/allocation/allocation-legend.svg';

import AllocationLegend from './allocation-legend';
import { SelectedAllocations } from './selected-allocation';

const AllocationOverview: React.FC<AllocationOverviewProps> = ({ allocations, chartData, filter }) => {
  const chartShareModal = useModal();
  const fieldChangeModal = useModal();
  const chartSettingModal = useModal();
  const { data } = useSettings();
  const [section, setSection] = useState<AllocationSectionEnum>(AllocationSectionEnum.MY_ALLOCATION);
  const [currencySymbol, setCurrencySymbol] = useState<string>('');
  const [hidden, setHidden] = useState<string[]>(['']);

  useEffect(() => {
    if (data) {
      setCurrencySymbol(getCurrencySymbol(data.currency));
    }
  }, [data]);

  const getTotal = (key: string) => {
    return chartData.find((datum) => datum.group === key);
  };

  const toggleAllocation = (key: string) => {
    if (hidden.includes(key)) {
      const tempArr = hidden.filter((item) => item !== key);

      return setHidden(tempArr);
    }

    return setHidden([...hidden, key]);
  };

  const isHidden = (key: string) => hidden.includes(key);

  const changeAllocationSection = (sec: AllocationSectionEnum) => {
    setSection(sec);
  };

  const getSectionTitleClass = (sec: AllocationSectionEnum) => {
    if (section === sec) {
      return 'mm-allocation-overview__navigation-title mm-allocation-overview__navigation-title--active';
    }

    return 'mm-allocation-overview__navigation-title';
  };

  const getSectionClass = (sec: AllocationSectionEnum) => {
    if (section !== sec) {
      return 'col-xl-4 d-none d-xl-block';
    }

    return 'col-xl-4';
  };

  return (
    <div className='content-wrapper'>
      <div className='container'>
        <section className='mm-allocation-overview'>
          <div className='mm-allocation-overview__wrapper'>
            <div className='mm-allocation-overview__navigation mb-3'>
              <div className='d-flex'>
                <div
                  className={getSectionTitleClass(AllocationSectionEnum.MY_ALLOCATION)}
                  onClick={() => changeAllocationSection(AllocationSectionEnum.MY_ALLOCATION)}
                  role='button'
                >
                  My Allocation
                </div>
                <div
                  className={getSectionTitleClass(AllocationSectionEnum.PREVIOUS_ALLOCATION)}
                  onClick={() => changeAllocationSection(AllocationSectionEnum.PREVIOUS_ALLOCATION)}
                  role='button'
                >
                  Previous Allocation
                </div>
                <div
                  className={getSectionTitleClass(AllocationSectionEnum.SIMILAR_ALLOCATION)}
                  onClick={() => changeAllocationSection(AllocationSectionEnum.SIMILAR_ALLOCATION)}
                  role='button'
                >
                  Similar Allocation
                </div>
              </div>
              <div className='mm-allocation-overview__line' />
            </div>

            <div className='row'>
              <div className={getSectionClass(AllocationSectionEnum.MY_ALLOCATION)}>
                <div className='mm-allocation-overview__block d-lg-block'>
                  <div className='allocation-card-top'>
                    <div className='mm-allocation-overview__block--date'>{getStringDate()}</div>
                    <div className='mm-allocation-overview__block--title'>Current allocation</div>
                    <p className='mm-allocation-overview__block--subtitle'>Current allocation based on your holdings</p>
                    <div className='mm-allocation-overview__block--action'>
                      <SettingsIcon className='mr-3' onClick={() => chartSettingModal.open()} />
                      <Share onClick={() => chartShareModal.open()} />
                    </div>
                  </div>
                  <div className='allocation-content'>
                    <div
                      className='text-center text-md-left d-xl-block d-md-flex align-items-md-center p-b-4 allocation-page-chart-wrapper'
                      id='current-allocation-pie-chart'
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
                                  <td colSpan={2} className='mm-allocation-overview__table--title'>
                                    <span
                                      className={
                                        isHidden(allocationKey) ? 'mm-allocation-overview__table--title-collapse' : ''
                                      }
                                      onClick={() => toggleAllocation(allocationKey)}
                                      role='button'
                                    />
                                    <span onClick={() => fieldChangeModal.open()} role='button'>
                                      {allocationKey}
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                              <tbody className={isHidden(allocationKey) ? 'hide-me' : ''}>
                                {allocation?.map((al, index) => {
                                  return (
                                    <React.Fragment key={shortId + index}>
                                      <tr className='mm-allocation-overview__table--data-row-mobile'>
                                        <p className='mt-2 mb-0'>{al.description}</p>
                                      </tr>
                                      <tr className='mm-allocation-overview__table--data-row'>
                                        <td>{al.description}</td>
                                        <td>
                                          <span className='d-block'>Allocation</span>
                                          {fNumber(al.per || 0, 2)}%
                                        </td>
                                        <td>
                                          <span className='d-block'>Value</span>
                                          {al.allocationValue
                                            ? `${currencySymbol}${numberWithCommas(fNumber(al.allocationValue, 0))}`
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
                        ;
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <div className={getSectionClass(AllocationSectionEnum.PREVIOUS_ALLOCATION)}>
                <SelectedAllocations filter={filter} currencySymbol={currencySymbol} />
              </div>

              <div className={getSectionClass(AllocationSectionEnum.SIMILAR_ALLOCATION)}>
                <div className='mm-allocation-overview__block'>
                  <div className='allocation-card-top no-border'>
                    <div className='mm-allocation-overview__block--date'>{getStringDate()}</div>
                    <div className='mm-allocation-overview__block--title'>Similar Investors</div>
                    <p className='mm-allocation-overview__block--subtitle'>
                      Here’s how investors with similar profiles are currently allocated
                    </p>
                    <div className='mm-allocation-overview__block--action'>
                      <Download className='mr-3' />
                      <Share />
                    </div>
                  </div>
                  <div className='text-center text-md-left d-xl-block d-md-flex align-items-md-center justify-content-md-center mm-allocation-overview__block-chart-overview'>
                    <AllocationChartSVG className='mm-allocation-overview__block--chart' />
                    <AllocationLegendSVG className='mm-allocation-overview__block--legend' />
                    <div className='mm-allocation-overview__block-element text-center'>
                      <div className='mm-allocation-overview__block-element--middle'>
                        <div className='d-inline-flex align-items-center'>
                          <MeasureUpIcon />
                          <div className='mm-allocation-overview__block-element--text ml-2'>Minx Measure-up</div>
                        </div>
                        <p>
                          Portfolio comparisons are coming soon. Complete your profile for better results once live.
                        </p>
                        <Link to='/settings?active=Profile' className='mm-btn-animate mm-btn-primary'>
                          Complete Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <SettingModal settingModal={chartSettingModal} />
          <ChartShareModal
            chartShareModal={chartShareModal}
            chartComponent={<MMPieChart chartData={chartData} currencySymbol={currencySymbol} share />}
            chartLegendComponent={<AllocationLegend chartData={chartData} currencySymbol={currencySymbol} sharing />}
          />
          <FieldChangeModal fieldChangeModal={fieldChangeModal} />
        </section>
      </div>
    </div>
  );
};

export default AllocationOverview;
