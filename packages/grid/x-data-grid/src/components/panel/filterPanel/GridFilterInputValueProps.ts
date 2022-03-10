import * as React from 'react';
import { GridFilterItem } from '../../../models/gridFilterItem';
import { GridSlotsComponent } from '../../../models/gridSlotsComponent';
import { GridSlotsComponentsProps } from '../../../models/gridSlotsComponentsProps';

export interface GridFilterInputValueProps {
  item: GridFilterItem;
  applyValue: (value: GridFilterItem) => void;
  // Is any because if typed as GridApiRef a dep cycle occurs. Same happens if ApiContext is used.
  apiRef: any;
  focusElementRef?: React.Ref<any>;
  components?: Partial<GridSlotsComponent>;
  componentsProps?: Partial<GridSlotsComponentsProps>;
}
