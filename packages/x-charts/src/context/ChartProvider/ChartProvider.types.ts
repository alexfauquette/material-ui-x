import * as React from 'react';
import {
  ChartAnyPluginSignature,
  ChartInstance,
  ChartPublicAPI,
  ConvertSignaturesIntoPlugins,
  MergeSignaturesProperty,
} from '../../internals/plugins/models';
import { ChartStore } from '../../internals/plugins/utils/ChartStore';
import { ChartCorePluginSignatures } from '../../internals/plugins/corePlugins';

export type ChartContextValue<
  TSignatures extends readonly ChartAnyPluginSignature[],
  TOptionalSignatures extends readonly ChartAnyPluginSignature[] = [],
> = {
  /**
   * And object with all the methods needed to interact with the chart.
   */
  instance: ChartInstance<TSignatures, TOptionalSignatures>;
  /**
   * A subset of the `instance` method that are exposed to the developers.
   */
  publicAPI: ChartPublicAPI<TSignatures, TOptionalSignatures>;
  /**
   * The internal state of the chart.
   */
  store: ChartStore<TSignatures>;
  /**
   * The ref to the <svg />.
   */
  svgRef: React.RefObject<SVGSVGElement>;
};

export interface ChartProviderProps<TSignatures extends readonly ChartAnyPluginSignature[] = []> {
  plugins?: ConvertSignaturesIntoPlugins<TSignatures>;
  pluginParams?: MergeSignaturesProperty<[...ChartCorePluginSignatures, ...TSignatures], 'params'>;
  children: React.ReactNode;
}