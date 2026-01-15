import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import Toast from "react-native-toast-message";

import SplashScreenComponent from "@/components/SplashScreen";
import ToastContent from "@/components/ui/ToastContent";
import { SPLASH_SCREEN_MIN_DURATION } from "@/constants/shared";
import { useSetsStore } from "@/stores/useSetsStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
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

  const { hydrate: hydrateSets, isHydrated: setsHydrated } = useSetsStore();
  const { hydrate: hydrateSettings, isHydrated: settingsHydrated } = useSettingsStore();
  const [isReady, setIsReady] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      await Promise.all([hydrateSets(), hydrateSettings()]);
    };
    initializeApp();

    // Minimum splash screen display
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, SPLASH_SCREEN_MIN_DURATION);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (fontsLoaded && setsHydrated && settingsHydrated && minTimeElapsed) {
      setIsReady(true);
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, setsHydrated, settingsHydrated, minTimeElapsed]);

  if (!isReady) {
    return (
      <AppContextProviders>
        <SplashScreenComponent />
      </AppContextProviders>
    );
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
