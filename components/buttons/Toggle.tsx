import { useTheme } from "@shopify/restyle";
import React, { useEffect, useState } from "react";
import { Pressable } from "react-native";
import { useSharedValue, withTiming } from "react-native-reanimated";

import type { Theme, ThemeColor } from "@/utils/theme/restyleTheme";

import { AnimatedBox } from "../Box";

export interface ToggleProps {
  checked?: boolean;
  disabled?: boolean;
  onChange: (checked: boolean, id: string) => void;
  id: string;
}

const TRANSLATE_Y_CHECKED = 19;
const TRANSLATE_Y_UNCHECKED = 2;

const Toggle = ({ onChange, checked, disabled, id }: ToggleProps) => {
  const [pressed, setPressed] = useState(false);
  const theme = useTheme<Theme>();
  const initialValue = checked ? TRANSLATE_Y_CHECKED : TRANSLATE_Y_UNCHECKED;
  const translate = useSharedValue(initialValue);

  const [backgroundColor, setBackgroundColor] = useState<ThemeColor>(
    disabled ? "interactive-icon-disabled" : "interactive-icon-idle"
  );

  useEffect(() => {
    if (pressed) {
      setBackgroundColor("interactive-icon-pressed");
      return;
    }
    if (checked) {
      translate.value = withTiming(TRANSLATE_Y_CHECKED);
      setBackgroundColor(disabled ? "interactive-icon-disabled" : "interactive-primary-bg-idle");
    } else {
      translate.value = withTiming(TRANSLATE_Y_UNCHECKED);
      setBackgroundColor(disabled ? "interactive-icon-disabled" : "interactive-icon-idle");
    }
  }, [checked, translate, disabled, theme.colors, pressed]);

  const handlePress = () => {
    onChange(!checked, id);
  };

  const hitSlop = theme.spacing["hitbox-hitbox-xxs"];

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      hitSlop={{ bottom: hitSlop, top: hitSlop, left: hitSlop, right: hitSlop }}
    >
      <AnimatedBox backgroundColor={backgroundColor} width={40} height={24} borderRadius="full" justifyContent="center">
        <AnimatedBox
          width={19}
          height={19}
          borderRadius="m"
          backgroundColor="elevation-background-dark-2"
          style={[
            {
              transform: [
                {
                  translateX: translate,
                },
              ],
            },
          ]}
        />
      </AnimatedBox>
    </Pressable>
  );
};

export default Toggle;
