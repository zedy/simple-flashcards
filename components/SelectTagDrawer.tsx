import { useTheme } from "@shopify/restyle";
import { CheckIcon } from "lucide-react-native";
import { Dimensions, ScrollView, StyleSheet } from "react-native";

import type { Theme } from "@/utils/theme/restyleTheme";

import Box from "./Box";
import type { SelectItem } from "./input/Select";
import Drawer from "./modals/Drawer";
import Pressable from "./Pressable";
import TextView from "./text/Text";

interface SelectTagDrawerProps {
  visible: boolean;
  onClose: () => void;
  currentTag: string;
  onSetSelect: (selectedSet: string) => void;
  tagList: [] | SelectItem[];
}

export const SelectTagDrawer = ({ visible, onClose, currentTag, onSetSelect, tagList }: SelectTagDrawerProps) => {
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
          Select tag
        </TextView>
        {tagList.length > 0 ? (
          <ScrollView style={[styles.tagList, { maxHeight: Dimensions.get("window").height * 0.5 }]}>
            {tagList.map((tag, index) => {
              const isSelected = currentTag === tag.value;
              return (
                <Pressable
                  key={tag.value}
                  onPress={() => onSetSelect(tag.value)}
                >
                  <Box
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                    paddingVertical="3"
                    paddingHorizontal="3"
                    backgroundColor="transparent"
                    borderBottomColor={index+1 === tagList.length ? "transparent" : "drawer-border"}
                    borderBottomWidth={1}
                    marginBottom="2"
                  >
                    <TextView
                      variant="variant-2"
                      color={isSelected ? "interactive-primary-text-idle" : "interactive-primary-text-pressed"}
                    >
                      {tag.label}
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
            This set contains no tags.
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
