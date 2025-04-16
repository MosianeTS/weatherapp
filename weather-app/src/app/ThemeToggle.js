"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create theme context
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  // Handle initial theme setup
  useEffect(() => {
    // Check for user preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Apply theme based on stored preference or system preference
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme('dark');
    }
    
    setMounted(true);
  }, []);

  // Apply theme changes to document
  useEffect(() => {
    if (!mounted) return;
    
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  // Prevent flash of unstyled content
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Toggle component
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  return (
    <div className="fixed left-[300px] z-10">
      <button
        onClick={toggleTheme}
        className="bg-[#D9D9D9] dark:bg-gray-700 rounded-full w-[100px] h-[40px] flex items-center transition-all duration-300 focus:outline-none shadow"
        aria-label="Toggle Dark Mode"
      >
        <div 
          className={`w-[30px] h-[30px] bg-[#000000] rounded-full transform transition-transform duration-300 ${
            theme === 'dark' ? 'translate-x-[66px] bg-black' : 'translate-x-1 bg-black'
          } shadow-md`}
        ></div>
      </button>
      <div className="p-2 dark:bg-red-500 text-black text-[16px] rounded flex items-center justify-center">
        {theme} mode
      </div>
    </div>
  );
}