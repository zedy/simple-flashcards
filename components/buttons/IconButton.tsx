import { useTheme } from "@shopify/restyle";
import * as Haptics from "expo-haptics";
import React, { type ReactElement, cloneElement, useCallback, useState } from "react";
import { ActivityIndicator, type PressableProps } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import type { SvgProps } from "react-native-svg";

import type { IconButtonSize, IconButtonVariant } from "@/types";
import type { Theme, ThemeColor } from "@/utils/theme/restyleTheme";

import Box from "../Box";
import Pressable from "../Pressable";

const BORDER_WIDTH = 1;

export interface IconButtonProps extends PressableProps {
  onPress: () => void;
  icon: ReactElement<SvgProps>;
  variant: IconButtonVariant;
  size?: IconButtonSize;
  loading?: boolean;
  disabled?: boolean;
  iconColor?: ThemeColor;
  iconSize?: number;
}

const IconButton = ({
  variant = "primary",
  size = "m",
  icon,
  disabled,
  loading,
  iconColor,
  iconSize,
  ...rest
}: IconButtonProps) => {
  const theme = useTheme<Theme>();
  const [pressed, setPressed] = useState(false);

  // Animation values
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const buttonSize = theme.iconButtonSizes[size];

  // Animated style for press feedback
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const getBackgroundColor = useCallback(
    (pressed: boolean): ThemeColor => {
      if (!theme?.iconButtonVariants[variant]) {
        return "transparent";
      }
      const { backgroundColor, backgroundColorPressed, backgroundColorDisabled } = theme.iconButtonVariants[variant];

      if (disabled) return backgroundColorDisabled;
      if (pressed) return backgroundColorPressed;
      return backgroundColor;
    },
    [theme, variant, disabled],
  );
  const getBorderColor = useCallback(
    (pressed: boolean): ThemeColor => {
      if (!theme?.iconButtonVariants[variant]) {
        return "transparent";
      }
      const { borderColor, borderColorPressed, borderColorDisabled } = theme.iconButtonVariants[variant];

      if (disabled) return borderColorDisabled;
      if (pressed) return borderColorPressed;
      return borderColor;
    },
    [theme, disabled, variant],
  );

  const getLabelColor = useCallback(
    (pressed: boolean): ThemeColor => {
      if (iconColor) return iconColor;
      if (!theme?.iconButtonVariants[variant]) {
        return "transparent";
      }
      const { color, colorPressed, colorDisabled } = theme.iconButtonVariants[variant];

      if (disabled) return colorDisabled;
      if (pressed) return colorPressed;
      return color;
    },
    [theme, disabled, variant, iconColor],
  );

  const getHitbox = useCallback((): number => {
    return size === "s" ? theme.spacing["hitbox-hitbox-s"] : 0;
  }, [theme, size]);

  const borderColor = getBorderColor(pressed);
  const backgroundColor = getBackgroundColor(pressed);
  const color = getLabelColor(pressed);
  const parsableColor = theme.colors[color];
  const hitSlop = getHitbox();

  // We always apply the border and thus need to subtract the border width from the padding
  const calculatedButtonSize =
    // @ts-ignore
    parseInt(theme.spacing[buttonSize], 10) - BORDER_WIDTH;

  const handlePressIn = () => {
    setPressed(true);
    // Trigger haptic feedback
    if (!disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // Animate to pressed state
    scale.value = withTiming(0.95, { duration: 100 });
    opacity.value = withTiming(0.7, { duration: 100 });
  };

  const handlePressOut = () => {
    setPressed(false);
    // Animate back to normal state with spring
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });
    opacity.value = withTiming(1, { duration: 200 });
  };

  return (
    <Pressable
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      borderWidth={BORDER_WIDTH}
      disabled={disabled}
      borderRadius="rounding-button-rounding"
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      padding={buttonSize}
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      alignSelf="flex-start"
      hitSlop={{ bottom: hitSlop, top: hitSlop, left: hitSlop, right: hitSlop }}
      style={{
        padding: calculatedButtonSize,
      }}
      {...rest}
    >
      <Animated.View style={animatedStyle}>
        {loading && (
          <Box
            width={iconSize ?? 24}
            height={iconSize ?? 24}
            alignItems="center"
            justifyContent="center"
          >
            <ActivityIndicator
              color={parsableColor}
              size="small"
            />
          </Box>
        )}
        {icon && !loading && (
          <Box {...(iconSize !== undefined && { width: iconSize, height: iconSize })}>
            {cloneElement(icon, {
              color: parsableColor,
            })}
          </Box>
        )}
      </Animated.View>
    </Pressable>
  );
};

export default IconButton;
