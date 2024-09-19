import * as React from 'react';

export const ColorsContext = React.createContext<string[]>(['']);

if (process.env.NODE_ENV !== 'production') {
  ColorsContext.displayName = 'ColorsContext';
}
