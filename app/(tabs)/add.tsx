import { useLocalSearchParams } from "expo-router";

import Box from "@/components/Box";
import { CardForm } from "@/components/forms/CardForm";
import Header from "@/components/Header";

export default function AddScreen() {
  const { setId } = useLocalSearchParams<{ setId?: string }>();

  return (
    <Box
      flex={1}
      backgroundColor="elevation-background-3"
    >
      <Header title="Add Card" />
      <CardForm prefilledSetId={setId} />
    </Box>
  );
}
