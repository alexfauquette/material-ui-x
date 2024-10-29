import * as React from 'react';
import clsx from 'clsx';
import { SxProps, Theme } from '@mui/material/styles';
import { ChartsTooltipClasses } from './chartsTooltipClasses';
import { useItemTooltip } from './useItemTooltip';
import {
  ChartsTooltipCell,
  ChartsTooltipMark,
  ChartsTooltipPaper,
  ChartsTooltipRow,
  ChartsTooltipTable,
} from './ChartsTooltipTable';

export interface ChartsItemTooltipContentProps {
  sx?: SxProps<Theme>;
  classes: ChartsTooltipClasses;
}

/**
 * @ignore - internal component.
 */
function ChartsItemTooltipContent(props: ChartsItemTooltipContentProps) {
  const { classes, sx } = props;
  const tooltipData = useItemTooltip();

  if (!tooltipData) {
    return null;
  }

  const { color, label, formattedValue } = tooltipData;

  return (
    <ChartsTooltipPaper sx={sx} className={classes.paper}>
      <ChartsTooltipTable className={classes.table}>
        <tbody>
          <ChartsTooltipRow className={classes.row}>
            <ChartsTooltipCell className={clsx(classes.markCell, classes.cell)}>
              <ChartsTooltipMark color={color} className={classes.mark} />
            </ChartsTooltipCell>
            <ChartsTooltipCell className={clsx(classes.labelCell, classes.cell)}>
              {label}
            </ChartsTooltipCell>
            <ChartsTooltipCell className={clsx(classes.valueCell, classes.cell)}>
              {formattedValue}
            </ChartsTooltipCell>
          </ChartsTooltipRow>
        </tbody>
      </ChartsTooltipTable>
    </ChartsTooltipPaper>
  );
}

export { ChartsItemTooltipContent };
