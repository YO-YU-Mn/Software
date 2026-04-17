import React, { createContext, useState, useContext, useMemo } from 'react';
import { lightTheme, darkTheme } from '../theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true); // الوضع الافتراضي داكن

  const toggleTheme = () => setIsDark(prev => !prev);

  const theme = useMemo(() => (isDark ? darkTheme : lightTheme), [isDark]);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);