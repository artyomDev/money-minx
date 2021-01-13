import React from 'react';

import { BarChartColors } from 'common/color';
import { AccountCategory } from 'networth/networth.enum';
import { AccountBarGraphProps } from 'account/account.type';
import { fNumber, numberWithCommas } from 'common/number.helper';
import { formatter, getInterval } from 'common/bar-graph-helper';
import BarGraphCustomTick from 'common/components/chart/bargraph-custom-tick';
import { ResponsiveContainer, ComposedChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceArea } from 'recharts';

const CustomTooltip = (props: any) => {
  const { active, payload, currencySymbol } = props;
  if (active) {
    return (
      <div className='bar-tooltip'>
        <div className='item-name'>{payload?.[0]?.payload.interval}</div>
        <div className='item-value'>
          {payload?.[0]?.payload.value
            ? `${currencySymbol}${numberWithCommas(fNumber(payload?.[0]?.payload.value, 0))}`
            : 0}
        </div>
      </div>
    );
  }

  return null;
};

const renderCustomRALabel = (props: any) => {
  const { x, y } = props.viewBox;

  return (
    <text
      style={{
        fontFamily: 'Mulish',
        lineHeight: '150%',
        fontSize: '11px',
        fontWeight: 'bold',
        fontStyle: 'normal',
        textAlign: 'center',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
      }}
      x={x + 15}
      y={y + 25}
      fill='#534CEA'
      fillOpacity='0.4'
    >
      projected
    </text>
  );
};

const AccountBarGraph: React.FC<AccountBarGraphProps> = ({ data, curInterval, currencySymbol, mmCategory }) => {
  let max = 0;
  for (const accountChartItem of data) {
    if (accountChartItem.value > max) {
      max = accountChartItem.value;
    }
  }

  const firstProjection = data.find((datum) => datum.type === 'projection');

  const dataWithAbsoluteValues = data.map((accountChartItem) => {
    return {
      ...accountChartItem,
      value: Math.abs(+accountChartItem.value),
    };
  });

  let _interval = getInterval(max);
  if (max > _interval * 3.5) {
    _interval = getInterval(max + _interval / 2);
  }

  const getBarColor = (mmCat: string) => {
    if (mmCat === AccountCategory.INVESTMENT_ASSETS) {
      return BarChartColors.BLUE;
    }
    if (mmCat === AccountCategory.OTHER_ASSETS) {
      return BarChartColors.CYAN;
    }

    return BarChartColors.RED;
  };

  return (
    <div className='account-responsive-container'>
      <ResponsiveContainer width='100%' height='100%'>
        <ComposedChart
          width={800}
          height={354}
          data={dataWithAbsoluteValues}
          barGap={2}
          barCategoryGap={20}
          margin={{
            top: 5,
            right: 5,
            left: 5,
            bottom: 5,
          }}
        >
          <defs>
            <linearGradient id='colorUv' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#8884d8' stopOpacity={0.5} />
              <stop offset='95%' stopColor='#FFFFFF' stopOpacity={0.5} />
            </linearGradient>
          </defs>
          <defs>
            <linearGradient id='colorPr' x1='0' y1='1' x2='1' y2='1'>
              <stop offset='5%' stopColor='#8884d8' stopOpacity={0.3} />
              <stop offset='95%' stopColor='#FFFFFF' stopOpacity={0.3} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke='#969eac1a' vertical={false} />
          <XAxis
            dataKey='interval'
            tickSize={0}
            tickMargin={10}
            tick={<BarGraphCustomTick />}
            stroke='#969eac'
            axisLine={{ stroke: 'transparent' }}
          />
          <YAxis
            orientation='right'
            minTickGap={10}
            axisLine={false}
            tickSize={0}
            tickMargin={10}
            tick={{ fontSize: 14 }}
            interval='preserveStartEnd'
            stroke='#969eac'
            tickFormatter={(tick) => formatter(tick, currencySymbol)}
            domain={['auto', _interval * 4]}
          />
          <ReferenceArea x1={firstProjection?.interval} y1={0} label={renderCustomRALabel} fill='url(#colorPr)' />
          <Tooltip separator='' cursor={false} content={<CustomTooltip currencySymbol={currencySymbol} />} />
          <Bar dataKey='value' barSize={10} fill={getBarColor(mmCategory)} radius={[2, 2, 0, 0]} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AccountBarGraph;
