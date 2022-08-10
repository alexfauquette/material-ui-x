import * as React from 'react';
import Typography from '@mui/material/Typography';
import { useTheme, styled } from '@mui/material/styles';
import { PickersDay, PickersDayProps } from '../PickersDay/PickersDay';
import { useUtils, useNow } from '../internals/hooks/useUtils';
import { PickerOnChangeFn } from '../internals/hooks/useViews';
import { DAY_SIZE, DAY_MARGIN } from '../internals/constants/dimensions';
import { PickerSelectionState } from '../internals/hooks/usePickerState';
import {
  PickersSlideTransition,
  SlideDirection,
  SlideTransitionProps,
} from './PickersSlideTransition';
import { DayValidationProps } from '../internals/hooks/validation/models';
import { useIsDayDisabled } from '../internals/hooks/validation/useDateValidation';
import { doNothing } from '../internals/utils/utils';

export interface ExportedDayPickerProps<TDate>
  extends DayValidationProps<TDate>,
    Pick<PickersDayProps<TDate>, 'disableHighlightToday' | 'showDaysOutsideCurrentMonth'> {
  autoFocus?: boolean;
  /**
   * If `true` renders `LoadingComponent` in calendar instead of calendar view.
   * Can be used to preload information and show it in calendar.
   * @default false
   */
  loading?: boolean;
  /**
   * Custom renderer for day. Check the [PickersDay](https://mui.com/x/api/date-pickers/pickers-day/) component.
   * @template TDate
   * @param {TDate} day The day to render.
   * @param {Array<TDate | null>} selectedDays The days currently selected.
   * @param {PickersDayProps<TDate>} pickersDayProps The props of the day to render.
   * @returns {JSX.Element} The element representing the day.
   */
  renderDay?: (
    day: TDate,
    selectedDays: TDate[],
    pickersDayProps: PickersDayProps<TDate>,
  ) => JSX.Element;
  /**
   * Component displaying when passed `loading` true.
   * @returns {React.ReactNode} The node to render when loading.
   * @default () => "..."
   */
  renderLoading?: () => React.ReactNode;
  /**
   * Formats the day of week displayed in the calendar header.
   * @param {string} day The day of week provided by the adapter's method `getWeekdays`.
   * @returns {string} The name to display.
   * @default (day) => day.charAt(0).toUpperCase()
   */
  dayOfWeekFormatter?: (day: string) => string;
}

export interface DayPickerProps<TDate> extends ExportedDayPickerProps<TDate> {
  autoFocus?: boolean;
  className?: string;
  currentMonth: TDate;
  selectedDays: (TDate | null)[];
  onSelectedDaysChange: PickerOnChangeFn<TDate>;
  disabled?: boolean;
  focusedDay: TDate | null;
  tabIndexDay?: TDate;
  isMonthSwitchingAnimating: boolean;
  setFocusedDay: (newFocusedDay: TDate) => void;
  onDayBlur: (blurredDay: TDate) => void;
  onMonthSwitchingAnimationEnd: () => void;
  readOnly?: boolean;
  reduceAnimations: boolean;
  slideDirection: SlideDirection;
  TransitionProps?: Partial<SlideTransitionProps>;
}

const defaultDayOfWeekFormatter = (day: string) => day.charAt(0).toUpperCase();

const weeksContainerHeight = (DAY_SIZE + DAY_MARGIN * 2) * 6;

const PickersCalendarDayHeader = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const PickersCalendarWeekDayLabel = styled(Typography)(({ theme }) => ({
  width: 36,
  height: 40,
  margin: '0 2px',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: theme.palette.text.secondary,
}));

const PickersCalendarLoadingContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: weeksContainerHeight,
});

const PickersCalendarSlideTransition = styled(PickersSlideTransition)({
  minHeight: weeksContainerHeight,
});

const PickersCalendarWeekContainer = styled('div')({ overflow: 'hidden' });

const PickersCalendarWeek = styled('div')({
  margin: `${DAY_MARGIN}px 0`,
  display: 'flex',
  justifyContent: 'center',
});

/**
 * @ignore - do not document.
 */
export function DayPicker<TDate>(props: DayPickerProps<TDate>) {
  const now = useNow<TDate>();
  const utils = useUtils<TDate>();
  const {
    setFocusedDay,
    onDayBlur,
    className,
    currentMonth,
    selectedDays,
    disabled,
    disableHighlightToday,
    focusedDay,
    tabIndexDay,
    isMonthSwitchingAnimating,
    loading,
    onSelectedDaysChange,
    onMonthSwitchingAnimationEnd,
    readOnly,
    reduceAnimations,
    renderDay,
    renderLoading = () => <span data-mui-test="loading-progress">...</span>,
    showDaysOutsideCurrentMonth,
    slideDirection,
    TransitionProps,
    disablePast,
    disableFuture,
    minDate,
    maxDate,
    shouldDisableDate,
    dayOfWeekFormatter = defaultDayOfWeekFormatter,
  } = props;
  const theme = useTheme();

  const isDateDisabled = useIsDayDisabled({
    shouldDisableDate,
    minDate,
    maxDate,
    disablePast,
    disableFuture,
  });

  const handleDaySelect = React.useCallback(
    (day: TDate, isFinish: PickerSelectionState = 'finish') => {
      if (readOnly) {
        return;
      }

      onSelectedDaysChange(day, isFinish);
    },
    [onSelectedDaysChange, readOnly],
  );

  const handleDayKeyDown = (day: TDate) => (event: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case 'ArrowUp':
        setFocusedDay(utils.addDays(day, -7));
        event.preventDefault();
        break;
      case 'ArrowDown':
        setFocusedDay(utils.addDays(day, 7));
        event.preventDefault();
        break;
      case 'ArrowLeft':
        setFocusedDay(utils.addDays(day, theme.direction === 'ltr' ? -1 : 1));
        event.preventDefault();
        break;
      case 'ArrowRight':
        setFocusedDay(utils.addDays(day, theme.direction === 'ltr' ? 1 : -1));
        event.preventDefault();
        break;
      case 'Home':
        setFocusedDay(utils.startOfWeek(day));
        event.preventDefault();
        break;
      case 'End':
        setFocusedDay(utils.endOfWeek(day));
        event.preventDefault();
        break;
      case 'PageUp':
        setFocusedDay(utils.getNextMonth(day));
        event.preventDefault();
        break;
      case 'PageDown':
        setFocusedDay(utils.getPreviousMonth(day));
        event.preventDefault();
        break;
      default:
        break;
    }
  };

  const currentMonthNumber = utils.getMonth(currentMonth);
  const validSelectedDays = selectedDays
    .filter((day): day is TDate => !!day)
    .map((day) => utils.startOfDay(day));

  // need a new ref whenever the `key` of the transition changes: http://reactcommunity.org/react-transition-group/transition/#Transition-prop-nodeRef.
  const transitionKey = currentMonthNumber;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const slideNodeRef = React.useMemo(() => React.createRef<HTMLDivElement>(), [transitionKey]);

  return (
    <React.Fragment>
      <PickersCalendarDayHeader>
        {utils.getWeekdays().map((day, i) => (
          <PickersCalendarWeekDayLabel aria-hidden key={day + i.toString()} variant="caption">
            {dayOfWeekFormatter?.(day) ?? day}
          </PickersCalendarWeekDayLabel>
        ))}
      </PickersCalendarDayHeader>

      {loading ? (
        <PickersCalendarLoadingContainer>{renderLoading()}</PickersCalendarLoadingContainer>
      ) : (
        <PickersCalendarSlideTransition
          transKey={transitionKey}
          onExited={onMonthSwitchingAnimationEnd}
          reduceAnimations={reduceAnimations}
          slideDirection={slideDirection}
          className={className}
          {...TransitionProps}
          nodeRef={slideNodeRef}
        >
          <PickersCalendarWeekContainer
            data-mui-test="pickers-calendar"
            ref={slideNodeRef}
            role="grid"
          >
            {utils.getWeekArray(currentMonth).map((week) => (
              <PickersCalendarWeek role="row" key={`week-${week[0]}`}>
                {week.map((day) => {
                  const hasFocus = tabIndexDay && utils.isSameDay(tabIndexDay, day);
                  const isDisabled = disabled || isDateDisabled(day);
                  const selected = validSelectedDays.some((selectedDay) =>
                    utils.isSameDay(selectedDay, day),
                  );

                  const pickersDayProps: PickersDayProps<TDate> = {
                    key: (day as any)?.toString(),
                    day,
                    isAnimating: isMonthSwitchingAnimating,
                    disabled: isDisabled,
                    autoFocus: focusedDay !== null && utils.isSameDay(day, focusedDay),
                    today: utils.isSameDay(day, now),
                    outsideCurrentMonth: utils.getMonth(day) !== currentMonthNumber,
                    selected,
                    tabIndex: selected || hasFocus ? 0 : -1,
                    disableHighlightToday,
                    showDaysOutsideCurrentMonth,
                    onFocus: () => setFocusedDay(day),
                    onBlur: () => onDayBlur(day),
                    onKeyDown: handleDayKeyDown(day),
                    onClick: disabled ? doNothing : () => handleDaySelect(day, 'finish'),
                  };

                  return renderDay ? (
                    renderDay(day, validSelectedDays, pickersDayProps)
                  ) : (
                    <div role="cell" key={pickersDayProps.key}>
                      <PickersDay {...pickersDayProps} />
                    </div>
                  );
                })}
              </PickersCalendarWeek>
            ))}
          </PickersCalendarWeekContainer>
        </PickersCalendarSlideTransition>
      )}
    </React.Fragment>
  );
}
