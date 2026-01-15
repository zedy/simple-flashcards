import { Clipboard } from "lucide-react-native";
import React from "react";
import { StyleSheet } from "react-native";
import Animated, { FadeOut, Layout } from "react-native-reanimated";

import Box from "@/components/Box";
import Button from "@/components/buttons/Button";
import { ScrollableListWithButton } from "@/components/ScrollableListWithButton";
import { SwipeableSetCard } from "@/components/SwipeableSetCard";
import TextView from "@/components/text/Text";
import {
  LIST_ITEM_FADE_OUT_DURATION,
  LIST_ITEM_LAYOUT_DELAY,
  LIST_ITEM_SPRING_DAMPING,
  LIST_ITEM_SPRING_STIFFNESS,
} from "@/constants/shared";
import { type FlashcardSet, useSetsStore } from "@/stores/useSetsStore";

interface SetCardListProps {
  toggleModal: (open: boolean) => void;
  sets: FlashcardSet[];
}

export const SetCardList = ({ toggleModal, sets }: SetCardListProps) => {
  const { cards } = useSetsStore();
  const [openCardId, setOpenCardId] = React.useState<string | null>(null);

  const handleAddNewSet = () => {
    toggleModal(true);
  };

  const getCardCount = (setId: string) => {
    return cards.filter((card) => card.setId === setId).length;
  };

  const handleCardSwipe = (cardId: string | null) => {
    setOpenCardId(cardId);
  };

  return (
    <Box
      flex={1}
      paddingVertical="5"
      paddingHorizontal={"0"}
      justifyContent={"center"}
      alignContent={"center"}
      gap={"4"}
    >
      {sets.length === 0 ? (
        <Box flex={1} gap={"4"}>
          <Box flex={1} justifyContent={"center"}
          alignItems={"center"} gap={"4"}>
            <Box
              width={"100%"}
              justifyContent={"center"}
              flexDirection={"row"}
            >
              <Clipboard
                width={128}
                height={128}
                color={"#DBDBDB"}
              />
            </Box>
            <TextView
              textAlign={"center"}
              variant={"variant-2-bold"}
              color="interactive-text-1"
            >
              Before you start create your first set
            </TextView>
          </Box>
          <Button
            label="ADD NEW SET"
            textVariant="variant-2-bold"
            onPress={handleAddNewSet}
            width="l"
            style={styles.addNewSetBtn}
          />
        </Box>
      ) : (
        <ScrollableListWithButton
          buttonLabel="ADD NEW SET"
          onButtonPress={handleAddNewSet}
        >
          {sets.map((set) => (
            <Animated.View
              key={set.id}
              exiting={FadeOut.duration(LIST_ITEM_FADE_OUT_DURATION)}
              layout={Layout.springify()
                .damping(LIST_ITEM_SPRING_DAMPING)
                .stiffness(LIST_ITEM_SPRING_STIFFNESS)
                .delay(LIST_ITEM_LAYOUT_DELAY)}
            >
              <SwipeableSetCard
                data={set}
                count={getCardCount(set.id)}
                isOpen={openCardId === set.id}
                onSwipeChange={handleCardSwipe}
              />
            </Animated.View>
          ))}
        </ScrollableListWithButton>
      )}
    </Box>
  );
}

const styles = StyleSheet.create({
  addNewSetBtn: {
    alignSelf: "center",
  },
});
