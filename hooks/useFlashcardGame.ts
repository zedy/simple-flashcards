import { useEffect, useState } from 'react';

import type { Card } from '@/stores/useSetsStore';

interface UseFlashcardGameProps {
  cards: Card[];
}

interface UseFlashcardGameReturn {
  currentCard: Card | undefined;
  currentIndex: number;
  totalCards: number;
  isFlipped: boolean;
  progress: number;
  flipCard: () => void;
  nextCard: () => void;
  previousCard: () => void;
  shuffle: () => void;
  restart: () => void;
  isFirstCard: boolean;
  isLastCard: boolean;
}

export function useFlashcardGame({ cards }: UseFlashcardGameProps): UseFlashcardGameReturn {
  const [gameCards, setGameCards] = useState<Card[]>(cards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Update cards when prop changes
  useEffect(() => {
    if (cards.length === 0) {
      setGameCards([]);
      setCurrentIndex(0);
      setIsFlipped(false);
      return;
    }

    setGameCards((prevGameCards) => {
      const currentCard = prevGameCards[currentIndex];

      // Always update to the new cards array
      // But try to maintain position by finding the current card's new index
      if (currentCard) {
        const newIndex = cards.findIndex((card) => card.id === currentCard.id);
        if (newIndex !== -1) {
          // Current card still exists, update index to its new position
          setCurrentIndex(newIndex);
          return cards;
        }

        // Current card was deleted, adjust index if needed
        if (currentIndex >= cards.length) {
          setCurrentIndex(Math.max(0, cards.length - 1));
        }
        setIsFlipped(false);
      }

      return cards;
    });
  }, [cards, currentIndex]);

  const currentCard = gameCards[currentIndex];
  const totalCards = gameCards.length;
  const progress = totalCards > 0 ? ((currentIndex + 1) / totalCards) * 100 : 0;
  const isFirstCard = currentIndex === 0;
  const isLastCard = currentIndex === totalCards - 1;

  const flipCard = () => {
    setIsFlipped((prev) => !prev);
  };

  const nextCard = () => {
    if (currentIndex < totalCards - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false); // Reset flip when moving to next card
    }
  };

  const previousCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false); // Reset flip when moving to previous card
    }
  };

  const shuffle = () => {
    const shuffled = [...gameCards].sort(() => Math.random() - 0.5);
    setGameCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const restart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  return {
    currentCard,
    currentIndex,
    totalCards,
    isFlipped,
    progress,
    flipCard,
    nextCard,
    previousCard,
    shuffle,
    restart,
    isFirstCard,
    isLastCard,
  };
}
