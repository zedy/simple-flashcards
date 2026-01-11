import { TrashIcon } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet } from "react-native";

import { type FlashcardSet, useSetsStore } from "@/stores/useSetsStore";
import theme from "@/utils/theme/restyleTheme";

import Box from "./Box";
import Button from "./buttons/Button";
import { DeleteSetConfirmModal } from "./modals/content/DeleteSetConfirmModal";
import Modal from "./modals/Modal";
import TextView from "./text/Text";

interface SetCardProps {
  data: FlashcardSet;
  count: number;
}

export const SetCard = ({ data, count }: SetCardProps) => {
  const { removeSet } = useSetsStore();
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState<boolean>(false);

  const handleDeleteSet = () => {
    removeSet(data.id);
  };

  return (
    <Box
      width={"100%"}
      height={96}
      flexDirection={"row"}
      justifyContent={"space-between"}
      borderBottomWidth={5}
      borderRadius={"m"}
      padding={"5"}
      backgroundColor={"elevation-background-dark-1"}
      alignItems={"center"}
      style={[styles.container, { borderBottomColor: data.label ?? theme.colors["interactive-primary-bg-idle"] }]}
    >
      <Box>
        <Box>{data.icon}</Box>
        <Box>
          <TextView color={"interactive-primary-text-idle"}>{data.name}</TextView>
          <TextView color={"interactive-primary-text-idle"}>{count}</TextView>
        </Box>
      </Box>
      <Box
        alignItems={"center"}
        flexDirection={"column"}
      >
        <Button
          variant="text"
          onPress={() => setIsDeleteConfirmModalOpen(true)}
          leftElement={
            <TrashIcon
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
        title="Delete Set?"
        onClose={() => setIsDeleteConfirmModalOpen(false)}
      >
        <DeleteSetConfirmModal callback={handleDeleteSet} name={data.name} />
      </Modal>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {},
});
