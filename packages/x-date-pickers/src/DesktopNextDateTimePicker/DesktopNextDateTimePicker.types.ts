import {
  UseDesktopPickerSlotsComponent,
  UseDesktopPickerSlotsComponentsProps,
  DesktopOnlyPickerProps,
} from '../internals/hooks/useDesktopPicker';
import {
  BaseNextDateTimePickerProps,
  BaseNextDateTimePickerSlotsComponent,
  BaseNextDateTimePickerSlotsComponentsProps,
} from '../NextDateTimePicker/shared';
import { MakeOptional } from '../internals/models/helpers';
import { BaseNextNonStaticPickerExternalProps } from '../internals/models/props/basePickerProps';
import { DateOrTimeView } from '../internals/models/views';

export interface DesktopNextDateTimePickerSlotsComponent<TDate>
  extends BaseNextDateTimePickerSlotsComponent<TDate>,
    MakeOptional<
      UseDesktopPickerSlotsComponent<TDate, DateOrTimeView>,
      'Field' | 'OpenPickerIcon'
    > {}

export interface DesktopNextDateTimePickerSlotsComponentsProps<TDate>
  extends BaseNextDateTimePickerSlotsComponentsProps<TDate>,
    UseDesktopPickerSlotsComponentsProps<TDate, DateOrTimeView> {}

export interface DesktopNextDateTimePickerProps<TDate>
  extends BaseNextDateTimePickerProps<TDate>,
    DesktopOnlyPickerProps<TDate>,
    BaseNextNonStaticPickerExternalProps {
  /**
   * Overrideable components.
   * @default {}
   * @deprecated
   */
  components?: DesktopNextDateTimePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated
   */
  componentsProps?: DesktopNextDateTimePickerSlotsComponentsProps<TDate>;
  /**
   * Overrideable components.
   * @default {}
   */
  slots?: DesktopNextDateTimePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotsProps?: DesktopNextDateTimePickerSlotsComponentsProps<TDate>;
}
