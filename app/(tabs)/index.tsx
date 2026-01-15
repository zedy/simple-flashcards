import { useRouter } from "expo-router";

import Box from "@/components/Box";
import Header from "@/components/Header";
import { SetCardList } from "@/components/SetCardList";
import { useSetsStore } from "@/stores/useSetsStore";

export default function SetsScreen() {
  const router = useRouter();
  const { sets } = useSetsStore();

  const navigateToCreateSet = () => {
    router.push("/(tabs)/create-set");
  };

  return (
    <Box
      flex={1}
      backgroundColor="elevation-background-3"
    >
      <Header title="Your Sets" />
      <SetCardList
        toggleModal={navigateToCreateSet}
        sets={sets}
      />
    </Box>
  );
}
