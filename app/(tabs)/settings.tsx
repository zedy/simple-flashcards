import { useTheme } from "@shopify/restyle";
import { MoonIcon, SunIcon } from "lucide-react-native";
import { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import Box from "@/components/Box";
import IconButton from "@/components/buttons/IconButton";
import Toggle from "@/components/buttons/Toggle";
import Header from "@/components/Header";
import TextView from "@/components/text/Text";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { ThemeEnum } from "@/types";
import type { Theme } from "@/utils/theme/restyleTheme";

const AnimatedBox = Animated.createAnimatedComponent(Box);

export default function SettingsScreen() {
  const theme = useTheme<Theme>();
  const { settings, updateSetting, hydrate } = useSettingsStore();

  const rotation = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const backgroundOpacity = useSharedValue(1);

  useEffect(() => {
    hydrate();
  }, []);

  const handleToggleProgressBar = () => {
    updateSetting("showProgressBar", !settings.showProgressBar);
  };

  const handleToggleTheme = () => {
    const isDark = settings.theme === ThemeEnum.dark;

    // Animate out (sun sets / moon sets)
    rotation.value = withTiming(isDark ? -90 : 90, { duration: 200 });
    opacity.value = withTiming(0, { duration: 250 });
    scale.value = withTiming(0.5, { duration: 250 });

    // Background fade
    backgroundOpacity.value = withTiming(0.7, { duration: 200 });

    // Change theme after animation out completes
    setTimeout(() => {
      updateSetting("theme", isDark ? ThemeEnum.light : ThemeEnum.dark);

      // Animate in (moon rises / sun rises)
      rotation.value = isDark ? 90 : -90;
      rotation.value = withTiming(0, { duration: 150 });
      opacity.value = withTiming(1, { duration: 150 });
      scale.value = withSpring(1, {
        damping: 25,
        stiffness: 300,
      });
      backgroundOpacity.value = withTiming(1, { duration: 200 });
    }, 250);
  };

  const isDark = settings.theme === ThemeEnum.dark;

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
  }));

  return (
    <AnimatedBox
      flex={1}
      backgroundColor="elevation-background-3"
      style={animatedBackgroundStyle}
    >
      <Header
        title="Settings"
        showLogo
      />
      <Box
        flex={1}
        padding="5"
        gap={"4"}
      >
        <Box
          flexDirection={"row"}
          width={"100%"}
          justifyContent={"space-between"}
          alignItems={"center"}
          paddingBottom={"2"}
        >
          <TextView
            variant={"variant-3-bold"}
            color={"interactive-primary-text-idle"}
          >
            Theme
          </TextView>
          <IconButton
            variant="transparent"
            iconColor="interactive-primary-text-idle"
            onPress={handleToggleTheme}
            icon={
              <Animated.View style={animatedIconStyle}>
                {isDark ? (
                  <MoonIcon size={32} color={theme.colors["interactive-primary-text-idle"]} />
                ) : (
                  <SunIcon color={theme.colors["interactive-orange"]} size={32} />
                )}
              </Animated.View>
            }
          />
        </Box>
        <Box
          flexDirection={"row"}
          width={"100%"}
          justifyContent={"space-between"}
          alignItems={"center"}
          paddingRight={"2"}
        >
          <TextView
            variant={"variant-3-bold"}
            color={"interactive-primary-text-idle"}
          >
            Show progress bar
          </TextView>
          <Toggle
            id={"1"}
            onChange={handleToggleProgressBar}
            checked={settings.showProgressBar}
          />
        </Box>
      </Box>
    </AnimatedBox>
  );
}
