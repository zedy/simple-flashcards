import { useTheme } from "@shopify/restyle";
import { X } from "lucide-react-native";
import React, { useCallback } from "react";

import type { ToastVariant } from "@/types";
import type { Theme, ThemeColor } from "@/utils/theme/restyleTheme";

import Box from "../Box";
import IconButton from "../buttons/IconButton";
import TextButton from "../buttons/TextButton";
import Text from "../text/Text";

export interface ToastContentProps {
  message: string;
  variant: ToastVariant;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  onPrimaryActionPress?: () => void;
  onSecondaryActionPress?: () => void;
  offset?: number;
  showCloseButton?: boolean;
  onClosePress?: () => void;
}

const ToastContent = ({
  variant,
  message,
  primaryActionLabel,
  secondaryActionLabel,
  onPrimaryActionPress,
  onSecondaryActionPress,
  showCloseButton,
  onClosePress,
}: ToastContentProps) => {
  const theme = useTheme<Theme>();

  const getBackgroundColor = useCallback((): ThemeColor => {
    if (!theme?.toastVariants[variant]) {
      return "transparent";
    }
    const { backgroundColor } = theme.toastVariants[variant];
    return backgroundColor;
  }, [theme, variant]);

  const backgroundColor = getBackgroundColor();

  const hasActions = !!(primaryActionLabel || secondaryActionLabel);

  return (
    <Box
      backgroundColor={backgroundColor}
      borderRadius="sm"
      width="90%"
      marginHorizontal="5"
      paddingHorizontal="5"
      style={{
        ...theme.shadows["shadow-2"],
      }}
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      flexWrap="wrap"
    >
      <Box
        paddingHorizontal="4"
        paddingVertical="3-5"
        flexDirection="row"
        gap="2"
        flex={1}
      >
        <Text
          variant="variant-1"
          color="button-text-color"
          textAlign="left"
        >
          {message}
        </Text>
      </Box>
      {hasActions && (
        <Box
          flexDirection="row"
          marginRight="2"
          style={{ marginLeft: "auto" }}
        >
          {!!primaryActionLabel && (
            <TextButton
              variant="toast"
              label={primaryActionLabel}
              onPress={() => onPrimaryActionPress?.()}
            />
          )}
          {secondaryActionLabel && (
            <TextButton
              variant="toast"
              label={secondaryActionLabel}
              onPress={() => onSecondaryActionPress?.()}
            />
          )}
          {showCloseButton && (
            <IconButton
              variant="transparent"
              size="s"
              icon={<X color={theme.colors["interactive-secondary-on"]} />}
              onPress={() => onClosePress?.()}
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default ToastContent;
