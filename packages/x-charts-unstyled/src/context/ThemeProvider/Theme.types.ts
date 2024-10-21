import * as React from 'react';

export type ChartsColorPalette = {
  divider: string;
  textPrimary: string;
  textSecondary: string;
  background: string;
  primary: string;
  /** The color used to display a band highlight. */
  highlightBand: string;
  /** The color used to display a line highlight. */
  highlightLine: string;
};

type TypographyType = {
  fontFamily: string;
  fontWeight: number;
  fontSize: string;
  lineHeight: number;
  letterSpacing: string;
};

export type ChartsTypography = {
  body1: Partial<TypographyType>;
  body2: Partial<TypographyType>;
  subtitle1: Partial<TypographyType>;
  caption: Partial<TypographyType>;
};

type ChartsMode = 'light' | 'dark';

export type ThemeProviderProps = {
  mode?: ChartsMode;
  /**
   * The reading direction.
   * By default 'ltr' except if an parent theme defines it otherwise.
   */
  direction?: 'ltr' | 'rtl';
  /**
   * The palette of color for design aspects (Not the series plotting)
   */
  palette?: Partial<ChartsColorPalette>;
  /**
   * The palette of color for design aspects (Not the series plotting)
   */
  darkPalette?: Partial<ChartsColorPalette>;
  /**
   * @default ".mode-dark"
   */
  darkModeSelector?: string;
  /**
   * Typography style.
   */
  typography?: Partial<ChartsTypography>;
  /**
   * Color palette used to colorize multiple series.
   * @default blueberryTwilightPalette
   */
  colors?: string[] | ((mode: ChartsMode) => string[]);
  children: React.ReactNode;
};
