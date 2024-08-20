import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { dataset } from '../dataset';

export default function SimpleLineChart() {
  return (
    <LineChart
      width={500}
      height={300}
      dataset={dataset}
      series={[
        {
          dataKey: 'y',
          label: 'pv',
          // showMark:  (params) => params.index % 2 === 0,
        },
      ]}
      grid={{ horizontal: true, vertical: true }}
      xAxis={[
        {
          scaleType: 'point',
          dataKey: 'id',
          tickInterval: (v) => v % 100 === 0,
        },
      ]}
      skipAnimation
    />
  );
}
