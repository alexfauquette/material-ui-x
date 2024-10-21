'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import useSlotProps from '@mui/utils/useSlotProps';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { AnimatedProps, animated } from '@react-spring/web';
import { SlotComponentPropsFromProps } from '../internals/SlotComponentPropsFromProps';
import { useInteractionItemProps } from '../hooks/useInteractionItemProps';
import { SeriesId } from '../models/seriesType/common';
import { useItemHighlighted } from '../context';

export interface BarElementClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element when highlighted. */
  highlighted: string;
  /** Styles applied to the root element when faded. */
  faded: string;
}

export type BarElementClassKey = keyof BarElementClasses;

export interface BarElementOwnerState {
  id: SeriesId;
  dataIndex: number;
  color: string;
  isFaded: boolean;
  isHighlighted: boolean;
  classes?: Partial<BarElementClasses>;
}

export function getBarElementUtilityClass(slot: string) {
  return generateUtilityClass('MuiBarElement', slot);
}

export const barElementClasses: BarElementClasses = generateUtilityClasses('MuiBarElement', [
  'root',
  'highlighted',
  'faded',
]);

const useUtilityClasses = (ownerState: BarElementOwnerState) => {
  const { classes, id, isFaded, isHighlighted } = ownerState;
  const slots = {
    root: ['root', `series-${id}`, isHighlighted && 'highlighted', isFaded && 'faded'],
  };

  return composeClasses(slots, getBarElementUtilityClass, classes);
};


interface BarProps
  extends Omit<
      React.SVGProps<SVGRectElement>,
      'id' | 'color' | 'ref' | 'x' | 'y' | 'height' | 'width'
    >,
    AnimatedProps<{
      x?: string | number | undefined;
      y?: string | number | undefined;
      height?: string | number | undefined;
      width?: string | number | undefined;
    }> {
  ownerState: BarElementOwnerState;
}

export interface BarElementSlots {
  /**
   * The component that renders the bar.
   * @default BarElementPath
   */
  bar?: React.ElementType<BarProps>;
}
export interface BarElementSlotProps {
  bar?: SlotComponentPropsFromProps<BarProps, {}, BarElementOwnerState>;
}

export type BarElementProps = Omit<BarElementOwnerState, 'isFaded' | 'isHighlighted'> &
  Omit<React.SVGProps<SVGRectElement>, 'ref' | 'id'> & {
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps?: BarElementSlotProps;
    /**
     * Overridable component slots.
     * @default {}
     */
    slots?: BarElementSlots;
  };

function BarElement(props: BarElementProps) {
  const {
    id,
    dataIndex,
    classes: innerClasses,
    color,
    slots,
    slotProps,
    style,
    onClick,
    ...other
  } = props;
  const getInteractionItemProps = useInteractionItemProps();
  const { isFaded, isHighlighted } = useItemHighlighted({
    seriesId: id,
    dataIndex,
  });

  const ownerState = {
    id,
    dataIndex,
    classes: innerClasses,
    color,
    isFaded,
    isHighlighted,
  };
  const classes = useUtilityClasses(ownerState);

  const Bar = slots?.bar ?? animated.rect;

  const barProps = useSlotProps({
    elementType: Bar,
    externalSlotProps: slotProps?.bar,
    externalForwardedProps: other,
    additionalProps: {
      stroke: 'none',
      fill: ownerState.color,
      ...getInteractionItemProps({ type: 'bar', seriesId: id, dataIndex }),
      style,
      onClick,
      cursor: onClick ? 'pointer' : 'unset',
    },
    className: classes.root,
    ownerState,
  });

  return <Bar {...barProps} />;
}

BarElement.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  dataIndex: PropTypes.number.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.object,
} as any;

export { BarElement };
