import React from 'react';

import { parseIntervalText } from 'common/interval-parser';

const BarGraphCustomTick = (props: any) => {
  const { x, y, payload } = props;
  const isToday = payload?.value === 'Today';

  return (
    <g transform={`translate(${x + 30},${y})`} fontSize={14}>
      <text x={0} y={0} dy={16} textAnchor='end' fill={isToday ? '#008a00' : '#969eac'}>
        {parseIntervalText(payload?.value)}
      </text>
    </g>
  );
};

export default BarGraphCustomTick;
