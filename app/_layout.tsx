import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import Toast from "react-native-toast-message";

import ToastContent from "@/components/ui/ToastContent";
import AppContextProviders from "@/utils/providers/AppProviders";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

const toastConfig = {
  customToast: ({ props }: any) => (
    <ToastContent
      variant={props.variant}
      message={props.message}
      primaryActionLabel={props.primaryActionLabel}
      secondaryActionLabel={props.secondaryActionLabel}
      onPrimaryActionPress={props.onPrimaryActionPress}
      onSecondaryActionPress={props.onSecondaryActionPress}
      showCloseButton={props.showCloseButton}
      onClosePress={props.onClosePress}
    />
  ),
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "BalooBhai2-Regular": require("@/assets/fonts/BalooBhai2-Regular.ttf"),
    "BalooBhai2-Medium": require("@/assets/fonts/BalooBhai2-Medium.ttf"),
    "BalooBhai2-SemiBold": require("@/assets/fonts/BalooBhai2-SemiBold.ttf"),
    "BalooBhai2-Bold": require("@/assets/fonts/BalooBhai2-Bold.ttf"),
    "BalooBhai2-ExtraBold": require("@/assets/fonts/BalooBhai2-ExtraBold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AppContextProviders>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
      <Toast config={toastConfig} />
    </AppContextProviders>
  );
}
