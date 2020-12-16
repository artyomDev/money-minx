import React from 'react';
import { ResponsiveContainer, ComposedChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceArea } from 'recharts';

import { AccountBarGraphProps } from 'account/account.type';
import { fNumber, numberWithCommas } from 'common/number.helper';
import { formatter, getInterval } from 'common/bar-graph-helper';

const CustomTooltip = (props: any) => {
  const { active, payload, currencySymbol } = props;
  if (active) {
    return (
      <div className='bar-tooltip'>
        <div className='item-name'>
          {payload?.[0]?.payload.interval}
        </div>
        <div className='item-value'>
          {payload?.[0]?.payload.value ? `${currencySymbol}${numberWithCommas(fNumber(payload?.[0]?.payload.value, 0))}` : 0}
        </div>
      </div>
    )
  }

  return null;
};

const renderCustomRALabel = (props: any) => {
  const { x, y } = props.viewBox;

  return <text style={{
    fontFamily: 'Mulish',
    lineHeight: '150%',
    fontSize: '11px',
    fontWeight: 'bold',
    fontStyle: 'normal',
    textAlign: 'center',
    letterSpacing: '0.2em',
    textTransform: 'uppercase'
  }} x={x + 15} y={y + 25} fill='#534CEA' fillOpacity='0.4'>projected</text>;
};

const AccountBarGraph: React.FC<AccountBarGraphProps> = ({ data, curInterval, currencySymbol, mmCategory }) => {

  let max = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i].value > max) {
      max = data[i].value;
    }
  }

  // let first_projection = undefined;
  // for (let i = 0; i < data.length; i++) {
  //   if (data[i].type === 'projection') {
  //     first_projection = data[i].interval;
  //     break;
  //   }
  // }

  let _interval = getInterval(max);
  if (max > _interval * 3.5) {
    _interval = getInterval(max + _interval / 2);
  }

  const getBarColor = (mmCategory: string) => {
    if (mmCategory === 'Investment Assets') {
      return '#235ee7';
    } else if (mmCategory === 'Other Assets') {
      return '#29cfd6';
    }
    return '#d3365f';
  }

  return (
    <div className='account-responsive-container'>
      <ResponsiveContainer width='100%' height='100%'>
        <ComposedChart
          width={800}
          height={354}
          data={data}
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
          <XAxis dataKey='interval' tickSize={0} tickMargin={10} tick={{ fontSize: 14 }} stroke='#969eac' axisLine={{ stroke: 'transparent' }} />
          <YAxis
            orientation='right'
            minTickGap={10}
            axisLine={false}
            tickSize={0}
            tickMargin={10}
            tick={{ fontSize: 14 }}
            interval="preserveStartEnd"
            stroke='#969eac'
            tickFormatter={(tick) => formatter(tick, currencySymbol)}
            domain={[0, _interval * 4]}
          />
          <ReferenceArea
            x1={curInterval}
            y1={0}
            label={renderCustomRALabel}
            fill='url(#colorPr)'
          />
          <Tooltip
            separator=''
            cursor={false}
            content={<CustomTooltip currencySymbol={currencySymbol} />}
          />
          <Bar dataKey='value' barSize={10} fill={getBarColor(mmCategory)} radius={[2, 2, 0, 0]} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AccountBarGraph;