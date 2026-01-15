import { useLocalSearchParams, useRouter } from "expo-router";

import Box from "@/components/Box";
import { CardForm } from "@/components/forms/CardForm";
import Header from "@/components/Header";
import NotFoundView from "@/components/NotFoundView";
import { useSetsStore } from "@/stores/useSetsStore";

export default function EditCardScreen() {
  const router = useRouter();
  const { id, returnTo } = useLocalSearchParams<{ id: string; returnTo?: string }>();
  const { cards } = useSetsStore();

  const currentCard = cards.find((card) => card.id === id);

  const handleBackPress = () => {
    if (currentCard) {
      if (returnTo === "play") {
        router.push(`/(tabs)/play?setId=${currentCard.setId}`);
      } else {
        router.push(`/(tabs)/setcard-page?id=${currentCard.setId}`);
      }
    } else {
      router.back();
    }
  };

  if (!currentCard) {
    return (
      <NotFoundView
        title="CARD NOT FOUND"
        message="The card you're looking for doesn't exist."
      />
    );
  }

  return (
    <Box
      flex={1}
      backgroundColor="elevation-background-3"
    >
      <Header
        title="EDIT CARD"
        showBackButton
        onBackPress={handleBackPress}
      />
      <CardForm key={currentCard.id} data={currentCard} returnTo={returnTo as "play" | "setcard" | undefined} />
    </Box>
  );
}
