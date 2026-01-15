import { useTheme } from "@shopify/restyle";
import { CheckIcon } from "lucide-react-native";
import { Dimensions, ScrollView, StyleSheet } from "react-native";

import Box from "./Box";
import Drawer from "./modals/Drawer";
import Pressable from "./Pressable";
import TextView from "./text/Text";

import type { FlashcardSet } from "@/stores/useSetsStore";
import type { Theme } from "@/utils/theme/restyleTheme";

interface FilterTagsDrawerProps {
  visible: boolean;
  onClose: () => void;
  currentSet: FlashcardSet | undefined;
  selectedTags: string[];
  onTagToggle: (tagId: string) => void;
  onApply: () => void;
  onClear: () => void;
}

export const FilterTagsDrawer = ({
  visible,
  onClose,
  currentSet,
  selectedTags,
  onTagToggle,
  onApply,
  onClear,
}: FilterTagsDrawerProps) => {
  const theme = useTheme<Theme>();

  return (
    <Drawer
      visible={visible}
      onClose={onClose}
      primaryActionLabel="Apply"
      secondaryActionLabel={selectedTags.length > 0 ? "Clear" : undefined}
      onPrimaryActionPress={onApply}
      onSecondaryActionPress={onClear}
      scrollable={true}
      showCloseButton={false}
    >
      <Box paddingTop="4" paddingBottom="6">
        <TextView
          variant="variant-3-bold"
          color="interactive-text-1"
          marginBottom="4"
          paddingLeft="4"
        >
          Filter by Tags
        </TextView>
        {currentSet?.tags && currentSet.tags.length > 0 ? (
          <ScrollView style={[styles.tagList, { maxHeight: Dimensions.get("window").height * 0.5 }]}>
            {currentSet.tags.map((tag) => {
              const isSelected = selectedTags.includes(tag.id);
              return (
                <Pressable key={tag.id} onPress={() => onTagToggle(tag.id)}>
                  <Box
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                    paddingVertical="3"
                    paddingHorizontal="3"
                    backgroundColor="transparent"
                    borderBottomColor="drawer-border"
                    borderBottomWidth={1}
                    marginBottom="2"
                  >
                    <TextView
                      variant="variant-2"
                      color={isSelected ? "interactive-primary-text-idle" : "interactive-primary-text-pressed"}
                    >
                      {tag.name}
                    </TextView>
                    {isSelected && <CheckIcon size={20} color={theme.colors["primary-color"]} />}
                  </Box>
                </Pressable>
              );
            })}
          </ScrollView>
        ) : (
          <TextView
            variant="variant-2"
            color="interactive-primary-text-pressed"
            textAlign="center"
            marginTop="4"
          >
            No tags available in this set
          </TextView>
        )}
      </Box>
    </Drawer>
  );
};

const styles = StyleSheet.create({
  tagList: {
    flexGrow: 0,
  },
});
