'use client';
import * as React from 'react';
import { ChartsColorPalette, ThemeProviderProps } from './Theme.types';
import { blueberryTwilightPalette } from '../../colorPalettes';
import { DirectionContext } from './DirectionContext';
import { ColorsContext } from './ColorsContext';
import { defaultTypography, TypographyContext } from './TypographyContext';

export const defaultLightPalette: ChartsColorPalette = {
  divider: 'rgba(0, 0, 0, 0.12)',
  textPrimary: 'rgba(0, 0, 0, 0.87)',
  textSecondary: 'rgba(0, 0, 0, 0.6)',
  background: '#fff',
  primary: '#1976d2',
  highlightBand: 'gray',
  highlightLine: '#fff',
};

export const defaultDarkPalette: ChartsColorPalette = {
  divider: 'rgba(255, 255, 255, 0.12)',
  textPrimary: '#fff',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  background: '#121212',
  primary: '#90caf9',
  highlightBand: '#fff',
  highlightLine: '#000000',
};

export function paletteToVars(palette: ChartsColorPalette): React.StyleHTMLAttributes<'div'> {
  return {
    // @ts-ignore
    '--charts-divider': palette.divider,
    '--charts-text-primary': palette.textPrimary,
    '--charts-text-secondary': palette.textSecondary,
    '--charts-background': palette.background,
    '--charts-primary': palette.primary,
    '--charts-highlight-band': palette.highlightBand,
    '--charts-highlight-line': palette.highlightLine,
  };
}

export const chartsColorsVars = {
  divider: 'var(--charts-divider)',
  textPrimary: 'var(--charts-text-primary)',
  textSecondary: 'var(--charts-text-secondary)',
  background: 'var(--charts-background)',
  primary: 'var(--charts-primary)',
  highlightBand: 'var(--charts-highlight-band)',
  highlightLine: 'var(--charts-highlight-line)',
} as const;

export function ThemeProvider(props: ThemeProviderProps) {
  const {
    mode = 'light',
    direction,
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
        <TypographyContext.Provider value={defaultTypography}>
          {children}
        </TypographyContext.Provider>
      </ColorsContext.Provider>
    </DirectionContext.Provider>
  );
}
