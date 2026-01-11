import { Platform } from "react-native";
import Toast from "react-native-toast-message";

import type { ToastContentProps } from "@/components/ui/ToastContent";

export const showToast = ({
  primaryActionLabel,
  secondaryActionLabel,
  onPrimaryActionPress,
  onSecondaryActionPress,
  message,
  variant,
  offset = 10,
  showCloseButton,
}: ToastContentProps) => {
  const parsedOffset = Platform.OS === "ios" ? offset + 80 : offset + 60;

  const handleClose = () => {
    Toast.hide();
  };

  Toast.show({
    type: "customToast",
    position: "bottom",
    bottomOffset: parsedOffset,
    visibilityTime: 3000,
    autoHide: true,
    props: {
      variant,
      message,
      primaryActionLabel,
      secondaryActionLabel,
      onPrimaryActionPress,
      onSecondaryActionPress,
      showCloseButton,
      onClosePress: handleClose,
    },
  });
};
