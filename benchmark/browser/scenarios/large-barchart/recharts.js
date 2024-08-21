import * as React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { dataset } from '../dataset';

export default function Rechart() {
  return (
    <BarChart
      margin={{
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      }}
      width={1000}
      height={600}
      data={dataset}
    >
      <CartesianGrid />
      <XAxis type="number" dataKey="id" name="stature" />
      <YAxis type="number" dataKey="y" name="weight" />
      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
      <Bar dataKey="y" fill="#82ca9d" isAnimationActive={false} />
    </BarChart>
  );
}
