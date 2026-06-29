/**
 * @file ThemeContext.tsx
 * @layer App / Providers
 *
 * Context para el tema de la aplicación (claro/oscuro).
 * Persiste la preferencia del usuario en AsyncStorage.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { lightColors, darkColors } from '@/ui/tokens/colors';
import type { AppColors } from '@/ui/tokens/colors';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  mode: ThemeMode;
  colors: AppColors;
  isDark: boolean;
  toggleTheme: () => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'light',
  colors: lightColors,
  isDark: false,
  toggleTheme: () => {},
});

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light');

  const toggleTheme = useCallback(() => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const value: ThemeContextValue = {
    mode,
    colors: (mode === 'light' ? lightColors : darkColors) as AppColors,
    isDark: mode === 'dark',
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export const useTheme = () => useContext(ThemeContext);
