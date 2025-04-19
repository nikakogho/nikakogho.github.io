import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

// Create the context with a default value (can be null or a default object)
const ThemeContext = createContext<ThemeContextProps | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // State to hold the current theme. Initialize from localStorage or OS preference.
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme) {
      return storedTheme;
    }
    // Check OS preference
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  // Effect to apply the theme class to the <html> element and save to localStorage
  useEffect(() => {
    const root = window.document.documentElement; // Get the <html> element
    const previousTheme = theme === 'dark' ? 'light' : 'dark';
    root.classList.remove(previousTheme); // Remove previous theme class if any
    root.setAttribute('data-theme', theme); // Use data attribute
    // root.classList.add(theme); // Alternative: use class name
    localStorage.setItem('theme', theme); // Save preference
    console.log(`Theme changed to: ${theme}`);
  }, [theme]); // Run effect whenever theme changes

  // Function to toggle the theme
  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context easily
export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
