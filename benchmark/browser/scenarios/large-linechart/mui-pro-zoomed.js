import * as React from 'react';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import { dataset } from '../dataset';

export default function SimpleLineChartPro() {
  return (
    <LineChartPro
     
    width={1000}
    height={600}
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
          id: 'x',
          zoom: true,
        },
      ]}
      zoom={[{ axisId: 'x', start: 50, end: 55 }]}
      skipAnimation
    />
  );
}
