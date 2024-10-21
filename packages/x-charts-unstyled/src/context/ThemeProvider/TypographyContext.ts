import * as React from 'react';

export const defaultTypography = {
  axisTickLabel: {
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    fontWeight: 400,
    fontSize: '0.75rem',
    lineHeight: 1.66,
    letterSpacing: '0.03333em',
  },
  axisLabel: {
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    fontWeight: 400,
    fontSize: '1rem',
    lineHeight: 1.5,
    letterSpacing: '0.00938em',
  },
  legendLabel: {},
};

export const TypographyContext = React.createContext<{
  axisTickLabel: React.CSSProperties;
  axisLabel: React.CSSProperties;
  legendLabel: React.CSSProperties;
  [key: string]: React.CSSProperties;
}>(defaultTypography);

if (process.env.NODE_ENV !== 'production') {
  TypographyContext.displayName = 'TypographyContext';
}

export function useTypography(key: 'axisTickLabel' | 'axisLabel' | 'legendLabel') {
  const typography = React.useContext(TypographyContext);

  if (!typography) {
    throw new Error(
      [
        'MUI X: Could not find the typography context.',
        'It looks like you rendered your component outside of a ThemeProvider parent component.',
      ].join('\n'),
    );
  }

  if (key === undefined) {
    return typography;
  }
  return typography[key];
}
