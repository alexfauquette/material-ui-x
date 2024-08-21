import * as React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { dataset } from '../dataset';

export default function Rechart() {
  return (
    <ScatterChart
      margin={{
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      }}
      width={1000}
      height={600}
    >
      <CartesianGrid />
      <XAxis type="number" dataKey="x" name="stature" />
      <YAxis type="number" dataKey="y" name="weight" />
      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
      <Scatter name="A school" data={dataset} fill="#8884d8" isAnimationActive={false} />
    </ScatterChart>
  );
}
