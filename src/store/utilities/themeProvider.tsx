import React, { createContext, useContext, useEffect } from "react";
import { useAppSelector } from '../store-hooks';

interface ThemeContextProps {
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps{
  children:React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const isDarkMode = useAppSelector((state) => state.AppStateReducer.isDarkMode);

  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty("--bg-color-light", isDarkMode ? "#000000" : "#ffffff");
    root.style.setProperty(
        "--text-color-light",
        isDarkMode ? "#ffffff" : "#333333"
    );
  }, [isDarkMode]);

  return <ThemeContext.Provider value={{ isDarkMode }}>{children}</ThemeContext.Provider>;
};
