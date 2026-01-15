import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useTheme } from "@shopify/restyle";
import { ChevronDown, SearchIcon } from "lucide-react-native";
import React, { type ReactElement, useCallback, useEffect, useState } from "react";
import type { ViewStyle } from "react-native";

import type { InputVariant, SelectType } from "@/types";
import { getInputInputColor } from "@/utils/inputs";
import type { Theme, ThemeColor } from "@/utils/theme/restyleTheme";

import Box from "../Box";
import { InfoModal } from "../modals/content/InfoModal";
import Drawer from "../modals/Drawer";
import Modal from "../modals/Modal";
import Pressable from "../Pressable";
import Text from "../text/Text";
import Input from "./Input";
import ListItem from "./ListItem";

interface FallbackAction {
  callback: () => void;
  button: string;
}
export interface SelectItem {
  label: string;
  sublabel?: string;
  value: string;
}
export interface SelectProps {
  variant?: InputVariant;
  type?: SelectType;
  label: string;
  onSelect: (value: string | string[]) => void;
  selectedValue: string | string[];
  items: SelectItem[];
  disabled?: boolean;
  error?: string;
  placeholder?: string;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  onPrimaryActionPress?: () => void;
  onSecondaryActionPress?: () => void;
  filterable?: boolean;
  style?: ViewStyle;
  fallbackText?: string;
  fallbackIcon?: ReactElement;
  fallbackAction?: FallbackAction;
}

const Select = ({
  variant = "outlined",
  type = "single",
  label,
  disabled,
  error,
  selectedValue,
  items,
  onSelect,
  placeholder,
  primaryActionLabel,
  secondaryActionLabel,
  onPrimaryActionPress,
  onSecondaryActionPress,
  filterable,
  style,
  fallbackText,
  fallbackIcon,
  fallbackAction,
}: SelectProps) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [fallbackModalVisible, setFallbackModalVisible] = useState(false);
  const theme = useTheme<Theme>();
  const pressed = false;
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    if (!drawerVisible) {
      setFilterValue("");
    }
  }, [drawerVisible]);

  const getInputColor = useCallback(
    (active: boolean): ThemeColor => getInputInputColor(theme, variant, disabled, active, error),
    [theme, variant, disabled, error],
  );

  const handleOpenDrawer = () => {
    // If items are empty and fallback is provided, show fallback modal
    if (items.length === 0 && fallbackText) {
      setFallbackModalVisible(true);
    } else {
      setDrawerVisible(true);
    }
  };

  const handleCloseDrawer = () => {
    setDrawerVisible(false);
  };

  const handleCloseFallbackModal = () => {
    setFallbackModalVisible(false);
  };

  const handleSingleSelect = (value: string) => {
    onSelect(value);
    setTimeout(() => {
      handleCloseDrawer();
    }, 200);
  };

  const handleMultipleSelect = (value: string) => {
    if (!Array.isArray(selectedValue)) {
      return;
    }
    const exists = selectedValue.includes(value);
    if (exists) {
      onSelect(selectedValue.filter((item) => item !== value));
    } else {
      onSelect([...selectedValue, value]);
    }
  };

  const inputColor = getInputColor(pressed);
  const parsedInputColor = theme.colors[inputColor];
  const selectPlaceholder = placeholder || "Select an option";

  const SelectSingleItem = ({ item }: { item: { label: string; value: string; sublabel?: string } }) => {
    const isSelected = selectedValue === item.value;
    return (
      <ListItem
        variant="single"
        selected={isSelected}
        label={item.label}
        sublabel={item.sublabel}
        onPress={() => handleSingleSelect(item.value)}
      />
    );
  };

  const SelectMultipleItem = ({ item }: { item: { label: string; value: string; sublabel?: string } }) => {
    const singleIsSelected = selectedValue.includes(item.value);
    return (
      <ListItem
        variant="multiple"
        selected={singleIsSelected}
        label={item.label}
        sublabel={item.sublabel}
        onPress={() => {
          handleMultipleSelect(item.value);
        }}
      />
    );
  };

  const parsedSelectedValue =
    type === "multiple" && Array.isArray(selectedValue)
      ? selectedValue.map((val) => items.find((item) => item.value === val)?.label || val).join(", ")
      : items.find((item) => item.value === selectedValue)?.label || selectedValue;

  const handleRenderItem = ({
    item,
  }: {
    item: {
      type: "normal" | "search";
      label: string;
      sublabel?: string;
      value: string;
    };
  }) => {
    if (item.type === "search") {
      return (
        <Box
          backgroundColor="interactive-primary-on"
          px="4"
        >
          <Input
            label=""
            onChangeText={(text) => setFilterValue(text)}
            value={filterValue}
            placeholder="Search"
            mb="0"
            leftElement={<SearchIcon color={theme.colors["interactive-icon-idle"]} />}
          />
        </Box>
      );
    }
    return type === "single" ? <SelectSingleItem item={item} /> : <SelectMultipleItem item={item} />;
  };

  const parsedItems = [
    ...(filterable
      ? [
          {
            type: "search",
            label: "",
            value: "",
          },
        ]
      : []),
    ...items.filter((item) => item.label.toLowerCase().includes(filterValue.toLowerCase())),
  ] as {
    type: "normal" | "search";
    label: string;
    sublabel?: string | undefined;
    value: string;
  }[];

  return (
    <>
      <Pressable
        onPress={handleOpenDrawer}
        pointerEvents="box-only"
        style={style}
      >
        <Input
          label={label}
          placeholder={selectPlaceholder}
          value={
            parsedSelectedValue
              ? typeof parsedSelectedValue === "string"
                ? parsedSelectedValue
                : parsedSelectedValue.join(", ")
              : undefined
          }
          onChangeText={() => null}
          variant={variant}
          rightElement={<ChevronDown color={parsedInputColor} />}
          error={error}
        />
      </Pressable>
      <Drawer
        visible={drawerVisible}
        onClose={handleCloseDrawer}
        primaryActionLabel={primaryActionLabel}
        secondaryActionLabel={secondaryActionLabel}
        onPrimaryActionPress={onPrimaryActionPress}
        onSecondaryActionPress={onSecondaryActionPress}
        scrollable={false}
        showCloseButton={false}
      >
        <BottomSheetFlatList
          data={parsedItems}
          renderItem={handleRenderItem}
          ListHeaderComponent={
            <Box
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              paddingHorizontal="4"
              paddingVertical={filterable ? "0" : "2"}
            >
              <Text
                variant="variant-3-bold"
                color={"interactive-text-1"}
              >
                {label}
              </Text>
            </Box>
          }
          stickyHeaderIndices={filterable ? [1] : []}
          keyExtractor={(item: { value: string }) => item.value}
          contentContainerStyle={{
            paddingBottom: theme.spacing["list-bottom"],
          }}
        />
      </Drawer>
      {fallbackText && (
        <Modal
          hideHeader
          visible={fallbackModalVisible}
          onClose={handleCloseFallbackModal}
        >
          <InfoModal
            text={fallbackText}
            icon={fallbackIcon}
            action={fallbackAction}
            onClose={handleCloseFallbackModal}
          />
        </Modal>
      )}
    </>
  );
};

export default Select;
