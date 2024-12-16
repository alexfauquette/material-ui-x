import {
  AxisId,
  UseChartSeriesSignature,
  ChartPluginSignature,
  DefaultizedZoomOption,
  UseChartCartesianAxisSignature,
  UseChartCartesianAxisDefaultizedParameters,
  ZoomData,
} from '@mui/x-charts/internals';

export interface UseChartProZoomParameters {
  /**
   * The list of zoom data related to each axis.
   */
  zoom?: ZoomData[];
  /**
   * Callback fired when the zoom has changed.
   *
   * @param {ZoomData[]} zoomData Updated zoom data.
   */
  onZoomChange?: (zoomData: ZoomData[] | ((zoomData: ZoomData[]) => ZoomData[])) => void;
}

export type UseChartProZoomDefaultizedParameters = UseChartProZoomParameters &
  UseChartCartesianAxisDefaultizedParameters & {
    /**
     * The zoom options for each axis.
     */
    options: Record<AxisId, DefaultizedZoomOption>;
  };

export interface UseChartProZoomState {
  zoom: {
    /**
     * The zoom options for each axis.
     */
    options: Record<AxisId, DefaultizedZoomOption>;
    /**
     * Whether the user is currently interacting with the chart.
     * This is useful to disable animations while the user is interacting.
     */
    isInteracting: boolean;
    /**
     * Mapping of axis id to the zoom data.
     */
    zoomData: ZoomData[];
  };
}

export interface UseChartProZoomInstance {
  /**
   * Set the zoom data state.
   * @param {ZoomData[] | ((prev: ZoomData[]) => ZoomData[])} value  The new value. Can either be the new zoom data, or an updater function.
   * @returns {void}
   */
  setZoomData: (value: ZoomData[] | ((prev: ZoomData[]) => ZoomData[])) => void;
}

export type UseChartProZoomSignature = ChartPluginSignature<{
  params: UseChartProZoomParameters;
  defaultizedParams: UseChartProZoomDefaultizedParameters;
  state: UseChartProZoomState;
  instance: UseChartProZoomInstance;
  modelNames: 'zoom';
  dependencies: [UseChartSeriesSignature, UseChartCartesianAxisSignature];
}>;
