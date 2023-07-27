import * as React from 'react';
import Box from '@mui/material/Box';
import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '@mui/x-charts/constants';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { Chance } from 'chance';

const chance = new Chance(42);

const data = Array.from({ length: 200 }, () => ({
  x: chance.floating({ min: -25, max: 25 }),
  y: chance.floating({ min: -25, max: 25 }),
})).map((d, index) => ({ ...d, id: index }));

const params = {
  series: [{ data }],
  height: 300,
};
export default function ModifyAxisPosition() {
  return (
    <Box sx={{ width: '100%', maxWidth: 500 }}>
      <ScatterChart
        {...params}
        leftAxis={null}
        bottomAxis={null}
        topAxis={DEFAULT_X_AXIS_KEY}
        rightAxis={DEFAULT_Y_AXIS_KEY}
        margin={{ top: 30, bottom: 10 }}
      />
    </Box>
  );
}
