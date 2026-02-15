import { useTheme } from "@shopify/restyle";
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { CARD_FLIP_DURATION, CARD_SWIPE_RESET_DURATION, PROGRESS_BAR_ANIMATION_DURATION } from "@/constants/shared";
import type { Card } from "@/stores/useSetsStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import type { Theme, ThemeColor } from "@/utils/theme/restyleTheme";

import Box from "./Box";
import IconButton from "./buttons/IconButton";
import { CardActions } from "./CardActions";
import { SingleCard } from "./SingleCard";
import TextView from "./text/Text";

interface DoubleCardsProps {
  card: Card;
  isFlipped: boolean;
  currentIndex: number;
  totalCards: number;
  progress: number;
  isFirstCard: boolean;
  isLastCard: boolean;
  onFlip: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onShuffle: () => void;
  onRestart: () => void;
  onCardDeleted?: () => void;
  returnTo?: "play" | "setcard";
  progressColor?: ThemeColor;
}

export const DoubleCards = ({
  card,
  isFlipped,
  currentIndex,
  totalCards,
  progress,
  isFirstCard,
  isLastCard,
  onFlip,
  onNext,
  onPrevious,
  onShuffle,
  onRestart,
  onCardDeleted,
  returnTo = "setcard",
  progressColor = "interactive-primary-bg-idle",
}: DoubleCardsProps) => {
  const theme = useTheme<Theme>();
  const { settings } = useSettingsStore();
  const rotation = useSharedValue(0);
  const translateX = useSharedValue(0);
  const progressWidth = useSharedValue(progress);

  // Flip animation
  const animatedCardStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 1], [0, 180]);
    const opacity = interpolate(rotation.value, [0, 0.5, 0.5, 1], [1, 1, 0, 0]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      opacity,
    };
  });

  const animatedBackStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 1], [180, 360]);
    const opacity = interpolate(rotation.value, [0, 0.5, 0.5, 1], [0, 0, 1, 1]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      opacity,
    };
  });

  // Trigger animation when isFlipped changes
  React.useEffect(() => {
    rotation.value = withTiming(isFlipped ? 1 : 0, {
      duration: CARD_FLIP_DURATION,
    });
  }, [isFlipped]);

  // Animate progress bar
  React.useEffect(() => {
    progressWidth.value = withTiming(progress, {
      duration: PROGRESS_BAR_ANIMATION_DURATION,
    });
  }, [progress]);

  // Swipe gesture for navigation
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (event.translationX < -100 && !isLastCard) {
        // Swipe left - next card
        translateX.value = withTiming(0, { duration: CARD_SWIPE_RESET_DURATION });
        runOnJS(onNext)();
      } else if (event.translationX > 100 && !isFirstCard) {
        // Swipe right - previous card
        translateX.value = withTiming(0, { duration: CARD_SWIPE_RESET_DURATION });
        runOnJS(onPrevious)();
      } else {
        // Reset
        translateX.value = withSpring(0);
      }
    });

  const swipeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const cardStyle = {
    ...styles.card,
    backgroundColor: theme.colors["elevation-background-1"],
    boxShadow: `${theme.colors["shadow-medium"]} 0px 4px 4px 0px`,
  };

  return (
    <Box
      flex={1}
      padding="5"
      justifyContent="space-between"
    >
      {settings.showProgressBar && (
        <Box
          width="100%"
          gap="2"
        >
          <Box
            height={8}
            backgroundColor="elevation-background-1"
            borderRadius="m"
            overflow="hidden"
            style={{ boxShadow: `${theme.colors["shadow-medium"]} 0px 4px 4px 0px` }}
          >
            <Animated.View
              style={[
                {
                  height: "100%",
                  backgroundColor: theme.colors[progressColor],
                },
                progressBarStyle,
              ]}
            />
          </Box>
          <TextView
            variant="variant-2"
            color="interactive-text-1"
            textAlign="center"
          >
            {currentIndex + 1} / {totalCards}
          </TextView>
        </Box>
      )}
      <CardActions
        card={card}
        onCardDeleted={onCardDeleted}
        returnTo={returnTo}
      />
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.cardContainer, swipeStyle]}>
          <Pressable
            onPress={onFlip}
            style={styles.cardPressable}
          >
            <Animated.View style={[cardStyle, styles.cardFront, animatedCardStyle]}>
              <SingleCard
                text={card.topText}
                isFront
              />
            </Animated.View>

            <Animated.View style={[cardStyle, styles.cardBack, animatedBackStyle]}>
              <SingleCard text={card.bottomText} />
            </Animated.View>
          </Pressable>
          <Box
            flexDirection={"row"}
            alignSelf={"flex-start"}
            paddingTop={"2"}
            height={24}
          >
            <TextView
              variant="variant-2-medium"
              color="interactive-primary-text-pressed"
              textAlign="center"
            >
              {card.tagLabel}
            </TextView>
          </Box>
        </Animated.View>
      </GestureDetector>
      <Box gap="4">
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <IconButton
            onPress={onPrevious}
            variant={"transparent"}
            size="l"
            icon={<ChevronLeft size={32} />}
            iconColor={isFirstCard ? "interactive-primary-text-disabled" : "interactive-primary-text-idle"}
            iconSize={32}
            disabled={isFirstCard}
          />

          <Box
            flexDirection="row"
            gap="3"
          >
            <IconButton
              onPress={onShuffle}
              variant="transparent"
              size="m"
              icon={<Shuffle size={24} />}
              iconColor="interactive-text-1"
              iconSize={24}
            />
            <IconButton
              onPress={onRestart}
              variant="transparent"
              size="m"
              icon={<RotateCcw size={24} />}
              iconColor="interactive-text-1"
              iconSize={24}
            />
          </Box>

          <IconButton
            onPress={onNext}
            variant={"transparent"}
            size="l"
            icon={<ChevronRight size={32} />}
            iconColor={isLastCard ? "interactive-primary-text-disabled" : "interactive-primary-text-idle"}
            iconSize={32}
            disabled={isLastCard}
          />
        </Box>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardPressable: {
    width: "100%",
    height: "100%",
    maxHeight: 500,
  },
  card: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backfaceVisibility: "hidden",
  },
  cardFront: {
    zIndex: 1,
  },
  cardBack: {
    zIndex: 0,
  },
  cardScrollView: {
    width: "100%",
    maxHeight: "100%",
  },
  cardScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  editIcon: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  cardText: {
    position: "absolute",
    top: 10,
  },
});
