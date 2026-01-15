import { StyleSheet } from "react-native";

import Box from "@/components/Box";
import Button from "@/components/buttons/Button";
import TextView from "@/components/text/Text";

interface DeleteSetConfirmModalProps {
  callback: () => void;
  name: string;
}

export const DeleteSetConfirmModal = ({ callback, name }: DeleteSetConfirmModalProps) => {
  const handleCallback = () => {
    callback();
  };

  return (
    <Box
      padding={"4"}
      gap={"5"}
    >
      <TextView
        variant={"variant-1-bold"}
        color={"interactive-text-1"}
      >
        {`This will permanently delete ${name} and all of the cards. This action is not reversible.`}
      </TextView>
      <Button
        label="Delete"
        onPress={handleCallback}
        width="l"
        textVariant="variant-2-bold"
        variant="primary"
        style={styles.deleteBtn}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  deleteBtn: {
    backgroundColor: "#d43f2bff",
  },
});
