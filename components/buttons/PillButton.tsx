import { useTheme } from "@shopify/restyle";
import { X } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import type { ViewStyle } from "react-native";

import type { PillButtonVariant } from "@/types";
import type { Theme, ThemeColor } from "@/utils/theme/restyleTheme";

import Box from "../Box";
import Pressable from "../Pressable";
import Text from "../text/Text";

export interface PillButtonProps {
  variant?: PillButtonVariant;
  checked?: boolean;
  label: string;
  dismissable?: boolean;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textVariant?: Exclude<keyof Theme["textVariants"], "defaults">;
  size?: "s" | "m" | "l";
}

const PillButton = ({
  variant = "filled",
  checked,
  label,
  dismissable,
  onPress,
  disabled,
  style,
  textVariant = "variant-2",
  size = "s",
  ...rest
}: PillButtonProps) => {
  const theme = useTheme<Theme>();
  const [pressed, setPressed] = useState(false);

  const getBackgroundColor = useCallback(
    (pressed: boolean): ThemeColor => {
      if (!theme?.pillVariants[variant]) {
        return "transparent";
      }
      const pillVariant = theme.pillVariants[variant];
      const { backgroundColor, backgroundColorPressed, backgroundColorDisabled } = pillVariant;

      if (disabled) return backgroundColorDisabled;
      if (pressed) return backgroundColorPressed;
      return backgroundColor;
    },
    [theme, variant, disabled],
  );

  const getLabelColor = useCallback(
    (pressed: boolean): ThemeColor => {
      if (!theme?.pillVariants[variant]) {
        return "transparent";
      }
      const { color, colorPressed, colorDisabled } = theme.pillVariants[variant];
      const colorToggled = (theme.pillVariants[variant] as any)?.colorToggled;

      if (disabled) return colorDisabled;
      if (checked && !disabled && colorToggled) return colorToggled;
      if (pressed) return colorPressed;
      return color;
    },
    [theme, disabled, variant, checked],
  );

  const getBorderColor = useCallback((): ThemeColor => {
    if (!theme?.pillVariants[variant]) {
      return "transparent";
    }
    const { borderColor, borderColorPressed, borderColorDisabled } =
      theme.pillVariants[variant];

    if (checked && !disabled) return borderColorPressed;
    if (!checked && disabled) return borderColorDisabled;

    return borderColor;
  }, [theme, disabled, checked, variant]);

  const backgroundColor = getBackgroundColor(pressed);
  const labelColor = getLabelColor(pressed);
  const borderColor = getBorderColor();
  const hitSlop = theme.spacing["hitbox-hitbox-xs"];
  const pillSize = theme.pillSizes[size];
  const pillVariant = theme.pillVariants[variant];
  // @ts-expect-error - boxShadow is not in the type definition but exists in theme
  const boxShadow = pillVariant?.boxShadow;
  // Only apply shadow when not checked (white background state) for toggle variant
  const shouldShowShadow = boxShadow && !checked && !disabled;

  return (
    <Pressable
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      borderWidth={1}
      disabled={disabled}
      borderRadius="m"
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={onPress}
      flexDirection="row"
      gap="interior-icon-to-label-spacing"
      alignSelf="flex-start"
      hitSlop={{ bottom: hitSlop, top: hitSlop, left: hitSlop, right: hitSlop }}
      style={{
        paddingHorizontal: pillSize.horizontal,
        paddingVertical: pillSize.vertical,
        overflow: "visible",
        ...(shouldShowShadow && theme.shadows[boxShadow as keyof Theme["shadows"]]),
        ...style,
      }}
      {...rest}
    >
      <Text
        variant={textVariant}
        color={labelColor}
        textAlignVertical={"center"}
      >
        {label}
      </Text>
      {dismissable && (
        <Box
          justifyContent="center"
          alignItems="center"
        >
          <X color={theme.colors[labelColor]} />
        </Box>
      )}
    </Pressable>
  );
};

export default PillButton;
