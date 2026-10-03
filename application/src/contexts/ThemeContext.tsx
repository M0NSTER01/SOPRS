import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';

type ThemeType = 'light' | 'dark' | 'system';

export interface ThemeColors {
  background: string;
  card: string;
  cardElevated: string;
  text: string;
  subText: string;
  border: string;
  primary: string;
  primaryGlow: string;
  accent: string;
  sky: string;
  emerald: string;
  emeraldBg: string;
  rose: string;
  roseBg: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
}

interface ThemeContextData {
  theme: 'light' | 'dark';
  themeSetting: ThemeType;
  setThemeSetting: (setting: ThemeType) => void;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export const darkColors: ThemeColors = {
  background: '#080b0e',      // Website stealth background
  card: '#0d1218',            // Dark circuit card
  cardElevated: '#131a24',    // Elevated card
  text: '#f8fafc',            // Pure white heading
  subText: '#8292a2',         // Slate secondary text
  border: '#1e293b',          // Subtle circuit border
  primary: '#2563eb',         // Sapphire blue
  primaryGlow: '#38bdf8',     // Electric sky glow
  accent: '#0ea5e9',          // Sky cyan accent
  sky: '#38bdf8',             // Electric sky
  emerald: '#10b981',         // Live mesh green
  emeraldBg: 'rgba(16, 185, 129, 0.12)',
  rose: '#f43f5e',            // Alert crimson
  roseBg: 'rgba(244, 63, 94, 0.12)',
  badgeBg: 'rgba(56, 189, 248, 0.10)',
  badgeBorder: 'rgba(56, 189, 248, 0.25)',
  badgeText: '#38bdf8',
};

export const lightColors: ThemeColors = {
  background: '#f8fafc',
  card: '#ffffff',
  cardElevated: '#f1f5f9',
  text: '#080b0e',
  subText: '#64748b',
  border: '#e2e8f0',
  primary: '#2563eb',
  primaryGlow: '#38bdf8',
  accent: '#0ea5e9',
  sky: '#0ea5e9',
  emerald: '#059669',
  emeraldBg: 'rgba(5, 150, 105, 0.1)',
  rose: '#e11d48',
  roseBg: 'rgba(225, 29, 72, 0.1)',
  badgeBg: 'rgba(37, 99, 235, 0.08)',
  badgeBorder: 'rgba(37, 99, 235, 0.2)',
  badgeText: '#2563eb',
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemTheme = useColorScheme();
  const [themeSetting, setThemeSettingState] = useState<ThemeType>('system');

  useEffect(() => {
    AsyncStorage.getItem('@theme_setting').then((savedTheme) => {
      if (savedTheme) {
        setThemeSettingState(savedTheme as ThemeType);
      }
    });
  }, []);

  const setThemeSetting = async (setting: ThemeType) => {
    setThemeSettingState(setting);
    await AsyncStorage.setItem('@theme_setting', setting);
  };

  const currentTheme = themeSetting === 'system' ? (systemTheme || 'light') : themeSetting;
  const colors = currentTheme === 'dark' ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, themeSetting, setThemeSetting, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
