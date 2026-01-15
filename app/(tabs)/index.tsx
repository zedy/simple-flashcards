import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import Box from "@/components/Box";
import Header from "@/components/Header";
import LoadingScreen from "@/components/LoadingScreen";
import { SetCardList } from "@/components/SetCardList";
import { type FlashcardSet, useSetsStore } from "@/stores/useSetsStore";

export default function SetsScreen() {
  const router = useRouter();
  const [setList, setSetList] = useState<FlashcardSet[] | undefined>(undefined);
  const { hydrate, sets } = useSetsStore();

  useEffect(() => {
    hydrate();
  }, []);

  useEffect(() => {
    setSetList(sets);
  }, [sets]);

  const navigateToCreateSet = () => {
    router.push("/(tabs)/create-set");
  };

  return (
    <Box
      flex={1}
      backgroundColor="elevation-background-3"
    >
      <Header title="YOUR SETS" />
      {setList ? (
        <SetCardList
          toggleModal={navigateToCreateSet}
          sets={setList}
        />
      ) : (
        <LoadingScreen />
      )}
    </Box>
  );
}
