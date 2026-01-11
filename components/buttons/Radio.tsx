import { useTheme } from "@shopify/restyle";
import React, { useCallback, useState } from "react";
import { Pressable as BasePressable } from "react-native";

import type { Theme, ThemeColor } from "@/utils/theme/restyleTheme";

import Box from "../Box";

export interface RadioProps {
  checked?: boolean;
  disabled?: boolean;
  onChange: () => void;
}

const Radio = ({ checked, onChange, disabled, ...rest }: RadioProps) => {
  const theme = useTheme<Theme>();
  const [pressed, setPressed] = useState(false);

  const getBackgroundColor = useCallback(
    (pressed: boolean): ThemeColor => {
      if (disabled) return "interactive-icon-disabled";
      if (pressed) return "interactive-icon-pressed";
      return checked ? "interactive-icon-idle-2" : "interactive-icon-idle";
    },
    [theme, checked, disabled]
  );

  const backgroundColor = getBackgroundColor(pressed);

  return (
    <BasePressable
      onPress={onChange}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={{
        width: 24,
        height: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      disabled={disabled}
      {...rest}
    >
      <Box
        borderRadius="full"
        borderColor="elevation-outline-1"
        width={18}
        height={18}
        alignItems="center"
        justifyContent="center"
        backgroundColor={backgroundColor}
      >
        <Box
          width={checked ? 5 : 14}
          height={checked ? 5 : 14}
          backgroundColor="interactive-primary-on"
          borderRadius="full"
        />
      </Box>
    </BasePressable>
  );
};

export default Radio;
