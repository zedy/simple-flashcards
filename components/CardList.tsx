import { useTheme } from "@shopify/restyle";
import { router } from "expo-router";
import { IdCardIcon } from "lucide-react-native";
import { StyleSheet } from "react-native";
import Animated, { FadeOut, Layout } from "react-native-reanimated";

import Box from "@/components/Box";
import Button from "@/components/buttons/Button";
import { ScrollableListWithButton } from "@/components/ScrollableListWithButton";
import TextView from "@/components/text/Text";
import type { Card } from "@/stores/useSetsStore";
import type { Theme, ThemeColor } from "@/utils/theme/restyleTheme";

import { CardListItem } from "./CardListItem";

interface CardListProps {
  cards: Card[];
  setId?: string;
  color: ThemeColor;
  search: boolean;
}

export const CardList = ({ cards, setId, color, search }: CardListProps) => {
  const theme = useTheme<Theme>();

  const handleAddNewCard = () => {
    if (setId) {
      router.push(`/(tabs)/add?setId=${setId}`);
    } else {
      router.push("/(tabs)/add");
    }
  };

  return (
    <Box
      flex={1}
      paddingVertical="5"
      paddingHorizontal={"0"}
      justifyContent={"flex-start"}
      alignItems={"center"}
      gap={"8"}
      width={"100%"}
    >
      {cards.length === 0 ? (
        <Box
          flex={1}
          justifyContent={"center"}
          alignItems={"center"}
          gap={"4"}
        >
          <Box
            width={"100%"}
            justifyContent={"center"}
            flexDirection={"row"}
          >
            <IdCardIcon
              width={128}
              height={128}
              color={theme.colors["drawer-border"]}
            />
          </Box>
          <TextView
            textAlign={"center"}
            variant={"variant-2-bold"}
            color="interactive-text-1"
          >
            {search ? "No cards match your search criteria" : "Set has no cards"}
          </TextView>
          {!search && (
            <Button
              label="ADD NEW CARD"
              textVariant="variant-2-bold"
              onPress={handleAddNewCard}
              width="l"
              style={styles.addNewSetBtn}
            />
          )}
        </Box>
      ) : (
        <ScrollableListWithButton
          buttonLabel="ADD NEW CARD"
          onButtonPress={handleAddNewCard}
        >
          {cards.map((card) => (
            <Animated.View
              key={card.id}
              exiting={FadeOut.duration(150)}
              layout={Layout.springify().damping(15).stiffness(150).delay(130)}
            >
              <CardListItem
                data={card}
                color={color}
              />
            </Animated.View>
          ))}
        </ScrollableListWithButton>
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  addNewSetBtn: {
    alignSelf: "center",
  },
});
