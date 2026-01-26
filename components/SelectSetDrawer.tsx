import { useTheme } from "@shopify/restyle";
import { CheckIcon } from "lucide-react-native";
import { Dimensions, ScrollView, StyleSheet } from "react-native";

import type { FlashcardSet } from "@/stores/useSetsStore";
import type { Theme } from "@/utils/theme/restyleTheme";

import Box from "./Box";
import Drawer from "./modals/Drawer";
import Pressable from "./Pressable";
import TextView from "./text/Text";

interface SelectSetDrawerProps {
  visible: boolean;
  onClose: () => void;
  currentSet: string;
  onSetSelect: (selectedSet: string) => void;
  sets: FlashcardSet[] | [];
}

export const SelectSetDrawer = ({
  visible,
  onClose,
  currentSet,
  onSetSelect,
  sets,
}: SelectSetDrawerProps) => {
  const theme = useTheme<Theme>();

  return (
    <Drawer
      visible={visible}
      onClose={onClose}
      scrollable={true}
      showCloseButton={false}
    >
      <Box
        paddingTop="4"
        paddingBottom="6"
      >
        <TextView
          variant="variant-3-bold"
          color="interactive-text-1"
          marginBottom="4"
          paddingLeft="4"
        >
          Select set
        </TextView>
        {sets.length > 0 ? (
          <ScrollView style={[styles.tagList, { maxHeight: Dimensions.get("window").height * 0.5 }]}>
            {sets.map((set, index) => {
              const isSelected = currentSet === set.id;
              return (
                <Pressable
                  key={set.id}
                  onPress={() => onSetSelect(set.id)}
                >
                  <Box
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                    paddingVertical="3"
                    paddingHorizontal="3"
                    backgroundColor="transparent"
                    borderBottomColor={index + 1 === sets.length ? "transparent" : "drawer-border"}
                    borderBottomWidth={1}
                    marginBottom="2"
                  >
                    <TextView
                      variant="variant-2"
                      color={isSelected ? "interactive-primary-text-idle" : "interactive-primary-text-pressed"}
                    >
                      {set.name}
                    </TextView>
                    {isSelected && (
                      <CheckIcon
                        size={20}
                        color={theme.colors["primary-color"]}
                      />
                    )}
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
            You have not added any sets.
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
