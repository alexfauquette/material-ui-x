'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { InteractionContext } from '../context/InteractionProvider';
import { useCartesianContext } from '../context/CartesianProvider';
import { getValueToPositionMapper } from '../hooks/useScale';
import { isBandScale } from '../internals/isBandScale';
import { chartsColorsVars } from '../context/ThemeProvider';

export interface ChartsAxisHighlightClasses {
  /** Styles applied to the root element. */
  root: string;
}

export type ChartsAxisHighlightClassKey = keyof ChartsAxisHighlightClasses;

export function getAxisHighlightUtilityClass(slot: string) {
  return generateUtilityClass('MuiChartsAxisHighlight', slot);
}

export const chartsAxisHighlightClasses: ChartsAxisHighlightClasses = generateUtilityClasses(
  'MuiChartsAxisHighlight',
  ['root'],
);

const useUtilityClasses = () => {
  const slots = {
    root: ['root'],
  };

  return composeClasses(slots, getAxisHighlightUtilityClass);
};

type AxisHighlight = 'none' | 'line' | 'band';

export type ChartsAxisHighlightProps = {
  x?: AxisHighlight;
  y?: AxisHighlight;
};

/**
 * Demos:
 *
 * - [Custom components](https://mui.com/x/react-charts/components/)
 *
 * API:
 *
 * - [ChartsAxisHighlight API](https://mui.com/x/api/charts/charts-axis-highlight/)
 */
function ChartsAxisHighlight(props: ChartsAxisHighlightProps) {
  const { x: xAxisHighlight, y: yAxisHighlight } = props;
  const { xAxisIds, xAxis, yAxisIds, yAxis } = useCartesianContext();
  const classes = useUtilityClasses();

  const USED_X_AXIS_ID = xAxisIds[0];
  const USED_Y_AXIS_ID = yAxisIds[0];

  const xScale = xAxis[USED_X_AXIS_ID].scale;
  const yScale = yAxis[USED_Y_AXIS_ID].scale;

  const { axis } = React.useContext(InteractionContext);

  const getXPosition = getValueToPositionMapper(xScale);
  const getYPosition = getValueToPositionMapper(yScale);

  const axisX = axis.x;
  const axisY = axis.y;

  const isBandScaleX = xAxisHighlight === 'band' && axisX !== null && isBandScale(xScale);
  const isBandScaleY = yAxisHighlight === 'band' && axisY !== null && isBandScale(yScale);

  if (process.env.NODE_ENV !== 'production') {
    const isXError = isBandScaleX && xScale(axisX.value) === undefined;
    const isYError = isBandScaleY && yScale(axisY.value) === undefined;

    if (isXError || isYError) {
      console.error(
        [
          `MUI X: The position value provided for the axis is not valid for the current scale.`,
          `This probably means something is wrong with the data passed to the chart.`,
          `The ChartsAxisHighlight component will not be displayed.`,
        ].join('\n'),
      );
    }
  }

  return (
    <React.Fragment>
      {isBandScaleX && xScale(axisX.value) !== undefined && (
        <path
          // @ts-expect-error, xScale value is checked in the statement above
          d={`M ${xScale(axisX.value) - (xScale.step() - xScale.bandwidth()) / 2} ${
            yScale.range()[0]
          } l ${xScale.step()} 0 l 0 ${
            yScale.range()[1] - yScale.range()[0]
          } l ${-xScale.step()} 0 Z`}
          className={classes.root}
          fill={chartsColorsVars.highlightBand}
          fillOpacity={0.1}
        />
      )}

      {isBandScaleY && yScale(axisY.value) !== undefined && (
        <path
          d={`M ${xScale.range()[0]} ${
            // @ts-expect-error, yScale value is checked in the statement above
            yScale(axisY.value) - (yScale.step() - yScale.bandwidth()) / 2
          } l 0 ${yScale.step()} l ${
            xScale.range()[1] - xScale.range()[0]
          } 0 l 0 ${-yScale.step()} Z`}
          className={classes.root}
          fill={chartsColorsVars.highlightBand}
          fillOpacity={0.1}
        />
      )}

      {xAxisHighlight === 'line' && axis.x !== null && (
        <line
          x1={getXPosition(axis.x.value)}
          x2={getXPosition(axis.x.value)}
          y1={yScale.range()[0]}
          y2={yScale.range()[1]}
          className={classes.root}
          fill={chartsColorsVars.highlightLine}
        />
      )}

      {yAxisHighlight === 'line' && axis.y !== null && (
        <line
          x1={xScale.range()[0]}
          x2={xScale.range()[1]}
          y1={getYPosition(axis.y.value)}
          y2={getYPosition(axis.y.value)}
          className={classes.root}
          strokeDasharray="5 2"
          fill={chartsColorsVars.highlightLine}
        />
      )}
    </React.Fragment>
  );
}

ChartsAxisHighlight.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  x: PropTypes.oneOf(['band', 'line', 'none']),
  y: PropTypes.oneOf(['band', 'line', 'none']),
} as any;

export { ChartsAxisHighlight };
