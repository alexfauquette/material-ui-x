import {
  DesktopNextTimePickerProps,
  DesktopNextTimePickerSlots,
  DesktopNextTimePickerSlotsComponent,
  DesktopNextTimePickerSlotsComponentsProps,
} from '../DesktopNextTimePicker';
import {
  MobileNextTimePickerProps,
  MobileNextTimePickerSlots,
  MobileNextTimePickerSlotsComponent,
  MobileNextTimePickerSlotsComponentsProps,
} from '../MobileNextTimePicker';

export interface NextTimePickerSlots<TDate>
  extends DesktopNextTimePickerSlots<TDate>,
    MobileNextTimePickerSlots<TDate> {}

export interface NextTimePickerSlotsComponents<TDate>
  extends DesktopNextTimePickerSlotsComponent<TDate>,
    MobileNextTimePickerSlotsComponent<TDate> {}

export interface NextTimePickerSlotsComponentsProps<TDate>
  extends DesktopNextTimePickerSlotsComponentsProps<TDate>,
    MobileNextTimePickerSlotsComponentsProps<TDate> {}

export interface NextTimePickerProps<TDate>
  extends DesktopNextTimePickerProps<TDate>,
    MobileNextTimePickerProps<TDate> {
  /**
   * CSS media query when `Mobile` mode will be changed to `Desktop`.
   * @default '@media (pointer: fine)'
   * @example '@media (min-width: 720px)' or theme.breakpoints.up("sm")
   */
  desktopModeMediaQuery?: string;
  /**
   * Overrideable components.
   * @default {}
   * @deprecated
   */
  components?: Partial<NextTimePickerSlotsComponents<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated
   */
  componentsProps?: NextTimePickerSlotsComponentsProps<TDate>;
  /**
   * Overrideable components.
   * @default {}
   */
  slots?: NextTimePickerSlots<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotsProps?: NextTimePickerSlotsComponentsProps<TDate>;
}
