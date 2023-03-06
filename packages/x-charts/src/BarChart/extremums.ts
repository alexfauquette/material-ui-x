import { AxisConfig } from '../models/axis';
import { StackedBarSeriesType } from './formatter';

type GetExtremumParamsX = {
  series: { [id: string]: StackedBarSeriesType };
  xAxis: AxisConfig;
};
type GetExtremumParamsY = {
  series: { [id: string]: StackedBarSeriesType };

  yAxis: AxisConfig;
};

type GetExtremumResult = [number, number];

export const getExtremumX = (params: GetExtremumParamsX): GetExtremumResult => {
  const { xAxis } = params;

  const minX = Math.min(...(xAxis.data ?? []));
  const maxX = Math.max(...(xAxis.data ?? []));
  return [minX, maxX];
};

export const getExtremumY = (params: GetExtremumParamsY): GetExtremumResult => {
  const { series, yAxis } = params;

  const [minY, maxY] = Object.keys(series)
    .filter((seriesId) => series[seriesId].yAxisKey === yAxis.id)
    .reduce(
      (acc: [number, number] | [null, null], seriesId) => {
        const [seriesMin, serriesMax] = series[seriesId].stackedData.reduce(
          (seriesAcc, [min, max]) => [Math.min(min, seriesAcc[0]), Math.max(max, seriesAcc[1])],
          series[seriesId].stackedData[0],
        );
        if (acc[0] === null || acc[1] === null) {
          return [seriesMin, serriesMax];
        }
        return [Math.min(seriesMin, acc[0]), Math.max(serriesMax, acc[1])];
      },
      [null, null],
    );

  return [minY || 0, maxY || 0];
};
