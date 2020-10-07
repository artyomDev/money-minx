import React from 'react';

import { fNumber } from 'common/number.helper';
import { MMPieChart } from 'common/components/pie-chart';
import { Allocations, ChartData } from 'allocation/allocation.type';
import { ReactComponent as Share } from 'assets/images/allocation/share.svg';
import { ReactComponent as Calendar } from 'assets/images/allocation/calendar.svg';
import { ReactComponent as Download } from 'assets/images/allocation/download.svg';
import { ReactComponent as SettingsIcon } from 'assets/images/allocation/settings.svg';

import AllocationLegend from './allocation-legend';

interface SelectedAllocationProps {
  allocations: Allocations;
  chartData: ChartData;
}

export const SelectedAllocations: React.FC<SelectedAllocationProps> = ({ allocations, chartData }) => {
  const getTotal = (key: string) => {
    return chartData.find((datum) => datum.group === key);
  };

  return (
    <div className='col-xl-4'>
      <div className='mm-allocation-overview__block'>
        <div className='mm-allocation-overview__block--date'>
          June 30, 2020
          <span className='float-right'>
            <Calendar />
          </span>
        </div>
        <div className='mm-allocation-overview__block--title'>Previous allocations</div>
        <p>Use the dropdown above to see your previous allocations</p>
        <div className='mm-allocation-overview__block--action'>
          <SettingsIcon className='mr-3' />
          <Download className='mr-3' />
          <Share />
        </div>
        <hr className='mb-4' />
        <div className='allocation-content'>
          <div className='text-center text-md-left d-xl-block d-md-flex align-items-md-center justify-content-md-center'>
            <MMPieChart chartData={chartData} />
            {/* <AllocationChart className='mm-allocation-overview__block--chart' /> */}
            {/* <AllocationLegend className='mm-allocation-overview__block--legend' /> */}
            <AllocationLegend chartData={chartData} />
          </div>
          <hr className='my-5' />
          <div className='mm-allocation-overview__table'>
            <table>
              <tr>
                <th className='mm-allocation-overview__table--head'>Position</th>
                <th className='mm-allocation-overview__table--head'>Allocation</th>
                <th className='mm-allocation-overview__table--head'>Value</th>
              </tr>
              {Object.keys(allocations).map((allocationKey, index) => {
                const allocation = allocations[allocationKey];

                return (
                  <React.Fragment key={index}>
                    <tr>
                      <td className='mm-allocation-overview__table--title'>{allocationKey}</td>
                    </tr>
                    {allocation?.map((al) => {
                      return (
                        <React.Fragment key={al.id}>
                          <tr className='mm-allocation-overview__table--data-row-mobile'>
                            <p className='mt-2 mb-0'>{al.description}</p>
                          </tr>
                          <tr className='mm-allocation-overview__table--data-row'>
                            <td>{al.description}</td>
                            <td>
                              <span className='d-block'>Allocation</span>
                              {fNumber(al.per)}%
                            </td>
                            <td>
                              <span className='d-block'>Value</span>${fNumber(al.value)}
                            </td>
                          </tr>
                        </React.Fragment>
                      );
                    })}
                    <tr className='mm-allocation-overview__table--footer'>
                      <td>Total</td>
                      <td>{fNumber(getTotal(allocationKey)?.per || 0)}%</td>
                      <td>${fNumber(getTotal(allocationKey)?.total || 0)}</td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
