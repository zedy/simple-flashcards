import { Clipboard } from "lucide-react-native";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";

import Box from "@/components/Box";
import Button from "@/components/buttons/Button";
import { SwipeableSetCard } from "@/components/SwipeableSetCard";
import TextView from "@/components/text/Text";
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
        <Box flex={1} width={"100%"}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
          >
            <Box gap={"4"} paddingBottom={"4"}>
              {sets.map((set) => (
                <SwipeableSetCard
                  key={set.id}
                  data={set}
                  count={getCardCount(set.id)}
                  isOpen={openCardId === set.id}
                  onSwipeChange={handleCardSwipe}
                />
              ))}
            </Box>
          </ScrollView>
          <Box width={"100%"} paddingTop={"5"}>
            <Button
              label="ADD NEW SET"
              textVariant="variant-2-bold"
              onPress={handleAddNewSet}
              width="l"
              style={styles.addNewSetBtn}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}

const styles = StyleSheet.create({
  addNewSetBtn: {
    alignSelf: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
});
