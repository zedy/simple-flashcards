import {
  type BoxProps,
  type ColorProps,
  type LayoutProps,
  type SpacingProps,
  type VisibleProps,
  color,
  createBox,
  createRestyleComponent,
  layout,
  spacing,
  visible,
} from "@shopify/restyle";
import { Image as ExpoImage, type ImageProps as ExpoImageProps } from "expo-image";
import Animated from "react-native-reanimated";

import type { Theme } from "@/utils/theme/restyleTheme";

type ImageProps = BoxProps<Theme> &
  SpacingProps<Theme> &
  VisibleProps<Theme> &
  ColorProps<Theme> &
  LayoutProps<Theme> &
  ExpoImageProps;

const Image = createRestyleComponent<ImageProps, Theme>([spacing, visible, color, layout], createBox<Theme>(ExpoImage));

export const AnimatedImage = Animated.createAnimatedComponent(Image);

export default Image;
