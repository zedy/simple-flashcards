import { useEffect } from "react";

import Box from "@/components/Box";
import Toggle from '@/components/buttons/Toggle';
import Header from "@/components/Header";
import TextView from '@/components/text/Text';
import { useSettingsStore } from "@/stores/useSettingsStore";

export default function SettingsScreen() {
  const { settings, updateSetting, hydrate } = useSettingsStore();

  useEffect(() => {
    hydrate();
  }, []);

  const handleToggleProgressBar = () => {
    updateSetting('showProgressBar', !settings.showProgressBar);
  };

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
        <Box flexDirection={"row"} width={"100%"} justifyContent={"space-between"} alignItems={"center"}>
          <TextView variant={"variant-2-bold"} color={"interactive-primary-text-idle"}>Show progress bar</TextView>
          <Toggle id={"1"} onChange={handleToggleProgressBar} checked={settings.showProgressBar} />
        </Box>
      </Box>
    </Box>
  );
}
