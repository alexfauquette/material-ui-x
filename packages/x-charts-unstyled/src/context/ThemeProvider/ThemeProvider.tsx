'use client';
import * as React from 'react';
import { ChartsColorPalette, ThemeProviderProps } from './Theme.types';
import { blueberryTwilightPalette } from '../../colorPalettes';
import { DirectionContext } from './DirectionContext';
import { ColorsContext } from './ColorsContext';

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

function paletteToVars(palette: ChartsColorPalette): React.StyleHTMLAttributes<'div'> {
  return {
    // @ts-ignore
    '--charts-divider': palette.divider,
    '--charts-text-primary': palette.textPrimary,
    '--charts-text-secondary': palette.textSecondary,
    '--charts-background': palette.background,
    '--charts-primary': palette.primary,
  };
}

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
        <div
          style={{
            ...paletteToVars({ ...defaultLightPalette, ...palette }),
            // @ts-ignore
            ':where(.mode-dark)': paletteToVars({ ...defaultDarkPalette, ...darkPalette }),
          }}
        >
          {children}
        </div>
      </ColorsContext.Provider>
    </DirectionContext.Provider>
  );
}
