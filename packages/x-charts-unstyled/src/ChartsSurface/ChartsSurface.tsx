'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useAxisEvents } from '../hooks/useAxisEvents';

type ViewBox = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};
export interface ChartsSurfaceProps extends React.HTMLAttributes<SVGSVGElement> {
  /**
   * The width of the chart in px.
   */
  width: number;
  /**
   * The height of the chart in px.
   */
  height: number;
  viewBox?: ViewBox;
  className?: string;
  title?: string;
  desc?: string;
  children?: React.ReactNode;
  /**
   * If `true`, the charts will not listen to the mouse move event.
   * It might break interactive features, but will improve performance.
   * @default false
   */
  disableAxisListener?: boolean;
}

const ChartsSurface = React.forwardRef<SVGSVGElement, ChartsSurfaceProps>(function ChartsSurface(
  props: ChartsSurfaceProps,
  ref,
) {
  const {
    children,
    width,
    height,
    viewBox,
    disableAxisListener = false,
    className,
    title,
    desc,
    style,
    ...other
  } = props;
  const svgView = { width, height, x: 0, y: 0, ...viewBox };

  useAxisEvents(disableAxisListener);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`${svgView.x} ${svgView.y} ${svgView.width} ${svgView.height}`}
      ref={ref}
      className={className}
      style={{ touchAction: 'none', ...style }}
      {...other}
    >
      <title>{title}</title>
      <desc>{desc}</desc>
      {children}
    </svg>
  );
});

ChartsSurface.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  className: PropTypes.string,
  desc: PropTypes.string,
  /**
   * If `true`, the charts will not listen to the mouse move event.
   * It might break interactive features, but will improve performance.
   * @default false
   */
  disableAxisListener: PropTypes.bool,
  /**
   * The height of the chart in px.
   */
  height: PropTypes.number.isRequired,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  title: PropTypes.string,
  viewBox: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  /**
   * The width of the chart in px.
   */
  width: PropTypes.number.isRequired,
} as any;

export { ChartsSurface };
