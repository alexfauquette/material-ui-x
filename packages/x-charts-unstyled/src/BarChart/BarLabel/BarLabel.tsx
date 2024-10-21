'use client';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { animated } from '@react-spring/web';
import PropTypes from 'prop-types';
import { BarLabelOwnerState } from './BarLabel.types';
import { chartsColorsVars } from '../../context/ThemeProvider';

export type BarLabelProps = Omit<React.SVGProps<SVGTextElement>, 'ref' | 'id'> & BarLabelOwnerState;

function BarLabel(props: BarLabelProps) {
  const { seriesId, dataIndex, color, isFaded, isHighlighted, classes, ...otherProps } = props;

  const { typography } = useTheme();

  return (
    <animated.text
      {...typography.body2}
      stroke="none"
      fill={chartsColorsVars.textPrimary}
      textAnchor="middle"
      dominantBaseline="central"
      pointerEvents="none"
      opacity={1}
      {...otherProps}
    />
  );
}

BarLabel.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  dataIndex: PropTypes.number.isRequired,
  isFaded: PropTypes.bool.isRequired,
  isHighlighted: PropTypes.bool.isRequired,
  seriesId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
} as any;

export { BarLabel };
