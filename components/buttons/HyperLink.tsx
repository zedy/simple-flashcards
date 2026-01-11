import { type ReactNode, useCallback, useState } from "react";
import { Linking } from "react-native";

import type { ThemeColor } from "@/utils/theme/restyleTheme";

import Text from "../text/Text";

interface HyperLinkProps {
  url: string;
  children: ReactNode;
}

const HyperLink = ({ children, url }: HyperLinkProps) => {
  const [pressed, setPressed] = useState(false);

  const getLabelColor = useCallback((pressed: boolean): ThemeColor => {
    if (pressed) return "interactive-primary-pressed";
    return "interactive-primary-idle";
  }, []);

  const handlePress = () => {
    if (!Linking.canOpenURL(url)) {
      return;
    }
    void Linking.openURL(url);
  };

  const labelColor = getLabelColor(pressed);

  return (
    <Text
      color={labelColor}
      onPress={handlePress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      {children}
    </Text>
  );
};

export default HyperLink;
