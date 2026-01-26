import { useRouter } from "expo-router";
import { StyleSheet } from 'react-native';

import type { FlashcardSet } from "@/stores/useSetsStore";
import type { ThemeColor } from "@/utils/theme/restyleTheme";

import Box from "./Box";
import Pressable from "./Pressable";
import TextView from "./text/Text";

interface SetCardProps {
  data: FlashcardSet;
  count: number;
}

export const SetCard = ({ data, count }: SetCardProps) => {
  const router = useRouter();

  const handleCardPress = () => {
    router.push(`/(tabs)/setcard-page?id=${data.id}`);
  };

  return (
    <Pressable onPress={handleCardPress} 
      paddingHorizontal={"5"}>
      <Box
        width={"100%"}
        height={96}
        flexDirection={"row"}
        justifyContent={"space-between"}
        borderBottomWidth={5}
        borderBottomColor={data.label ? (data.label as ThemeColor) : "interactive-primary-bg-idle"}
        borderRadius={"m"}
        padding={"5"}
        backgroundColor={"elevation-background-1"}
        alignItems={"center"}
        style={styles.card}
      >
        <Box
          flexDirection={"row"}
          gap={"3"}
        >
          <Box justifyContent={"center"} alignItems={"center"}>
            <TextView
              fontSize={36}
              lineHeight={44}
              flex={1}
              paddingTop={"1"}
              color={"interactive-primary-text-idle"}
            >
              {data.icon}
            </TextView>
          </Box>
          <Box>
            <TextView
              variant={"variant-3-medium"}
              color={"interactive-primary-text-idle"}
            >
              {data.name}
            </TextView>
            <TextView color={"interactive-primary-text-pressed"}>{`${count} cards`}</TextView>
          </Box>
        </Box>
        <Box backgroundColor={"handle-drag"} width={5} height={48} borderRadius={"full"}/>
      </Box>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    boxShadow: "rgba(0, 0, 0, 0.1) 0px 6px 6px 2px",
  },
});
