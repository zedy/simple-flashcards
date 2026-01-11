import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import GaggleLogoIcon from "@/assets/icons/GaggleLogoIcon";

const PROGRESS_BAR_WIDTH = 120;

export default function LoadingScreen() {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, {
      duration: 3000,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, []);

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <GaggleLogoIcon width={244} height={59} />

        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <Animated.View style={[styles.progressBar, progressStyle]} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    gap: 32,
  },
  progressContainer: {
    width: PROGRESS_BAR_WIDTH,
    alignItems: "center",
  },
  progressBackground: {
    width: "100%",
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#23294D",
    borderRadius: 2,
  },
});
