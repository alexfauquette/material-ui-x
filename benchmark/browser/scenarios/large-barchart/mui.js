import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { dataset } from '../dataset';

export default function SimpleBarChart() {
  return (
    <BarChart
      width={500}
      height={300}
      dataset={dataset}
      series={[
        {
          dataKey: 'y',
          label: 'pv',
        },
      ]}
      xAxis={[{ dataKey: 'id', scaleType: 'band', tickInterval: (i) => i % 100 === 0 }]}
      grid={{ horizontal: true, vertical: true }}
      skipAnimation
    />
  );
}
