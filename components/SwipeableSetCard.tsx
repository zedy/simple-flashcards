import { useRouter } from "expo-router";
import { PencilIcon, PlayIcon, Trash2Icon } from "lucide-react-native";
import { useRef, useState } from "react";
import { StyleSheet } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";

import { SWIPEABLE_CARD_NAVIGATION_DELAY } from "@/constants/shared";
import { type FlashcardSet, useSetsStore } from "@/stores/useSetsStore";

import Box from "./Box";
import IconButton from "./buttons/IconButton";
import { DeleteSetConfirmModal } from "./modals/content/DeleteSetConfirmModal";
import Modal from "./modals/Modal";
import { SetCard } from "./SetCard";

interface SwipeableSetCardProps {
  data: FlashcardSet;
  count: number;
  isOpen: boolean;
  onSwipeChange: (cardId: string | null) => void;
}

export const SwipeableSetCard = ({ data, count, isOpen, onSwipeChange }: SwipeableSetCardProps) => {
  const router = useRouter();
  const swipeableRef = useRef<Swipeable>(null);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const { removeSet } = useSetsStore();

  const handleDelete = () => {
    setIsDeleteConfirmModalOpen(true);
    swipeableRef.current?.close();
  };

  const handleEdit = () => {
    swipeableRef.current?.close();
    setTimeout(() => {
      router.push(`/(tabs)/edit-set?id=${data.id}`);
    }, SWIPEABLE_CARD_NAVIGATION_DELAY);
  };

  const handlePlay = () => {
    if (count > 0) {
      swipeableRef.current?.close();
      setTimeout(() => {
        router.push(`/(tabs)/play?setId=${data.id}`);
      }, SWIPEABLE_CARD_NAVIGATION_DELAY);
    }
  };

  const handleDeleteConfirm = () => {
    removeSet(data.id);
    setIsDeleteConfirmModalOpen(false);
  };

  const renderRightActions = () => (
    <Box gap={"2"} flexDirection={"row"} alignItems={"center"}>
      <IconButton
        onPress={handlePlay}
        variant="transparent"
        size="m"
        icon={<PlayIcon size={24} />}
        iconColor={count > 0 ? "interactive-card-green" : "interactive-primary-text-pressed"}
        iconSize={24}
        style={styles.actionButton}
      />
      <IconButton
        onPress={handleEdit}
        variant="transparent"
        size="m"
        icon={<PencilIcon size={24} />}
        iconColor="interactive-orange"
        iconSize={24}
        style={styles.actionButton}
      />
      <IconButton
        onPress={handleDelete}
        variant="transparent"
        size="m"
        icon={<Trash2Icon size={24} />}
        iconColor="informational-error"
        iconSize={24}
        style={styles.actionButton}
      />
    </Box>
  );

  return (
    <Box width="100%">
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        overshootRight={false}
        friction={2}
      >
        <SetCard data={data} count={count} />
      </Swipeable>

      <Modal
        visible={isDeleteConfirmModalOpen}
        title="Delete Set?"
        onClose={() => setIsDeleteConfirmModalOpen(false)}
      >
        <DeleteSetConfirmModal
          callback={handleDeleteConfirm}
          name={data.name}
        />
      </Modal>
    </Box>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    alignSelf: "center"
  },
});
