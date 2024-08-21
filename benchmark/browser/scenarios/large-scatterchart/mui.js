import * as React from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { dataset } from '../dataset';

export default function SimpleScatterChart() {
  return (
    <ScatterChart
    width={1000}
    height={600}
      series={[
        {
          data: dataset,
          label: 'pv',
        },
      ]}
      grid={{ horizontal: true, vertical: true }}
      skipAnimation
    />
  );
}
