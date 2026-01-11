import {
  type BoxProps,
  type ColorProps,
  type LayoutProps,
  type SpacingProps,
  type VisibleProps,
  createBox,
  createRestyleComponent,
} from "@shopify/restyle";
import { TextInput as RNTextInput, type TextInputProps as RNTextInputProps } from "react-native";
import Animated from "react-native-reanimated";

import type { Theme } from "@/utils/theme/restyleTheme";

type TextInputProps = BoxProps<Theme> &
  SpacingProps<Theme> &
  VisibleProps<Theme> &
  ColorProps<Theme> &
  LayoutProps<Theme> &
  RNTextInputProps;

const TextInput = createRestyleComponent<TextInputProps, Theme>([], createBox<Theme>(RNTextInput));

export const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default TextInput;
