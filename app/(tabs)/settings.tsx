import { MoonIcon, SunIcon } from "lucide-react-native";
import { useEffect } from "react";

import Box from "@/components/Box";
import IconButton from "@/components/buttons/IconButton";
import Toggle from "@/components/buttons/Toggle";
import Header from "@/components/Header";
import TextView from "@/components/text/Text";
import { useSettingsStore } from "@/stores/useSettingsStore";

export default function SettingsScreen() {
  const { settings, updateSetting, hydrate } = useSettingsStore();

  useEffect(() => {
    hydrate();
  }, []);

  const handleToggleProgressBar = () => {
    updateSetting("showProgressBar", !settings.showProgressBar);
  };

  const handleToggleTheme = () => {
    updateSetting("theme", settings.theme === "dark" ? "light" : "dark");
  };

  const isDark = settings.theme === "dark";

  return (
    <Box
      flex={1}
      backgroundColor="elevation-background-dark-2"
    >
      <Header title="Settings" />
      <Box
        flex={1}
        padding="5"
        gap={"4"}
      >
        <Box flexDirection={"row"} width={"100%"} justifyContent={"space-between"} alignItems={"center"} paddingBottom={"2"}>
          <TextView variant={"variant-2-bold"} color={"interactive-primary-text-idle"}>Theme</TextView>
          <IconButton variant='transparent' icon={isDark ? <MoonIcon size={32} /> : <SunIcon size={32} />} iconColor='interactive-primary-text-idle' onPress={handleToggleTheme} />
        </Box>
        <Box flexDirection={"row"} width={"100%"} justifyContent={"space-between"} alignItems={"center"} paddingRight={"2"}>
          <TextView variant={"variant-2-bold"} color={"interactive-primary-text-idle"}>Show progress bar</TextView>
          <Toggle id={"1"} onChange={handleToggleProgressBar} checked={settings.showProgressBar} />
        </Box>
      </Box>
    </Box>
  );
}
