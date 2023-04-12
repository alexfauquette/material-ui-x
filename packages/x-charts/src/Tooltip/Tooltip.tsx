import * as React from 'react';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import NoSsr from '@mui/material/NoSsr';
import { symbol as d3Symbol, symbolsFill as d3SymbolsFill } from 'd3-shape';
import {
  AxisInteractionData,
  InteractionContext,
  ItemInteractionData,
} from '../context/InteractionProvider';
import { SeriesContext } from '../context/SeriesContextProvider';
import { CartesianContext } from '../context/CartesianContextProvider';
import { Highlight } from '../Highlight';
import { isBandScale } from '../hooks/useScale';
import { SVGContext, DrawingContext } from '../context/DrawingProvider';
import { getSymbol } from '../internals/utils';

function generateVirtualElement(mousePosition: { x: number; y: number } | null) {
  if (mousePosition === null) {
    return {
      getBoundingClientRect: () => ({
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        toJSON: () => '',
      }),
    };
  }
  const { x, y } = mousePosition;
  return {
    getBoundingClientRect: () => ({
      width: 0,
      height: 0,
      x,
      y,
      top: y,
      right: x,
      bottom: y,
      left: x,
      toJSON: () =>
        JSON.stringify({ width: 0, height: 0, x, y, top: y, right: x, bottom: y, left: x }),
    }),
  };
}

const useAxisEvents = (trigger: TooltipProps['trigger']) => {
  const svgRef = React.useContext(SVGContext);
  const { width, height, top, left } = React.useContext(DrawingContext);
  const { xAxis, yAxis, xAxisIds, yAxisIds } = React.useContext(CartesianContext);
  const { dispatch } = React.useContext(InteractionContext);

  const usedXAxis = xAxisIds[0];
  const usedYAxis = yAxisIds[0];

  // Use a ref to avoid rerendering on every mousemove event.
  const mousePosition = React.useRef({
    x: -1,
    y: -1,
  });

  const getUpdateY = React.useCallback(
    (y: number) => {
      if (usedYAxis === null) {
        return null;
      }
      const { scale: yScale, data: yAxisData } = yAxis[usedYAxis];
      if (!isBandScale(yScale)) {
        return { value: yScale.invert(y) };
      }
      const dataIndex = Math.floor((y - yScale.range()[0]) / yScale.step());
      if (dataIndex < 0 || dataIndex >= yAxisData!.length) {
        return null;
      }
      return {
        index: dataIndex,
        value: yAxisData![dataIndex],
      };
    },
    [usedYAxis, yAxis],
  );

  const getUpdateX = React.useCallback(
    (x: number) => {
      if (usedXAxis === null) {
        return null;
      }
      const { scale: xScale, data: xAxisData } = xAxis[usedXAxis];
      if (!isBandScale(xScale)) {
        const value = xScale.invert(x);

        const closestIndex = xAxisData?.findIndex((v: typeof value, index) => {
          if (v > value) {
            // @ts-ignore
            if (index === 0 || Math.abs(value - v) < Math.abs(value - xAxisData[index - 1])) {
              return true;
            }
          }
          if (v <= value) {
            if (
              index === xAxisData.length - 1 ||
              // @ts-ignore
              Math.abs(value - v) < Math.abs(value - xAxisData[index + 1])
            ) {
              return true;
            }
          }
          return false;
        });

        return {
          value: closestIndex !== undefined && closestIndex >= 0 ? xAxisData![closestIndex] : value,
          index: closestIndex,
        };
      }
      const dataIndex = Math.floor((x - xScale.range()[0]) / xScale.step());
      if (dataIndex < 0 || dataIndex >= xAxisData!.length) {
        return null;
      }
      return {
        index: dataIndex,
        value: xAxisData![dataIndex],
      };
    },
    [usedXAxis, xAxis],
  );

  const handleMouseOut = React.useCallback(() => {
    mousePosition.current = {
      x: -1,
      y: -1,
    };
    dispatch({ type: 'updateAxis', data: { x: null, y: null } });
  }, [dispatch]);

  const handleMouseMove = React.useCallback(
    (event: MouseEvent) => {
      mousePosition.current = {
        x: event.offsetX,
        y: event.offsetY,
      };
      const outsideX = event.offsetX < left || event.offsetX > left + width;
      const outsideY = event.offsetY < top || event.offsetY > top + height;
      if (outsideX || outsideY) {
        dispatch({ type: 'updateAxis', data: { x: null, y: null } });
        return;
      }
      const newStateX = getUpdateX(event.offsetX);
      const newStateY = getUpdateY(event.offsetY);

      dispatch({ type: 'updateAxis', data: { x: newStateX, y: newStateY } });
    },
    [dispatch, getUpdateX, getUpdateY, height, left, top, width],
  );

  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null || trigger !== 'axis') {
      return () => {};
    }

    element.addEventListener('onmouseout', handleMouseOut);
    element.addEventListener('mousemove', handleMouseMove);
    return () => {
      element.removeEventListener('onmouseout', handleMouseOut);
      element.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove, handleMouseOut, svgRef, trigger]);
};

const format = (data: any) => (typeof data === 'object' ? `(${data.x}, ${data.y})` : data);

function ItemTooltipContent(props: ItemInteractionData) {
  const { seriesId, type, dataIndex } = props;

  const series = React.useContext(SeriesContext)[type]!.series[seriesId];

  if (dataIndex === undefined) {
    return null;
  }

  const data = series.data[dataIndex];
  return (
    <p>
      {seriesId}: {format(data)}
    </p>
  );
}
function AxisTooltipContent(props: AxisInteractionData) {
  const dataIndex = props.x && props.x.index;
  const axisValue = props.x && props.x.value;

  const { xAxisIds, xAxis } = React.useContext(CartesianContext);
  const series = React.useContext(SeriesContext);

  const USED_X_AXIS_ID = xAxisIds[0];
  const xAxisName = xAxis[USED_X_AXIS_ID].id;

  const seriesConcerned = React.useMemo(() => {
    const rep: { type: string; id: string; color: string }[] = [];

    // @ts-ignore
    Object.keys(series).forEach((seriesType) => {
      // @ts-ignore
      series[seriesType].seriesOrder.forEach((seriesId: string) => {
        // @ts-ignore
        if (series[seriesType].series[seriesId].xAxisKey === USED_X_AXIS_ID) {
          rep.push({
            type: seriesType,
            id: seriesId,
            color: series[seriesType].series[seriesId].color,
          });
        }
      });
    });
    return rep;
  }, [USED_X_AXIS_ID, series]);

  if (dataIndex == null) {
    return null;
  }

  const markerSize = 30; // TODO: allows customization
  const shape = 'square';
  return (
    <React.Fragment>
      {axisValue != null && (
        <React.Fragment>
          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center' }}>
            {xAxisName}: {axisValue.toLocaleString()}
          </Typography>
          <Divider />
        </React.Fragment>
      )}
      {seriesConcerned.map(({ type, color, id }) => (
        <Typography variant="caption" key={id} sx={{ display: 'flex', alignItems: 'center' }}>
          <svg width={markerSize} height={markerSize}>
            <path
              // @ts-ignore TODO: Fix me
              d={d3Symbol(d3SymbolsFill[getSymbol(shape)], markerSize)()!}
              // TODO: Should be customizable. Maybe owner state would make more sense
              // fill={invertMarkers ? d.stroke : d.fill}
              // stroke={invertMarkers ? d.fill : d.stroke}
              fill={color}
              transform={`translate(${markerSize / 2}, ${markerSize / 2})`}
            />
          </svg>
          {/* @ts-ignore */}
          {id}: {format(series[type].series[id].data[dataIndex])}
        </Typography>
      ))}
    </React.Fragment>
  );
}

const useMouseTraker = () => {
  const svgRef = React.useContext(SVGContext);

  // Use a ref to avoid rerendering on every mousemove event.
  const [mousePosition, setMousePosition] = React.useState<null | { x: number; y: number }>(null);

  const handleMouseOut = React.useCallback(() => {
    setMousePosition(null);
  }, [setMousePosition]);

  const handleMouseMove = React.useCallback(
    (event: MouseEvent) => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY,
      });
    },
    [setMousePosition],
  );

  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null) {
      return () => {};
    }

    element.addEventListener('onmouseout', handleMouseOut);
    element.addEventListener('mousemove', handleMouseMove);
    return () => {
      element.removeEventListener('onmouseout', handleMouseOut);
      element.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove, handleMouseOut, svgRef]);

  return mousePosition;
};

export type TooltipProps = {
  /**
   * Select the kinf of tooltip to display
   * - 'item': Shows data about the item below the mouse.
   * - 'axis': Shows vlaues associated to the hovered x value
   * - 'none': Does nto display tooltip
   * @default 'item'
   */
  trigger?: 'item' | 'axis' | 'none';
};

export function Tooltip(props: TooltipProps) {
  const { trigger = 'axis' } = props;

  useAxisEvents(trigger);
  const mousePosition = useMouseTraker();

  const { item, axis } = React.useContext(InteractionContext);

  const highlightRef = React.useRef<SVGPathElement>(null);

  const displayedData = trigger === 'item' ? item : axis;
  const popperOpen = mousePosition !== null;

  return (
    <NoSsr>
      <React.Fragment>
        {popperOpen && (
          <Popper
            open={popperOpen}
            placement="right-start"
            anchorEl={generateVirtualElement(mousePosition)}
            style={{ padding: '16px', pointerEvents: 'none' }}
          >
            <Paper sx={{ p: 2 }}>
              {trigger === 'item' ? (
                <ItemTooltipContent {...(displayedData as ItemInteractionData)} />
              ) : (
                <AxisTooltipContent {...(displayedData as AxisInteractionData)} />
              )}
            </Paper>
          </Popper>
        )}
        <Highlight ref={highlightRef} />
      </React.Fragment>
    </NoSsr>
  );
}
