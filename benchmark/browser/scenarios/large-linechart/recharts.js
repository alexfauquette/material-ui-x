import * as React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { dataset } from '../dataset';

export default function Example() {
  return (
    <LineChart
      width={500}
      height={300}
      data={dataset}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="id" max={10} min={0} isAnimationActive={false} />
      <YAxis isAnimationActive={false} />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="y"
        stroke="#8884d8"
        activeDot={{ r: 8 }}
        isAnimationActive={false}
      />
    </LineChart>
  );
}
