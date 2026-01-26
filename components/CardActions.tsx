import { useRouter } from "expo-router";
import { PencilIcon, Trash2Icon } from "lucide-react-native";
import { useState } from "react";

import { type Card, useSetsStore } from "@/stores/useSetsStore";

import Box from "./Box";
import IconButton from "./buttons/IconButton";
import { DeleteCardConfirmModal } from "./modals/content/DeleteCardConfirmModal";
import Modal from "./modals/Modal";

interface CardActionsProps {
  card: Card;
  onCardDeleted?: () => void;
  returnTo?: "play" | "setcard";
}

export const CardActions = ({ card, onCardDeleted, returnTo = "setcard" }: CardActionsProps) => {
  const router = useRouter();
  const { deleteCard } = useSetsStore();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEditCard = () => {
    router.push(`/(tabs)/edit-card?id=${card.id}&returnTo=${returnTo}`);
  };

  const handleDeleteCard = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteCard(card.id);
    setIsDeleteModalOpen(false);
    onCardDeleted?.();
  };

  return (
    <>
      <Box
        width={"100%"}
        flexDirection={"row"}
        justifyContent={"space-between"}
        backgroundColor={"transparent"}
      >
        <IconButton
          onPress={handleEditCard}
          variant={"transparent"}
          size="l"
          icon={<PencilIcon size={22} />}
          iconColor={"interactive-primary-text-idle"}
          iconSize={22}
        />
        <IconButton
          onPress={handleDeleteCard}
          variant={"transparent"}
          size="l"
          icon={<Trash2Icon size={24} />}
          iconColor={"informational-error"}
          iconSize={24}
        />
      </Box>

      <Modal
        visible={isDeleteModalOpen}
        title="Delete Card?"
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <DeleteCardConfirmModal
          callback={handleDeleteConfirm}
          name={card.topText}
        />
      </Modal>
    </>
  );
};