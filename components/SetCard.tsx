import { useRouter } from "expo-router";
import { GripVerticalIcon } from "lucide-react-native";

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
    <Pressable onPress={handleCardPress}>
      <Box
        width={"100%"}
        height={96}
        flexDirection={"row"}
        justifyContent={"space-between"}
        borderBottomWidth={5}
        borderBottomColor={data.label ? (data.label as ThemeColor) : "interactive-primary-bg-idle"}
        borderRadius={"m"}
        padding={"5"}
        backgroundColor={"elevation-background-dark-1"}
        alignItems={"center"}
      >
        <Box
          flexDirection={"row"}
          gap={"3"}
        >
          <Box justifyContent={"center"}>
            <TextView
              fontSize={36}
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
        <GripVerticalIcon
          color={"#DBDBDB"}
          size={24}
        />
      </Box>
    </Pressable>
  );
};
