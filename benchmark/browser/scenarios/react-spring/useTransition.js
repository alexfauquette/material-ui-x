import * as React from 'react';
import { useTransition, animated } from '@react-spring/web';
import { dataset } from '../dataset';

export default function MyResponsiveScatterPlot() {
  const itemTransition = useTransition(dataset.slice(0, 100), {
    keys: (item) => item.id,
    from: () => ({ x: 0, y: 0 }),
    enter: (item) => ({ x: item.x, y: item.y }),
    update: (item) => ({ x: item.x, y: item.y }),
  });

  return (
    <svg width={500} height={500} viewBox={`0 0 500 500`} style={{ width: 500, height: 500 }}>
      {itemTransition(({ x, y }) => (
        <animated.circle cx={x} cy={y} r={2} />
      ))}
    </svg>
  );
}
