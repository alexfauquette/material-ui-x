import * as React from 'react';
import { ScatterPlot } from '@nivo/scatterplot';
import { dataset } from '../dataset';

const data = [{ id: 'pv', data: dataset.map((item) => ({ x: item.x, y: item.y })) }];

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

export default function MyResponsiveScatterPlot() {
  return (
    <ScatterPlot
      width={1000}
      height={600}
      data={data}
      margin={{ top: 60, right: 60, bottom: 70, left: 90 }}
      xScale={{ type: 'linear', min: 0, max: 'auto' }}
      xFormat=">-.2f"
      yScale={{ type: 'linear', min: 0, max: 'auto' }}
      yFormat=">-.2f"
      blendMode="multiply"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: 'bottom',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'weight',
        legendPosition: 'middle',
        legendOffset: 46,
        truncateTickAt: 0,
      }}
      axisLeft={{
        orient: 'left',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'size',
        legendPosition: 'middle',
        legendOffset: -60,
        truncateTickAt: 0,
      }}
    />
  );
}
