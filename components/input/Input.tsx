import { type BoxProps, useTheme } from "@shopify/restyle";
import React, { type ReactNode, useCallback, useRef, useState } from "react";
import { ActivityIndicator, Platform, type TextInput as RNTextInput } from "react-native";

import type { InputVariant } from "@/types";
import { getInputBackgroundColor, getInputBorderColor, getInputInputColor, getInputLabelColor } from "@/utils/inputs";
import type { Theme, ThemeColor } from "@/utils/theme/restyleTheme";

import Box from "../Box";
import Pressable from "../Pressable";
import TextInput from "../TextInput";
import Text from "../text/Text";

export interface InputProps extends BoxProps<Theme> {
  variant?: InputVariant;
  type?: "input" | "textArea";
  label: string;
  placeholder: string;
  required?: boolean;
  helperText?: string;
  onChangeText: (text: string) => void;
  value?: string;
  loading?: boolean;
  disabled?: boolean;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
  error?: string;
  secureTextEntry?: boolean; // password input type
  tooltipText?: string;
  onPress?: () => void;
  limit?: number;
  textVariant?: Exclude<keyof Theme["textVariants"], "defaults">;
  onSubmitEditing?: () => void;
  borderRadius?: keyof Theme["borderRadii"];
  borderColor?: ThemeColor;
  backgroundColor?: ThemeColor;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?:
  | "default"
  | "email-address"
  | "numeric"
  | "phone-pad"
  | "number-pad"
  | "decimal-pad"
  | "url"
  | "web-search";
  autoCorrect?: boolean;
}

const Input = ({
  variant = "outlined",
  type = "input",
  placeholder,
  leftElement,
  rightElement,
  label,
  required,
  helperText,
  disabled,
  loading,
  onChangeText,
  value,
  error,
  tooltipText,
  onPress,
  limit,
  textVariant = "variant-input",
  onSubmitEditing,
  borderRadius,
  borderColor: customBorderColor,
  backgroundColor: customBackgroundColor,
  ...rest
}: InputProps) => {
  const theme = useTheme<Theme>();
  const [active, setActive] = useState(false);
  const inputRef = useRef<RNTextInput>(null);

  const handleFocus = () => {
    inputRef?.current?.focus();
  };

  const getBackgroundColor = useCallback(
    (active: boolean): ThemeColor => getInputBackgroundColor(theme, variant, disabled, active, error),
    [theme, variant, disabled, error]
  );

  const getBorderColor = useCallback(
    (active: boolean): ThemeColor => getInputBorderColor(theme, variant, disabled, active, error),
    [theme, variant, disabled, error]
  );

  const getLabelColor = useCallback(
    (active: boolean): ThemeColor => getInputLabelColor(theme, variant, disabled, active, error),
    [theme, variant, disabled, error]
  );

  const getInputColor = useCallback(
    (active: boolean): ThemeColor => getInputInputColor(theme, variant, disabled, active, error),
    [theme, variant, disabled, error]
  );

  const backgroundColor = customBackgroundColor ?? getBackgroundColor(active);
  const borderColor = customBorderColor ?? getBorderColor(active);
  const labelColor = getLabelColor(active);
  const inputColor = getInputColor(active);
  const { marginVertical = "0", ...pressableProps } = rest;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label} - outer`}
      onPress={handleFocus}
      width="100%"
      onPressIn={onPress}
      {...pressableProps}
    >
      <Box flexDirection="row" alignItems="center">
        <Text variant="variant-3" color={labelColor} paddingBottom={"1"}>
          {label}
        </Text>
        <Box flexDirection="row" alignItems="center">
          {required && <Text color="informational-error">*</Text>}
        </Box>
      </Box>
      {helperText && (
        <Text variant="variant-3" color="text-default-secondary">
          {helperText}
        </Text>
      )}
      <Box
        flexDirection="row"
        alignItems={type === "textArea" ? "flex-start" : "center"}
        gap="2"
        marginVertical={marginVertical}
        backgroundColor={backgroundColor}
        borderColor={borderColor}
        borderWidth={1}
        borderRadius={borderRadius ?? (variant !== "outlined" ? "rounding-button-rounding" : "rounding-input-rounding")}
        height={type === "textArea" ? 96 : 54}
        paddingHorizontal={variant === "outlined" ? "5" : "height-height-m"}
        paddingVertical={
          variant === "outlined"
            ? "4"
            : type === "textArea"
              ? "height-height-s"
              : Platform.select({ default: undefined, ios: "height-height-m" })
        }
      >
        {leftElement && type !== "textArea" && <Box>{leftElement}</Box>}
        <TextInput
          ref={inputRef}
          flex={1}
          onFocus={() => setActive(true)}
          onBlur={() => setActive(false)}
          onChangeText={onChangeText}
          onPressIn={onPress}
          value={value}
          editable={!disabled && !onPress}
          accessibilityLabel={label}
          placeholder={placeholder}
          // placeholderTextColor={theme.colors["text-default-tertiary"]}
          placeholderTextColor="#111827ff"
          style={{
            color: theme.colors[inputColor],
            fontSize: theme.textVariants[textVariant].fontSize,
            fontFamily: theme.textVariants[textVariant].fontFamily,
            paddingVertical: 0,
            outline: "none"
          }}
          multiline={type === "textArea"}
          textAlignVertical={type === "textArea" ? "top" : "center"}
          onSubmitEditing={onSubmitEditing}
          {...rest}
        />
        {rightElement && !loading && type !== "textArea" && <Box>{rightElement}</Box>}
        {loading && (
          <Box>
            <ActivityIndicator accessible accessibilityRole="spinbutton" accessibilityLabel={`${label} - loading...`} />
          </Box>
        )}
      </Box>
      <Box
        position="absolute"
        bottom={-18}
        flexDirection="row"
        alignItems="flex-start"
        justifyContent="space-between"
        gap="1"
        width="100%"
      >
        <Box flexShrink={1}>
          {error && (
            <Text variant="variant-1" color="informational-error">
              {error}
            </Text>
          )}
        </Box>        
      </Box>
    </Pressable>
  );
};

export default Input;
