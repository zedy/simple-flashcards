import { useRouter } from "expo-router";
import { Trash2Icon } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet } from 'react-native';

import { type Card, useSetsStore } from "@/stores/useSetsStore";
import type { ThemeColor } from "@/utils/theme/restyleTheme";

import Box from "./Box";
import Button from "./buttons/Button";
import { DeleteCardConfirmModal } from "./modals/content/DeleteCardConfirmModal";
import Modal from "./modals/Modal";
import Pressable from "./Pressable";
import TextView from "./text/Text";

interface CardListItemProps {
  data: Card;
  color: ThemeColor;
}

export const CardListItem = ({ data, color }: CardListItemProps) => {
  const router = useRouter();
  const { deleteCard } = useSetsStore();
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState<boolean>(false);

  const handleDeleteCard = () => {
    deleteCard(data.id);
    setIsDeleteConfirmModalOpen(false);
  };

  const handleCardPress = () => {
    router.push(`/(tabs)/edit-card?id=${data.id}`);
  };

  return (
    <Pressable onPress={handleCardPress} paddingHorizontal={"5"}>
      <Box
        width={"100%"}
        minHeight={96}
        flexDirection={"row"}
        justifyContent={"space-between"}
        borderBottomWidth={5}
        borderBottomColor={color}
        borderRadius={"m"}
        padding={"5"}
        backgroundColor={"elevation-background-1"}
        alignItems={"center"}
        style={styles.card}
      >
        <Box gap={"1"}>
          <TextView
            variant={"variant-1-medium"}
            color={"interactive-primary-text-idle"}
          >
            {data.topText}
          </TextView>
          <TextView
            variant={"variant-1-medium"}
            color={"interactive-primary-text-pressed"}
          >
            {data.bottomText}
          </TextView>
          {data.tagLabel && (
            <Box backgroundColor={"interactive-primary-text-pressed"} alignSelf={"flex-start"} borderRadius={"full"} paddingHorizontal={"2"}>
              <TextView
                variant={"variant-1-medium"}
                color={"button-text-color"}
              >
                {data.tagLabel}
              </TextView>
            </Box>
          )}
        </Box>
        <Box
          alignItems={"center"}
          flexDirection={"column"}
        >
          <Button
            variant="text"
            textVariant="variant-1-bold"
            onPress={() => setIsDeleteConfirmModalOpen(true)}
            leftElement={
              <Trash2Icon
                width={24}
                height={24}
                color={"#d43f2bff"}
              />
            }
            label=""
          />
        </Box>
        <Modal
          visible={isDeleteConfirmModalOpen}
          title="Delete Card?"
          onClose={() => setIsDeleteConfirmModalOpen(false)}
        >
          <DeleteCardConfirmModal
            callback={handleDeleteCard}
            name={data.topText}
          />
        </Modal>
      </Box>
    </Pressable>
  );
};


const styles = StyleSheet.create({
  card: {
    boxShadow: "rgba(0, 0, 0, 0.1) 0px 6px 6px 2px",
  },
});
