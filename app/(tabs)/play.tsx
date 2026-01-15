import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";

import Box from "@/components/Box";
import { DoubleCards } from "@/components/DoubleCards";
import Header from "@/components/Header";
import LoadingScreen from "@/components/LoadingScreen";
import { useFlashcardGame } from "@/hooks/useFlashcardGame";
import { type FlashcardSet, useSetsStore } from "@/stores/useSetsStore";
import type { ThemeColor } from '@/utils/theme/restyleTheme';

export default function PlayScreen() {
  const router = useRouter();
  const { setId } = useLocalSearchParams<{ setId?: string }>();
  const [activeSet, setActiveSet] = useState<FlashcardSet | undefined>(undefined);
  const { sets, cards: allCards } = useSetsStore();

  // Get cards for this set
  const setCards = allCards.filter((card) => card.setId === setId);

  // Initialize flashcard game
  const game = useFlashcardGame({ cards: setCards });

  useEffect(() => {
    if (sets) setActiveSet(sets.find((set) => set.id === setId));
  }, [setId, sets]);

  const handleCardDeleted = () => {
    // After deletion, check if there are any cards left
    // The store has already been updated, so we need to check on next tick
    setTimeout(() => {
      const remainingCards = allCards.filter((card) => card.setId === setId);
      if (remainingCards.length === 0) {
        // No cards left, go back to the set page
        router.push(`/(tabs)/setcard-page?id=${setId}`);
      }
    }, 100);
  };

  // Loading state
  if (!sets || !activeSet) {
    return <LoadingScreen />;
  }

  return (
    <Box
      flex={1}
      backgroundColor="elevation-background-3"
    >
      <Header title={activeSet.name.toUpperCase()} showBackButton />
      <DoubleCards
        card={game.currentCard!}
        isFlipped={game.isFlipped}
        currentIndex={game.currentIndex}
        totalCards={game.totalCards}
        progress={game.progress}
        isFirstCard={game.isFirstCard}
        isLastCard={game.isLastCard}
        onFlip={game.flipCard}
        onNext={game.nextCard}
        onPrevious={game.previousCard}
        onShuffle={game.shuffle}
        onRestart={game.restart}
        onCardDeleted={handleCardDeleted}
        returnTo="play"
        progressColor={activeSet.label as ThemeColor || "interactive-primary-bg-idle"}
      />
    </Box>
  );
}
