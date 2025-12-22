import { useEffect, useState } from 'react';
import { ThemeContext } from './theme-context';

export function ThemeProviderCustom({ children }) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const [mode, setMode] = useState(() => {
    return localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
  });

  useEffect(() => {
    localStorage.setItem('theme', mode);
  }, [mode]);

  return <ThemeContext.Provider value={{ mode, setMode }}>{children}</ThemeContext.Provider>;
}
