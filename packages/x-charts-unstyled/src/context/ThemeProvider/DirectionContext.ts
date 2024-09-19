import * as React from 'react';

export const DirectionContext = React.createContext<'ltr' | 'rtl'>('ltr');

if (process.env.NODE_ENV !== 'production') {
  DirectionContext.displayName = 'DirectionContext';
}
