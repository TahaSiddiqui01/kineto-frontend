'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'system',
  resolvedTheme: 'dark',
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

const STORAGE_KEY = 'kineto-theme';

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(resolved: 'light' | 'dark') {
  const root = document.documentElement;
  if (resolved === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'system';
    return (localStorage.getItem(STORAGE_KEY) as Theme) ?? 'system';
  });
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'dark';
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initial: Theme = stored ?? 'system';
    return initial === 'system' ? getSystemTheme() : (initial as 'light' | 'dark');
  });

  // Apply theme class to DOM once on mount (state is already initialised from localStorage)
  useEffect(() => {
    applyTheme(resolvedTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for system preference changes when theme === 'system'
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    function handleChange(e: MediaQueryListEvent) {
      if (theme === 'system') {
        const resolved = e.matches ? 'dark' : 'light';
        setResolvedTheme(resolved);
        applyTheme(resolved);
      }
    }
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    const resolved = next === 'system' ? getSystemTheme() : next;
    setThemeState(next);
    setResolvedTheme(resolved);
    applyTheme(resolved);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
