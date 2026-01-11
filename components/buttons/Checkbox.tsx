import { useTheme } from "@shopify/restyle";
import { MinusIcon, X } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import { Pressable as BasePressable } from "react-native";

import type { Theme, ThemeColor } from "@/utils/theme/restyleTheme";

import Box from "../Box";

export interface CheckboxProps {
  checked?: boolean | "indeterminate";
  disabled?: boolean;
  onChange: (id) => void;
  id: string;
}

const Checkbox = ({ id, checked, onChange, disabled, ...rest }: CheckboxProps) => {
  const theme = useTheme<Theme>();
  const [pressed, setPressed] = useState(false);

  const getBackgroundColor = useCallback(
    (pressed: boolean): ThemeColor => {
      if (disabled) return "interactive-icon-disabled";
      if (pressed) return "interactive-icon-pressed";
      return checked ? "interactive-icon-idle-2" : "interactive-icon-idle";
    },
    [theme, checked, disabled],
  );

  const backgroundColor = getBackgroundColor(pressed);
  const textColor = "interactive-primary-on";
  const calculatedTextColor = theme.colors["interactive-primary-on"];

  return (
    <BasePressable
      onPress={() => onChange(id)}
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
        borderRadius="s"
        width={20}
        height={20}
        alignItems="center"
        justifyContent="center"
        backgroundColor={backgroundColor}
      >
        <Box
          width={checked ? 0 : 20}
          height={checked ? 0 : 20}
          backgroundColor={textColor}
          borderRadius="xs"
          borderColor={"pill-default-border"}
          borderWidth={1}
        />
        {checked === true && (
          <X
            color={calculatedTextColor}
            width={10}
            height={19}
          />
        )}
        {checked === "indeterminate" && <MinusIcon color={calculatedTextColor} />}
      </Box>
    </BasePressable>
  );
};

export default Checkbox;
