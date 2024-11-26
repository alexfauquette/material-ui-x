'use client';
import type { CartesianProviderProps } from '../CartesianProvider';
import type { SeriesProviderProps } from '../SeriesProvider';
import type { ZAxisContextProviderProps } from '../ZAxisContextProvider';
import type { ChartDataProviderProps } from './ChartDataProvider';
import { HighlightedProviderProps } from '../HighlightedProvider';
import { useDefaultizeAxis } from './useDefaultizeAxis';
import { PluginProviderProps } from '../PluginProvider';
import { AnimationProviderProps } from '../AnimationProvider';
import { ChartProviderProps } from '../ChartProvider';

export const useChartDataProviderProps = (props: ChartDataProviderProps) => {
  const {
    width,
    height,
    series,
    margin,
    xAxis,
    yAxis,
    zAxis,
    colors,
    dataset,
    highlightedItem,
    onHighlightChange,
    plugins,
    children,
    skipAnimation,
  } = props;

  const [defaultizedXAxis, defaultizedYAxis] = useDefaultizeAxis(xAxis, yAxis, dataset);

  const chartProviderProps: Omit<ChartProviderProps<[]>, 'children'> = {
    plugins: [],
    pluginParams: {
      width,
      height,
      margin,
    },
  };

  const animationProviderProps: Omit<AnimationProviderProps, 'children'> = {
    skipAnimation,
  };

  const pluginProviderProps: Omit<PluginProviderProps, 'children'> = {
    plugins,
  };

  const seriesProviderProps: Omit<SeriesProviderProps, 'children'> = {
    series,
    colors,
    dataset,
  };

  const cartesianProviderProps: Omit<CartesianProviderProps, 'children'> = {
    xAxis: defaultizedXAxis,
    yAxis: defaultizedYAxis,
    dataset,
  };

  const zAxisContextProps: Omit<ZAxisContextProviderProps, 'children'> = {
    zAxis,
    dataset,
  };

  const highlightedProviderProps: Omit<HighlightedProviderProps, 'children'> = {
    highlightedItem,
    onHighlightChange,
  };

  return {
    children,
    seriesProviderProps,
    cartesianProviderProps,
    zAxisContextProps,
    highlightedProviderProps,
    pluginProviderProps,
    animationProviderProps,
    xAxis: defaultizedXAxis,
    yAxis: defaultizedYAxis,
    chartProviderProps,
  };
};
