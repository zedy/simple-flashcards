import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

import { ThemeEnum, type ThemeMode } from '@/types';

const SETTINGS_STORAGE_KEY = 'flashcard-settings-storage';

interface Settings {
  showProgressBar: boolean;
  theme: ThemeMode;
}

interface SettingsStore {
  settings: Settings;
  isHydrated: boolean;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => Promise<void>;
  hydrate: () => Promise<void>;
}

const defaultSettings: Settings = {
  showProgressBar: true,
  theme: ThemeEnum.dark,
};

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: defaultSettings,
  isHydrated: false,

  updateSetting: async (key, value) => {
    set((state) => ({
      settings: {
        ...state.settings,
        [key]: value,
      },
    }));
    await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(get().settings));
  },

  hydrate: async () => {
    try {
      const storedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      const settings = storedSettings ? JSON.parse(storedSettings) : defaultSettings;
      set({ settings, isHydrated: true });
    } catch (error) {
      console.error('Failed to hydrate settings:', error);
      set({ settings: defaultSettings, isHydrated: true });
    }
  },
}));
