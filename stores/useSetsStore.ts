import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const STORAGE_KEY = 'flashcard-sets-storage';

export interface FlashcardSet {
  id: string;
  name: string;
  tags: string[];
  label: string;
  icon: string;
}

interface SetsStore {
  sets: FlashcardSet[];
  isHydrated: boolean;
  addSet: (set: FlashcardSet) => void;
  removeSet: (id: string) => void;
  hydrate: () => Promise<void>;
}

export const useSetsStore = create<SetsStore>((set, get) => ({
  sets: [],
  isHydrated: false,

  addSet: async (newSet) => {
    set((state) => ({ sets: [...state.sets, newSet] }));
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(get().sets));
  },

  removeSet: async (id) => {
    set((state) => ({ sets: state.sets.filter((s) => s.id !== id) }));
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(get().sets));
  },

  hydrate: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        set({ sets: JSON.parse(stored), isHydrated: true });
      } else {
        set({ isHydrated: true });
      }
    } catch (error) {
      console.error('Failed to hydrate store:', error);
      set({ isHydrated: true });
    }
  },
}));
