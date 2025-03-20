
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

type ThemeType = 'default' | 'dark' | 'high-contrast';

interface SettingsContextType {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  timerDuration: number;
  setTimerDuration: (duration: number) => void;
  timerEnabled: boolean;
  setTimerEnabled: (enabled: boolean) => void;
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  vibrationEnabled: boolean;
  setVibrationEnabled: (enabled: boolean) => void;
}

const defaultSettings: Omit<SettingsContextType, 'setSoundEnabled' | 'setTimerDuration' | 'setTimerEnabled' | 'setTheme' | 'setVibrationEnabled'> = {
  soundEnabled: true,
  timerDuration: 30,
  timerEnabled: true,
  theme: 'default',
  vibrationEnabled: true
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState(defaultSettings.soundEnabled);
  const [timerDuration, setTimerDuration] = useState(defaultSettings.timerDuration);
  const [timerEnabled, setTimerEnabled] = useState(defaultSettings.timerEnabled);
  const [theme, setTheme] = useState<ThemeType>(defaultSettings.theme);
  const [vibrationEnabled, setVibrationEnabled] = useState(defaultSettings.vibrationEnabled);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('scoreKeeperSettings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSoundEnabled(parsedSettings.soundEnabled ?? defaultSettings.soundEnabled);
        setTimerDuration(parsedSettings.timerDuration ?? defaultSettings.timerDuration);
        setTimerEnabled(parsedSettings.timerEnabled ?? defaultSettings.timerEnabled);
        setTheme(parsedSettings.theme ?? defaultSettings.theme);
        setVibrationEnabled(parsedSettings.vibrationEnabled ?? defaultSettings.vibrationEnabled);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      toast.error('Failed to load settings');
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    try {
      const settings = {
        soundEnabled,
        timerDuration,
        timerEnabled,
        theme,
        vibrationEnabled
      };
      localStorage.setItem('scoreKeeperSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }, [soundEnabled, timerDuration, timerEnabled, theme, vibrationEnabled]);

  return (
    <SettingsContext.Provider
      value={{
        soundEnabled,
        setSoundEnabled,
        timerDuration,
        setTimerDuration,
        timerEnabled,
        setTimerEnabled,
        theme,
        setTheme,
        vibrationEnabled,
        setVibrationEnabled
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
