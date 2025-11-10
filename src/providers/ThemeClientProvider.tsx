"use client";

import { useEffect, useState, useCallback } from 'react';
import { Theme } from "./ThemeProvider";
import { ThemeContext } from "./ThemeContext";

const getSystemTheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export default function ThemeClientProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme') as Theme | null;
      return stored || 'system';
    }
    return 'system';
  });

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  }, []);

  useEffect(() => {
    const applyTheme = (t: Theme) => {
      const resolved = t === 'system' ? getSystemTheme() : t;
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(resolved);
    };
    
    applyTheme(theme);
    
    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme('system');
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
