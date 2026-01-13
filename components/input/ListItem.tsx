import { type BoxProps, useTheme } from "@shopify/restyle";
import React, { type ReactNode, useCallback, useState } from "react";

import type { ListItemVariant } from "@/types";
import type { Theme, ThemeColor } from "@/utils/theme/restyleTheme";

import Box from "../Box";
import Checkbox from "../buttons/Checkbox";
import Pressable from "../Pressable";
import Text from "../text/Text";

export interface ListItemProps extends BoxProps<Theme> {
  variant?: ListItemVariant;
  label: string;
  sublabel?: string;
  selected?: boolean;
  onPress?: () => void;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
}

const ListItem = ({
  variant = "single",
  label,
  sublabel,
  selected,
  onPress,
  leftElement,
  rightElement,
  ...rest
}: ListItemProps) => {
  const theme = useTheme<Theme>();
  const [pressed, setPressed] = useState(false);

  const getBackgroundColor = useCallback(
    (pressed: boolean): ThemeColor => {
      if (!theme?.listItems[variant]) {
        return "transparent";
      }
      const { backgroundColor, backgroundColorSelected, backgroundColorPressed } = theme.listItems[variant];

      if (variant === "action") return "elevation-background";
      if (selected) return backgroundColorSelected;
      if (pressed && onPress) return backgroundColorPressed;

      return backgroundColor;
    },
    [theme, selected, onPress, variant]
  );

  const getLabelColor = useCallback(
    (pressed: boolean): ThemeColor => {
      if (!theme?.listItems[variant]) {
        return "transparent";
      }
      const { labelColor, labelColorSelected, labelColorPressed } = theme.listItems[variant];

      if (selected) return labelColorSelected;
      if (pressed && onPress) return labelColorPressed;
      return labelColor;
    },
    [theme, selected, onPress, variant]
  );

  const getSublabelColor = useCallback((): ThemeColor => {
    if (!theme?.listItems[variant]) {
      return "transparent";
    }
    const { sublabelColor, sublabelColorSelected } = theme.listItems[variant];
    if (selected) return sublabelColorSelected;
    return sublabelColor;
  }, [theme, selected, variant]);

  const getBorderColor = useCallback((): ThemeColor => {
    if (!theme?.listItems[variant]) {
      return "transparent";
    }
    const { borderColor } = theme.listItems[variant];
    return borderColor;
  }, [theme, variant]);

  const getBorderRadius = useCallback((): keyof Theme["borderRadii"] => {
    if (!theme?.listItems[variant]) {
      return "none";
    }
    const { borderRadius } = theme.listItems[variant];
    // oxlint-disable-next-line no-unsafe-type-assertion
    return borderRadius as keyof Theme["borderRadii"];
  }, [theme, variant]);

  const borderRadius = getBorderRadius();
  const backgroundColor = getBackgroundColor(pressed);
  const labelColor = getLabelColor(pressed);
  const sublabelColor = getSublabelColor();
  const borderColor = getBorderColor();

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <Pressable
      paddingTop="4"
      paddingBottom="3"
      paddingHorizontal="4"
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={handlePress}
      borderRadius={borderRadius}
      borderBottomColor={borderColor}
      borderBottomWidth={1}
      backgroundColor={backgroundColor}
      flexDirection="row"
      gap="2"
      justifyContent="space-between"
      {...rest}
    >
      {variant === "multiple" && (
        <Box flexDirection="row" alignItems="center" gap="2">
          <Checkbox id="list-item-checkbox" onChange={handlePress} checked={selected} />
          <Box>
            <Text variant="variant-2" color={labelColor}>
              {label}
            </Text>
            <Text variant="variant-2" color={sublabelColor}>
              {sublabel}
            </Text>
          </Box>
        </Box>
      )}
      {variant === "single" && (
        <Box justifyContent="center" flex={1}>
          <Text variant="variant-2" color={labelColor}>
            {label}
          </Text>
          {sublabel && (
            <Text variant="variant-2" color={sublabelColor}>
              {sublabel}
            </Text>
          )}
        </Box>
      )}
      {variant === "action" && (
        <>
          <Box>{leftElement}</Box>
          <Box>{rightElement}</Box>
        </>
      )}
    </Pressable>
  );
};

export default ListItem;
