import { GridDensity } from '../../../models/gridDensity';

export interface GridDensityState {
  value: GridDensity;
  rowHeight: number;
  headerHeight: number;
  headerFilterHeight: number;
  factor: number;
}
