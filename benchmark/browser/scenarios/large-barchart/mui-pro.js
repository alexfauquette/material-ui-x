import * as React from 'react';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';
import { dataset } from '../dataset';

export default function SimpleBarChart() {
  return (
    <BarChartPro
    width={1000}
    height={600}
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
