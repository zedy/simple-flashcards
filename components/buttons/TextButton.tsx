import { type BoxProps, useTheme } from "@shopify/restyle";
import React, { type ReactElement, cloneElement, useCallback, useState } from "react";
import type { SvgProps } from "react-native-svg";

import type { TextButtonVariant } from "@/types";
import type { Theme, ThemeColor } from "@/utils/theme/restyleTheme";

import Box from "../Box";
import Pressable from "../Pressable";
import Text from "../text/Text";

export interface TextButtonProps extends BoxProps<Theme> {
  variant?: TextButtonVariant;
  icon?: ReactElement<SvgProps>;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  textVariant?: Exclude<keyof Theme["textVariants"], "defaults">;
}

const TextButton = ({
  variant = "primary",
  icon,
  label,
  disabled,
  textVariant = "variant-2",
  ...rest
}: TextButtonProps) => {
  const theme = useTheme<Theme>();
  const [pressed, setPressed] = useState(false);

  const getBackgroundColor = useCallback(
    (pressed: boolean): ThemeColor => {
      if (!theme?.textButtonVariants[variant]) {
        return "transparent";
      }
      const { backgroundColor, backgroundColorPressed, backgroundColorDisabled } = theme.textButtonVariants[variant];

      if (disabled) return backgroundColorDisabled as ThemeColor;
      if (pressed) return backgroundColorPressed as ThemeColor;
      return backgroundColor as ThemeColor;
    },
    [theme, variant, disabled]
  );

  const getLabelColor = useCallback(
    (pressed: boolean): ThemeColor => {
      if (!theme?.textButtonVariants[variant]) {
        return "transparent";
      }
      const { color, colorPressed, colorDisabled } = theme.textButtonVariants[variant];

      if (disabled) return colorDisabled as ThemeColor;
      if (pressed) return colorPressed as ThemeColor;
      return color as ThemeColor;
    },
    [theme, disabled, variant]
  );

  const getIconColor = useCallback(
    (pressed: boolean): ThemeColor => {
      if (!theme?.textButtonVariants[variant]) {
        return "transparent";
      }
      const { iconColor, iconColorPressed, iconColorDisabled } = theme.textButtonVariants[variant];

      if (disabled) return iconColorDisabled as ThemeColor;
      if (pressed) return iconColorPressed as ThemeColor;
      return iconColor as ThemeColor;
    },
    [theme, disabled, variant]
  );

  const backgroundColor = getBackgroundColor(pressed);
  const labelColor = getLabelColor(pressed);
  const iconColor = getIconColor(pressed);
  const hitSlop = theme.spacing["hitbox-hitbox-xs"];

  return (
    <Pressable
      backgroundColor={backgroundColor}
      disabled={disabled}
      borderRadius="rounding-button-rounding"
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      alignSelf="flex-start"
      py="1"
      px="2"
      gap="1"
      hitSlop={{ bottom: hitSlop, top: hitSlop, left: hitSlop, right: hitSlop }}
      {...rest}
    >
      {icon && (
        <Box width={24} height={24}>
          {cloneElement(icon, {
            color: theme.colors[iconColor],
          })}
        </Box>
      )}
      <Text variant={textVariant} color={labelColor}>
        {label}
      </Text>
    </Pressable>
  );
};

export default TextButton;
