import { ChevronLeft, ChevronRight, RotateCcw, Shuffle } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import type { Card } from "@/stores/useSetsStore";
import type { ThemeColor } from "@/utils/theme/restyleTheme";

import Box from "./Box";
import IconButton from "./buttons/IconButton";
import { CardActions } from "./CardActions";
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
  const rotation = useSharedValue(0);
  const translateX = useSharedValue(0);

  // Flip animation
  const animatedCardStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 1], [0, 180]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
    };
  });

  const animatedBackStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 1], [180, 360]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
    };
  });

  // Trigger animation when isFlipped changes
  React.useEffect(() => {
    rotation.value = withTiming(isFlipped ? 1 : 0, {
      duration: 300,
    });
  }, [isFlipped]);

  // Swipe gesture for navigation
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (event.translationX < -100 && !isLastCard) {
        // Swipe left - next card
        translateX.value = withTiming(0, { duration: 200 });
        onNext();
      } else if (event.translationX > 100 && !isFirstCard) {
        // Swipe right - previous card
        translateX.value = withTiming(0, { duration: 200 });
        onPrevious();
      } else {
        // Reset
        translateX.value = withSpring(0);
      }
    });

  const swipeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Box
      flex={1}
      padding="5"
      justifyContent="space-between"
    >
      <Box
        width="100%"
        gap="2"
      >
        <Box
          height={8}
          backgroundColor="elevation-background-dark-1"
          borderRadius="m"
          overflow="hidden"
        >
          <Box
            height="100%"
            backgroundColor={progressColor}
            width={`${progress}%`}
          />
        </Box>
        <TextView
          variant="variant-2"
          color="interactive-text-dark-1"
          textAlign="center"
        >
          {currentIndex + 1} / {totalCards}
        </TextView>
      </Box>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.cardContainer, swipeStyle]}>
          <Pressable
            onPress={onFlip}
            style={styles.cardPressable}
          >
            <Animated.View style={[styles.card, styles.cardFront, animatedCardStyle]}>
              <CardActions card={card} onCardDeleted={onCardDeleted} returnTo={returnTo} text="front" />
              <TextView
                variant="variant-4"
                color="interactive-text-dark-1"
                textAlign="center"
              >
                {card.topText}
              </TextView>
              <TextView
                variant="variant-1"
                color="interactive-primary-text-pressed"
                textAlign="center"
                marginTop="4"
              >
                Tap to flip
              </TextView>
            </Animated.View>

            <Animated.View style={[styles.card, styles.cardBack, animatedBackStyle]}>
              <CardActions card={card} onCardDeleted={onCardDeleted} returnTo={returnTo} text="back" />
              <TextView
                variant="variant-4"
                color="interactive-text-dark-1"
                textAlign="center"
              >
                {card.bottomText}
              </TextView>
            </Animated.View>
          </Pressable>
            <Box flexDirection={"row"} alignSelf={"flex-start"} paddingTop={"2"} height={24}>
              <TextView
                variant="variant-2-medium"
                color="interactive-text-dark-1"
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
              iconColor="interactive-text-dark-1"
              iconSize={24}
            />
            <IconButton
              onPress={onRestart}
              variant="transparent"
              size="m"
              icon={<RotateCcw size={24} />}
              iconColor="interactive-text-dark-1"
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
    backgroundColor: "#373737",
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
  editIcon: {
    position: "absolute",
    top: 20,
    right: 20,
  },
});
