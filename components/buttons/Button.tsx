import { useTheme } from "@shopify/restyle";
import React, { type ReactElement, type ReactNode, cloneElement, useCallback, useState } from "react";
import { ActivityIndicator, type TextProps, type ViewStyle } from "react-native";

import type { ButtonSize, ButtonVariant, ButtonWidth, LoaderPosition } from "@/types";
import type { Theme, ThemeColor } from "@/utils/theme/restyleTheme";

import Box from "../Box";
import Pressable from "../Pressable";
import Text from "../text/Text";

const BORDER_WIDTH = 1;

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  width?: ButtonWidth;
  size?: ButtonSize;
  loading?: boolean;
  loaderPosition?: LoaderPosition;
  disabled?: boolean;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
  style?: ViewStyle;
  textVariant?: Exclude<keyof Theme["textVariants"], "defaults">;
}

const Button = ({
  variant = "primary",
  width = "m",
  size = "default",
  leftElement,
  rightElement,
  label,
  disabled,
  loading,
  loaderPosition = "right",
  style,
  textVariant = "variant-2",
  ...rest
}: ButtonProps) => {
  const theme = useTheme<Theme>();
  const [pressed, setPressed] = useState(false);

  const buttonWidth = theme.buttonWidths[width];
  const buttonSize = theme.buttonSizes[size];

  const getBackgroundColor = useCallback(
    (pressed: boolean): ThemeColor => {
      if (!theme?.buttonVariants[variant]) {
        return "transparent";
      }
      const { backgroundColor, backgroundColorPressed, backgroundColorDisabled } = theme.buttonVariants[variant];

      if (disabled) return backgroundColorDisabled as ThemeColor;
      if (pressed) return backgroundColorPressed as ThemeColor;
      return backgroundColor as ThemeColor;
    },
    [theme, variant, disabled]
  );

  const getBorderColor = useCallback(
    (pressed: boolean): ThemeColor => {
      if (!theme?.buttonVariants[variant]) {
        return "transparent";
      }
      const { borderColor, borderColorPressed, borderColorDisabled } = theme.buttonVariants[variant];

      if (disabled) return borderColorDisabled as ThemeColor;
      if (pressed) return borderColorPressed as ThemeColor;
      return borderColor as ThemeColor;
    },
    [theme, disabled, variant]
  );

  const getLabelColor = useCallback(
    (pressed: boolean): ThemeColor => {
      if (!theme?.buttonVariants[variant]) {
        return "transparent";
      }
      const { color, colorPressed, colorDisabled } = theme.buttonVariants[variant];

      if (disabled) return colorDisabled as ThemeColor;
      if (pressed) return colorPressed as ThemeColor;
      return color as ThemeColor;
    },
    [theme, disabled, variant]
  );

  const getHitbox = useCallback((): number => {
    if (size === "large") {
      return theme.spacing["hitbox-hitbox-l"];
    } else if (size === "default") {
      return theme.spacing["hitbox-hitbox-m"];
    }
    return theme.spacing["hitbox-hitbox-s"];
  }, [theme, size]);

  const backgroundColor = getBackgroundColor(pressed);
  const borderColor = getBorderColor(pressed);
  const labelColor = getLabelColor(pressed);
  const hitSlop = getHitbox();

  const labelParsableColor = theme.colors[labelColor];
  const modifiedLoaderPosition = leftElement || loaderPosition === "left" ? "left" : "right";

  const isTextVariant = variant === "text";

  // We always apply the border and thus need to subtract the border width from the padding
  const calculatedButtonSize = isTextVariant
    ? 0
    : // @ts-ignore
      parseInt(theme.spacing[buttonSize], 10) - BORDER_WIDTH;

  return (
    <Pressable
      accessibilityRole="button"
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      borderWidth={isTextVariant ? 0 : BORDER_WIDTH}
      disabled={disabled}
      borderRadius="rounding-button-rounding"
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      minWidth={isTextVariant ? undefined : buttonWidth}
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      hitSlop={{
        bottom: hitSlop,
        top: hitSlop,
        left: hitSlop,
        right: hitSlop,
      }}
      gap="2"
      style={{
        ...style,
        // padding: calculatedButtonSize,
        paddingHorizontal: calculatedButtonSize * 2,
        paddingVertical: calculatedButtonSize,
      }}
      {...rest}
    >
      {loading && modifiedLoaderPosition === "left" && (
        <Box width={24} height={24} alignItems="center" justifyContent="center">
          <ActivityIndicator
            accessible
            accessibilityRole="spinbutton"
            accessibilityLabel={`${label} - loading...`}
            color={labelParsableColor}
            size="small"
          />
        </Box>
      )}
      {leftElement && !loading && (
        <Box width={24} height={24}>
          {/* oxlint-disable-next-line no-unsafe-type-assertion */}
          {cloneElement(leftElement as ReactElement<TextProps>, { style: [{ color: labelParsableColor }] })}
        </Box>
      )}
      <Text variant={textVariant || "variant-2"} color={labelColor}>
        {label}
      </Text>
      {rightElement && !loading && (
        <Box width={24} height={24}>
          {/* oxlint-disable-next-line no-unsafe-type-assertion */}
          {cloneElement(rightElement as ReactElement<TextProps>, { style: [{ color: labelParsableColor }] })}
        </Box>
      )}
      {loading && modifiedLoaderPosition === "right" && (
        <Box width={24} height={24} alignItems="center" justifyContent="center">
          <ActivityIndicator
            accessible
            accessibilityRole="spinbutton"
            accessibilityLabel={`${label} - loading...`}
            color={labelParsableColor}
            size="small"
          />
        </Box>
      )}
    </Pressable>
  );
};

export default Button;
