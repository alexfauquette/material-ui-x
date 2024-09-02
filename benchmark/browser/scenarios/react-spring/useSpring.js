import * as React from 'react';
import { useSpring, animated } from '@react-spring/web';
import { dataset } from '../dataset';

function Circle({ x, y }) {
  const [props] = useSpring(
    () => ({
      from: { x: 0, y: 0 },
      to: { x, y },
    }),
    [x, y],
  );
  return <animated.circle cx={props.x} cy={props.y} r={2} />;
}

export default function MyResponsiveScatterPlot() {
  return (
    <svg width={500} height={500} viewBox={`0 0 500 500`} style={{ width: 500, height: 500 }}>
      {dataset.map((item) => (
        <Circle key={item.id} x={item.x} y={item.y} />
      ))}
    </svg>
  );
}
