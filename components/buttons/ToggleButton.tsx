import { useTheme } from "@shopify/restyle";
import React, { type ReactElement, cloneElement, useCallback } from "react";
import { ActivityIndicator } from "react-native";
import type { SvgProps } from "react-native-svg";

import type { ButtonWidth, LoaderPosition } from "@/types";
import type { Theme, ThemeColor } from "@/utils/theme/restyleTheme";

import Box from "../Box";
import Pressable from "../Pressable";
import Text from "../text/Text";

const BORDER_WIDTH = 1;

export interface ToggleButtonProps {
  label: string;
  checked?: boolean;
  onChange: () => void;
  width?: ButtonWidth;
  loading?: boolean;
  loaderPosition?: LoaderPosition;
  disabled?: boolean;
  leftElement?: ReactElement<SvgProps>;
  rightElement?: ReactElement<SvgProps>;
}

const ToggleButton = ({
  width = "m",
  checked,
  onChange,
  leftElement,
  rightElement,
  label,
  disabled,
  loading,
  loaderPosition = "right",
  ...rest
}: ToggleButtonProps) => {
  const theme = useTheme<Theme>();

  const buttonWidth = theme.buttonWidths[width];
  const buttonSize = theme.buttonSizes["small"];

  const getBackgroundColor = useCallback((): ThemeColor => {
    const { backgroundColor, backgroundColorDisabled } = theme.buttonVariants["outlined"];
    if (checked && !disabled) return "interactive-outlined-toggled";
    if (checked && disabled) return "interactive-outlined-disabled";
    if (!checked && disabled) return backgroundColorDisabled;
    return backgroundColor;
  }, [theme, disabled, checked]);

  const getBorderColor = useCallback((): ThemeColor => {
    if (!theme?.buttonVariants["outlined"]) {
      return "transparent";
    }
    const { borderColor, borderColorDisabled } = theme.buttonVariants["outlined"];

    if (disabled) return borderColorDisabled;
    return borderColor as ThemeColor;
  }, [theme, disabled]);

  const getLabelColor = useCallback((): ThemeColor => {
    if (checked) {
      return "interactive-outlined-on-toggled";
    }
    const { color, colorDisabled } = theme.buttonVariants["outlined"];

    if (disabled) return colorDisabled;
    return color;
  }, [theme, disabled, checked]);

  const backgroundColor = getBackgroundColor();
  const borderColor = getBorderColor();
  const labelColor = getLabelColor();

  const labelParsableColor = theme.colors[labelColor];
  const modifiedLoaderPosition = leftElement || loaderPosition === "left" ? "left" : "right";

  // We always apply the border and thus need to subtract the border width from the padding
  const calculatedButtonSize =
    // @ts-ignore
    parseInt(theme.spacing[buttonSize], 10) - BORDER_WIDTH;

  return (
    <Pressable
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      borderWidth={BORDER_WIDTH}
      disabled={disabled}
      borderRadius="rounding-button-rounding"
      onPress={onChange}
      width={buttonWidth}
      padding={buttonSize}
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      gap="2"
      style={{
        padding: calculatedButtonSize,
      }}
      {...rest}
    >
      {loading && modifiedLoaderPosition === "left" && (
        <Box width={24} height={24} alignItems="center" justifyContent="center">
          <ActivityIndicator color={labelParsableColor} size="small" />
        </Box>
      )}
      {leftElement && !loading && (
        <Box width={24} height={24}>
          {cloneElement(leftElement, {
            color: labelParsableColor,
          })}
        </Box>
      )}
      <Text variant="variant-2" color={labelColor}>
        {label}
      </Text>
      {rightElement && !loading && (
        <Box width={24} height={24}>
          {cloneElement(rightElement, {
            color: labelParsableColor,
          })}
        </Box>
      )}
      {loading && modifiedLoaderPosition === "right" && (
        <Box width={24} height={24} alignItems="center" justifyContent="center">
          <ActivityIndicator color={labelParsableColor} size="small" />
        </Box>
      )}
    </Pressable>
  );
};

export default ToggleButton;
