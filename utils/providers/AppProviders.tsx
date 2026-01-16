/* eslint-disable react/display-name */
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { ThemeProvider as RestyleThemeProvider } from "@shopify/restyle";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import type { FC, PropsWithChildren } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { ThemeEnum } from "@/types";
import { darkTheme, lightTheme } from "@/utils/theme/restyleTheme";

/* eslint-disable-next-line */
type AnyChildren = PropsWithChildren<any>;

export const combineProviders = (...components: any[]) => {
  return components.reduce(
    (AccumulatedComponents: AnyChildren, CurrentComponent: AnyChildren) => {
      return ({ children }: AnyChildren) => {
        return (
          <AccumulatedComponents>
            <CurrentComponent>{children}</CurrentComponent>
          </AccumulatedComponents>
        );
      };
    },
    ({ children }: AnyChildren) => <>{children}</>
  );
};

// Wrapper components for providers that need props
const RestyleProvider: FC<PropsWithChildren> = ({ children }) => {
  const { settings } = useSettingsStore();

  const activeTheme = settings.theme === ThemeEnum.dark ? darkTheme : lightTheme;

  return <RestyleThemeProvider theme={activeTheme}>{children}</RestyleThemeProvider>;
};

const NavigationThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const { settings } = useSettingsStore();
  return (
    <ThemeProvider value={settings.theme === ThemeEnum.dark ? DarkTheme : DefaultTheme}>
      {children}
    </ThemeProvider>
  );
};

/**
 *  The order of the providers is significant
 *  NOTE: If you need to change the order, DO IT CAREFULLY!
 */
const providers = [
  SafeAreaProvider,
  RestyleProvider,
  NavigationThemeProvider,
  BottomSheetModalProvider,
  // Confirmation.Provider,
] as const;

const AppContextProviders = combineProviders(...providers);

export default AppContextProviders;
