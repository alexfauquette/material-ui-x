import * as React from 'react';
import PropTypes from 'prop-types';
import { animated, useTransition } from '@react-spring/web';
import { useCartesianContext } from '../context/CartesianProvider';
import { MarkElementProps } from './MarkElement';
import { getValueToPositionMapper, useXScale, useYScale } from '../hooks/useScale';
import { useChartId } from '../hooks/useChartId';
import { DEFAULT_X_AXIS_KEY } from '../constants';
import { DefaultizedLineSeriesType, LineItemIdentifier } from '../models/seriesType/line';
import { cleanId } from '../internals/cleanId';
import getColor from './getColor';
import { useLineSeries } from '../hooks/useSeries';
import { useDrawingArea } from '../hooks/useDrawingArea';
import { AxisId } from '../models/axis';
import { NewMarkElement } from './NewMarkElement';
import { DrawingArea } from '../context/DrawingProvider';

export interface NewMarkPlotSlots {
  mark?: React.JSXElementConstructor<MarkElementProps>;
}

export interface NewMarkPlotSlotProps {
  mark?: Partial<MarkElementProps>;
}

export interface NewMarkPlotProps
  extends React.SVGAttributes<SVGSVGElement>,
    Pick<MarkElementProps, 'skipAnimation'> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: NewMarkPlotSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: NewMarkPlotSlotProps;
  /**
   * Callback fired when a line mark item is clicked.
   * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
   * @param {LineItemIdentifier} lineItemIdentifier The line mark item identifier.
   */
  onItemClick?: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    lineItemIdentifier: LineItemIdentifier,
  ) => void;
}

const from = ({ x, y }) => ({
  x,
  y,
  // transform: `translate(${x}px, ${y}px)`,
  // transformOrigin: `${x}px ${y}px`,
});

const update = ({ x, y }) => ({
  x,
  y,
  //  transform: `translate(${x}px, ${y}px)`,
  //  transformOrigin: `${x}px ${y}px`,
});

function PerSeriesNewMarkPlot(props: {
  xAxisId: AxisId;
  yAxisId: AxisId;
  xData: any[];
  series: DefaultizedLineSeriesType & {
    stackedData: [number, number][];
  };
  drawingArea: DrawingArea;
  colorGetter: (dataIndex: number) => string;
  skipAnimation?: boolean;
}) {
  const { xAxisId, yAxisId, xData, series, drawingArea, colorGetter, skipAnimation } = props;

  const xScale = useXScale(xAxisId);
  const xGetPosition = getValueToPositionMapper(xScale);
  const yScale = useYScale(yAxisId);

  const { data, stackedData, showMark = true } = series;

  const points = React.useMemo(
    () =>
      xData
        ?.map((x, index) => {
          const value = data[index] == null ? null : stackedData[index][1];
          return {
            x: xGetPosition(x),
            y: value === null ? null : yScale(value)!,
            position: x,
            value,
            index,
          };
        })
        .filter(({ x, y, index, position, value }) => {
          if (value === null || y === null) {
            // Remove missing data point
            return false;
          }
          if (!drawingArea.isPointInside({ x, y })) {
            // Remove out of range
            return false;
          }
          return typeof showMark === 'function'
            ? showMark({
                x,
                y,
                index,
                position,
                value,
              })
            : showMark;
        }),
    [data, drawingArea, showMark, stackedData, xData, xGetPosition, yScale],
  );

  const transition = useTransition(points, {
    keys: (item) => item.index,
    initial: from,
    from,
    enter: update,
    update,
    leave: from,

    immediate: skipAnimation,
  });

  return transition((style, { index }) => {
    return (
      <animated.circle
        fill={colorGetter(index)}
        // style={style}
        key={index}
        cx={style.x}
        cy={style.y}
        r={5}
      />
      // <NewMarkElement
      //   id={series.id}
      //   dataIndex={index}
      //   shape="circle"
      //   key={index}
      //   style={style}
      //   color={colorGetter(index)}
      // />
    );
  });
}
/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [NewMarkPlot API](https://mui.com/x/api/charts/mark-plot/)
 */
function NewMarkPlot(props: NewMarkPlotProps) {
  const { slots, slotProps, skipAnimation, onItemClick, ...other } = props;

  const seriesData = useLineSeries();
  const axisData = useCartesianContext();
  const chartId = useChartId();
  const drawingArea = useDrawingArea();

  // const Mark = slots?.mark ?? MarkElement;

  if (seriesData === undefined) {
    return null;
  }
  const { series, stackingGroups } = seriesData;
  const { xAxis, yAxis, xAxisIds, yAxisIds } = axisData;
  const defaultXAxisId = xAxisIds[0];
  const defaultYAxisId = yAxisIds[0];

  return (
    <g {...other}>
      {stackingGroups.flatMap(({ ids: groupIds }) => {
        return groupIds.map((seriesId) => {
          const {
            xAxisId: xAxisIdProp,
            yAxisId: yAxisIdProp,
            xAxisKey = defaultXAxisId,
            yAxisKey = defaultYAxisId,
            stackedData,
            showMark = true,
          } = series[seriesId];

          if (showMark === false) {
            return null;
          }

          const xAxisId = xAxisIdProp ?? xAxisKey;
          const yAxisId = yAxisIdProp ?? yAxisKey;

          const xData = xAxis[xAxisId].data;

          if (process.env.NODE_ENV !== 'production') {
            if (xData === undefined) {
              throw new Error(
                `MUI X: ${
                  xAxisId === DEFAULT_X_AXIS_KEY
                    ? 'The first `xAxis`'
                    : `The x-axis with id "${xAxisId}"`
                } should have data property to be able to display a line plot.`,
              );
            }
            if (xData.length < stackedData.length) {
              throw new Error(
                `MUI X: The data length of the x axis (${xData.length} items) is lower than the length of series (${stackedData.length} items).`,
              );
            }
          }

          const clipId = cleanId(`${chartId}-${seriesId}-line-clip`); // We assume that if displaying line mark, the line will also be rendered

          const colorGetter = getColor(series[seriesId], xAxis[xAxisId], yAxis[yAxisId]);

          if (!xData) {
            return null;
          }

          return (
            <g key={seriesId} clipPath={`url(#${clipId})`}>
              <PerSeriesNewMarkPlot
                xData={xData}
                drawingArea={drawingArea}
                xAxisId={xAxisId}
                yAxisId={yAxisId}
                series={series[seriesId]}
                colorGetter={colorGetter}
                skipAnimation={skipAnimation}
              />
            </g>
          );
        });
      })}
    </g>
  );
}

NewMarkPlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Callback fired when a line mark item is clicked.
   * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
   * @param {LineItemIdentifier} lineItemIdentifier The line mark item identifier.
   */
  onItemClick: PropTypes.func,
  /**
   * If `true`, animations are skipped.
   * @default false
   */
  skipAnimation: PropTypes.bool,
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.object,
} as any;

export { NewMarkPlot };
