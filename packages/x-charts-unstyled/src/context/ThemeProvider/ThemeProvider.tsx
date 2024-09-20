'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { ChartsColorPalette, ThemeProviderProps } from './Theme.types';
import { blueberryTwilightPalette } from '../../colorPalettes';
import { DirectionContext } from './DirectionContext';
import { ColorsContext } from './ColorsContext';
import { barElementClasses } from '../../BarChart/BarElement';
import { barLabelClasses } from '../../BarChart';

const defaultLightPalette: ChartsColorPalette = {
  divider: 'rgba(0, 0, 0, 0.12)',
  textPrimary: 'rgba(0, 0, 0, 0.87)',
  textSecondary: 'rgba(0, 0, 0, 0.6)',
  background: '#fff',
  primary: '#1976d2',
};
const defaultDarkPalette: ChartsColorPalette = {
  divider: 'rgba(255, 255, 255, 0.12)',
  textPrimary: '#fff',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  background: '#121212',
  primary: '#90caf9',
};

function paletteToVars(
  palette: ChartsColorPalette,
  mode: 'light' | 'dark',
): React.StyleHTMLAttributes<'div'> {
  if (mode === 'dark') {
    return {
      // @ts-ignore
      '--charts-dark-divider': palette.divider,
      '--charts-dark-text-primary': palette.textPrimary,
      '--charts-dark-text-secondary': palette.textSecondary,
      '--charts-dark-background': palette.background,
      '--charts-dark-primary': palette.primary,
    };
  }

  return {
    // @ts-ignore
    '--charts-divider': palette.divider,
    '--charts-text-primary': palette.textPrimary,
    '--charts-text-secondary': palette.textSecondary,
    '--charts-background': palette.background,
    '--charts-primary': palette.primary,
  };
}

export const chartsDarkColorsVars = {
  divider: 'var(--charts-dark-divider)',
  textPrimary: 'var(--charts-dark-text-primary)',
  textSecondary: 'var(--charts-dark-text-secondary)',
  background: 'var(--charts-dark-background)',
  primary: 'var(--charts-dark-primary)',
} as const;

export const chartsLightColorsVars = {
  divider: 'var(--charts-divider)',
  textPrimary: 'var(--charts-text-primary)',
  textSecondary: 'var(--charts-text-secondary)',
  background: 'var(--charts-background)',
  primary: 'var(--charts-primary)',
} as const;

export const StyledWrapper = styled('div', {
  name: 'MuiChartThemeProvider',
  slot: 'Root',
})(() => ({
  [`& .${barElementClasses.root}`]: {
    transition: 'opacity 0.2s ease-in, fill 0.2s ease-in',
    [`&.${barElementClasses.highlighted}`]: {
      filter: 'saturate(110%)',
    },
    [`&.${barElementClasses.faded}`]: {
      opacity: '0.3',
    },
  },
  [`& .${barLabelClasses.root}`]: {
    transition: 'opacity 0.2s ease-in, fill 0.2s ease-in',
    [`&.${barLabelClasses.faded}`]: {
      opacity: 0.3,
    },
  },
}));

export function ThemeProvider(props: ThemeProviderProps) {
  const {
    mode = 'light',
    direction,
    palette,
    darkPalette,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    typography,
    colors = blueberryTwilightPalette,
    children,
  } = props;

  const computedColors = React.useMemo(
    () => (Array.isArray(colors) ? colors : colors(mode)),
    [mode, colors],
  );
  return (
    <DirectionContext.Provider value={direction ?? 'ltr'}>
      <ColorsContext.Provider value={computedColors}>
        <StyledWrapper
          style={{
            ...paletteToVars({ ...defaultLightPalette, ...palette }, 'light'),
            ...paletteToVars({ ...defaultDarkPalette, ...darkPalette }, 'dark'),
          }}
        >
          {children}
        </StyledWrapper>
      </ColorsContext.Provider>
    </DirectionContext.Provider>
  );
}
