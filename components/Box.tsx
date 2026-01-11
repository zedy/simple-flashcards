import { createBox } from "@shopify/restyle";
import { BlurView, type BlurViewProps } from "expo-blur";
import Animated from "react-native-reanimated";

import type { Theme } from "@/utils/theme/restyleTheme";

const Box = createBox<Theme>();

export const AnimatedBox = Animated.createAnimatedComponent(Box);

export const BlurredBox = createBox<Theme, BlurViewProps>(BlurView);

export default Box;
