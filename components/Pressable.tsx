import { createBox } from "@shopify/restyle";
import { type PressableProps, Pressable as RNPressable } from "react-native";

import type { Theme } from "@/utils/theme/restyleTheme";

const Pressable = createBox<Theme, PressableProps>(RNPressable);

export default Pressable;
