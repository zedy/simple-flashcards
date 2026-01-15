import { StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import Logo from "@/assets/icons/logo.svg";
import TextView from "@/components/text/Text";
import { SPLASH_FADE_IN_DURATION } from "@/constants/shared";
import { lightTheme } from "@/utils/theme/restyleTheme";

export default function SplashScreen() {
  return (
    <View style={[styles.container, { backgroundColor: lightTheme.colors["elevation-background-3"] }]}>
      <Animated.View entering={FadeIn.duration(SPLASH_FADE_IN_DURATION)}>
        <Logo
          width={128}
          height={128}
          color={lightTheme.colors["primary-color"]}
        />
      </Animated.View>
      <Animated.View entering={FadeIn.duration(SPLASH_FADE_IN_DURATION)}>
        <TextView
          variant="variant-5-bold"
          style={{ color: lightTheme.colors["primary-color"] }}
        >
          simple flashcards
        </TextView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
});
