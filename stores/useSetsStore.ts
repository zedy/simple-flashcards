import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const STORAGE_KEY = 'flashcard-sets-storage';
const CARDS_STORAGE_KEY = 'flashcard-cards-storage';

export interface Tag {
  name: string;
  id: string;
}
export interface FlashcardSet {
  id: string;
  name: string;
  tags: Tag[] | [];
  label: string;
  icon: string;
}

export interface Card {
  id: string;
  topText: string;
  bottomText: string;
  tag: string; // Tag ID for backward compatibility
  tagLabel?: string; // Tag name/label for display
  setId: string;
}

interface SetsStore {
  sets: FlashcardSet[];
  cards: Card[];
  isHydrated: boolean;
  addSet: (set: FlashcardSet) => void;
  updateSet: (id: string, updatedSet: FlashcardSet) => void;
  removeSet: (id: string) => void;
  addCard: (card: Card) => void;
  updateCard: (id: string, updatedCard: Card) => void;
  deleteCard: (id: string) => void;
  getCardsBySetId: (setId: string) => Card[];
  hydrate: () => Promise<void>;
}

export const useSetsStore = create<SetsStore>((set, get) => ({
  sets: [],
  cards: [],
  isHydrated: false,

  addSet: async (newSet) => {
    set((state) => ({ sets: [...state.sets, newSet] }));
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(get().sets));
  },

  updateSet: async (id, updatedSet) => {
    set((state) => ({
      sets: state.sets.map((s) => (s.id === id ? updatedSet : s)),
    }));
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(get().sets));
  },

  removeSet: async (id) => {
    // Remove the set and all cards belonging to it
    set((state) => ({
      sets: state.sets.filter((s) => s.id !== id),
      cards: state.cards.filter((c) => c.setId !== id),
    }));
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(get().sets));
    await AsyncStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(get().cards));
  },

  addCard: async (newCard) => {
    const setCards = get().cards.filter((c) => c.setId === newCard.setId);

    // Check if the set already has 250 cards
    if (setCards.length >= 250) {
      throw new Error('Cannot add more than 250 cards to a set');
    }

    set((state) => ({ cards: [...state.cards, newCard] }));
    await AsyncStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(get().cards));
  },

  updateCard: async (id, updatedCard) => {
    const currentCard = get().cards.find((c) => c.id === id);

    // If the card is being moved to a different set
    if (currentCard && currentCard.setId !== updatedCard.setId) {
      const newSetCards = get().cards.filter((c) => c.setId === updatedCard.setId);

      // Check if the new set already has 250 cards
      if (newSetCards.length >= 250) {
        throw new Error('Cannot move card - target set already has 250 cards');
      }
    }

    set((state) => ({
      cards: state.cards.map((c) => (c.id === id ? updatedCard : c)),
    }));
    await AsyncStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(get().cards));
  },

  deleteCard: async (id) => {
    set((state) => ({ cards: state.cards.filter((c) => c.id !== id) }));
    await AsyncStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(get().cards));
  },

  getCardsBySetId: (setId) => {
    return get().cards.filter((c) => c.setId === setId);
  },

  hydrate: async () => {
    try {
      const storedSets = await AsyncStorage.getItem(STORAGE_KEY);
      const storedCards = await AsyncStorage.getItem(CARDS_STORAGE_KEY);

      const sets = storedSets ? JSON.parse(storedSets) : [];
      const cards = storedCards ? JSON.parse(storedCards) : [];

      set({ sets, cards, isHydrated: true });
    } catch (error) {
      console.error('Failed to hydrate store:', error);
      set({ isHydrated: true });
    }
  },
}));
