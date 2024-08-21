import * as React from 'react';
import { ScatterChartPro } from '@mui/x-charts-pro/ScatterChartPro';
import { dataset } from '../dataset';

export default function SimpleScatterChartPro() {
  return (
    <ScatterChartPro
    width={1000}
    height={600}
      series={[
        {
          data: dataset,
          label: 'pv',
        },
      ]}
      grid={{ horizontal: true, vertical: true }}
      xAxis={[{ id: 'x', zoom: true }]}
      zoom={[{ axisId: 'x', start: 50, end: 55 }]}
      skipAnimation
    />
  );
}
