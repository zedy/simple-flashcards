import EmojiSelector, { Categories } from "react-native-emoji-selector";

import Box from "@/components/Box";

import Drawer from "../Drawer";

interface EmojiPickerDrawerProps {
  visible: boolean;
  onClose: () => void;
  onEmojiSelected: (emoji: string) => void;
}

export const EmojiPickerDrawer = ({ visible, onClose, onEmojiSelected }: EmojiPickerDrawerProps) => {
  const handleEmojiSelect = (emoji: string) => {
    onEmojiSelected(emoji);
    onClose();
  };

  return (
    <Box>
      <Drawer visible={visible} onClose={onClose}>
        <Box paddingTop={"10"}>
          <EmojiSelector
            showHistory={false}
            showSectionTitles={false}
            category={Categories.emotion}
            onEmojiSelected={handleEmojiSelect}
          />
        </Box>
      </Drawer>
    </Box>
  );
};
