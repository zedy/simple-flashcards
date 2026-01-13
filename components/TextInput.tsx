import {
  type BoxProps,
  type ColorProps,
  type LayoutProps,
  type SpacingProps,
  type VisibleProps,
  createBox,
  createRestyleComponent,
} from "@shopify/restyle";
import React, { useRef } from "react";
import { TextInput as RNTextInput, type TextInputProps as RNTextInputProps } from "react-native";
import Animated from "react-native-reanimated";

import type { Theme } from "@/utils/theme/restyleTheme";

type TextInputProps = BoxProps<Theme> &
  SpacingProps<Theme> &
  VisibleProps<Theme> &
  ColorProps<Theme> &
  LayoutProps<Theme> &
  RNTextInputProps;

const BaseTextInput = createRestyleComponent<TextInputProps, Theme>([], createBox<Theme>(RNTextInput));

const TextInput = React.forwardRef<RNTextInput, TextInputProps>((props, ref) => {
  const internalRef = useRef<RNTextInput>(null);

  React.useImperativeHandle(ref, () => internalRef.current as RNTextInput, []);

  return <BaseTextInput {...props} ref={internalRef} />;
});

TextInput.displayName = 'TextInput';

export const AnimatedTextInput = Animated.createAnimatedComponent(BaseTextInput);

export default TextInput;
