import { useTheme } from "@shopify/restyle";
import { InfoIcon } from "lucide-react-native";
import type { ReactElement } from "react";

import Box from "@/components/Box";
import Button from "@/components/buttons/Button";
import TextView from "@/components/text/Text";
import type { Theme } from "@/utils/theme/restyleTheme";

interface InfoModalProps {
  text: string;
  icon?: ReactElement;
  action?: {
    callback: () => void;
    button: string;
  };
  onClose?: () => void;
}

export const InfoModal = ({ action, text, icon, onClose }: InfoModalProps) => {
  const theme = useTheme<Theme>();

  const handleActionCallback = () => {
    onClose?.();
    action?.callback();
  };

  return (
    <Box
      padding={"4"}
      justifyContent={"center"}
      alignItems={"center"}
      gap={"2"}
    >
      {icon || (
        <InfoIcon
          color={theme.colors["drawer-border"]}
          size={48}
        />
      )}
      <TextView
        variant={"variant-3-bold"}
        color={"interactive-text-1"}
        textAlign={"center"}
      >
        {text}
      </TextView>
      {action && (
        <Button
          label={action.button}
          textVariant="variant-2-bold"
          onPress={handleActionCallback}
          width="l"
        />
      )}
    </Box>
  );
};
