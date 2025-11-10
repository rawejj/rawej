"use client";

import { createContext } from 'react';
import { ThemeContextProps } from './ThemeProvider';

export const ThemeContext = createContext<ThemeContextProps>({
  theme: 'system',
  setTheme: () => {},
});
