import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

import useSize from 'common/hooks/useSize';
import { BreakPoint } from 'app/app.constant';
import { ellipseText } from 'common/common-helper';
import { ChartData } from 'allocation/allocation.type';
import { fNumber, numberWithCommas } from 'common/number.helper';
import { useAllocationState } from 'allocation/allocation.context';

const COLORS = [
  '#235ee7',
  '#10c273',
  '#e74f99',
  '#ffd911',
  '#1f32ad',
  '#f7b164',
  '#16977f',
  '#158fff',
  '#ffbc02',
  '#f5325c',
  '#b5d539',
  '#c73cb9',
  '#29cfd6',
  '#7854f6',
  '#ec7100',
  '#c11a1a',
  '#d3365f',
  '#b1c0d2',
  '#454d7f',
  '#14b8b8',
];

interface MMPieChartProps {
  chartData: ChartData;
  share?: boolean;
  currencySymbol: string;
}

const CustomTooltip = (props: any) => {
  const { active, payload, currencySymbol } = props;
  const { allocationChartSetting } = useAllocationState();

  if (active) {
    return (
      <div className='allocation-pie-tooltip'>
        <div className='name'>
          {ellipseText(payload[0].name)} - {fNumber(payload[0].value, 2)}%
        </div>
        {allocationChartSetting?.showAmounts && (
          <div className='value'>{currencySymbol}{numberWithCommas(fNumber(payload[0].payload.total, 0))}</div>
        )}
      </div>
    );
  }

  return null;
};

export const MMPieChart: React.FC<MMPieChartProps> = ({ chartData, share = false, currencySymbol }) => {
  const data = chartData
    .map((item) => ({
      name: item.group,
      per: item.per,
      total: item.total,
    }))
    .sort((a, b) => b.per - a.per);

  let w = 430;
  let ir = 95;
  let outR = 155;

  const { width } = useSize();
  if (width < BreakPoint.MD || share) {
    w = 354;
    ir = 60;
    outR = 100;
  }
  if (width <= BreakPoint.CMED && share) {
    w = 190;
    ir = 40;
    outR = 80;
  } else if (share) {
    w = 260;
    ir = 64;
    outR = 118;
  }

  return (
    <div className='allocation-chart-wrapper'>
      <ResponsiveContainer width={!share ? '100%' : w} height='100%'>
        <PieChart onMouseEnter={() => { }} className='mm-allocation-overview__block--chart'>
          <Pie data={data} innerRadius={ir} outerRadius={outR} fill='#000000' stroke='none' dataKey='per'>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          {!share && <Tooltip content={<CustomTooltip currencySymbol={currencySymbol} />} />}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
