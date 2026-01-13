import Box from "@/components/Box";
import Header from "@/components/Header";
import TextView from "@/components/text/Text";

export default function SettingsScreen() {
  return (
    <Box
      flex={1}
      backgroundColor="elevation-background-dark-2"
    >
      <Header title="Settings" />
      <Box
        flex={1}
        padding="5"
      >
        <TextView color="interactive-text-dark-1">App settings will go here.</TextView>
      </Box>
    </Box>
  );
}
