import { useLocalSearchParams } from "expo-router";

import Box from "@/components/Box";
import SetForm from "@/components/forms/SetForm";
import Header from "@/components/Header";
import NotFoundView from "@/components/NotFoundView";
import { useSetsStore } from "@/stores/useSetsStore";

export default function EditSetScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { sets } = useSetsStore();

  const currentSet = sets.find((set) => set.id === id);

  if (!currentSet) {
    return (
      <NotFoundView
        title="SET NOT FOUND"
        message="The set you're looking for doesn't exist."
      />
    );
  }

  return (
    <Box
      flex={1}
      backgroundColor="elevation-background-3"
    >
      <Header
        title='Editing'
        titleSuffix={currentSet.name}
        showBackButton
      />
      <SetForm data={currentSet} />
    </Box>
  );
}
