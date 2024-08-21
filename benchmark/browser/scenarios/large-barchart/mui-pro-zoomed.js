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
      xAxis={[
        {
          id: 'x',
          dataKey: 'id',
          scaleType: 'band',
          tickInterval: (i) => i % 100 === 0,
          zoom: true,
        },
      ]}
      zoom={[{ axisId: 'x', start: 50, end: 55 }]}
      grid={{ horizontal: true, vertical: true }}
      skipAnimation
    />
  );
}
