import { useRouter } from "expo-router";
import { PencilIcon, PlayIcon, Trash2Icon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";

import { type FlashcardSet, useSetsStore } from "@/stores/useSetsStore";

import Box from "./Box";
import IconButton from "./buttons/IconButton";
import { DeleteSetConfirmModal } from "./modals/content/DeleteSetConfirmModal";
import Modal from "./modals/Modal";
import { SetCard } from "./SetCard";

interface SwipeableSetCardProps {
  data: FlashcardSet;
  count: number;
  isOpen: boolean;
  onSwipeChange: (cardId: string | null) => void;
}

const SWIPE_THRESHOLD = -200;

export const SwipeableSetCard = ({ data, count, isOpen, onSwipeChange }: SwipeableSetCardProps) => {
  const router = useRouter();
  const translateX = useSharedValue(0);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const { removeSet } = useSetsStore();

  // Close the card when isOpen becomes false
  useEffect(() => {
    if (!isOpen) {
      translateX.value = withTiming(0, {
        duration: 200,
      });
    }
  }, [isOpen]);

  const resetSwipe = () => {
    translateX.value = withTiming(0, {
      duration: 200,
    });
    onSwipeChange(null);
  };

  const handleDelete = () => {
    setIsDeleteConfirmModalOpen(true);
    resetSwipe();
  };

  const handleEdit = () => {
    resetSwipe();
    // Delay navigation slightly to allow animation to start
    setTimeout(() => {
      router.push(`/(tabs)/edit-set?id=${data.id}`);
    }, 100);
  };

  const handlePlay = () => {
    if (count > 0) {
      resetSwipe();
      // Delay navigation slightly to allow animation to start
      setTimeout(() => {
        router.push(`/(tabs)/play?setId=${data.id}`);
      }, 100);
    }
  };

  const handleDeleteConfirm = () => {
    removeSet(data.id);
    setIsDeleteConfirmModalOpen(false);
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((event) => {
      // Only allow swiping left
      if (event.translationX < 0) {
        translateX.value = Math.max(event.translationX, SWIPE_THRESHOLD);
      } else if (translateX.value < 0) {
        translateX.value = event.translationX + translateX.value;
      }
    })
    .onEnd((event) => {
      if (translateX.value < SWIPE_THRESHOLD / 2) {
        // Swipe far enough, show actions
        translateX.value = withTiming(SWIPE_THRESHOLD, {
          duration: 200,
        });
        onSwipeChange(data.id);
      } else {
        // Not far enough, reset
        translateX.value = withTiming(0, {
          duration: 200,
        });
        onSwipeChange(null);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const actionsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: translateX.value < -10 ? 1 : 0,
  }));

  return (
    <Box width="100%">
      <Box
        position="absolute"
        right={0}
        top={0}
        bottom={0}
        flexDirection="row"
        alignItems="center"
        justifyContent="flex-end"
        paddingRight="2"
        gap="2"
      >
        <Animated.View style={[actionsAnimatedStyle]}>
          <Box flexDirection="row" gap="2">
            <IconButton
              onPress={handlePlay}
              variant="transparent"
              size="m"
              icon={<PlayIcon size={24} />}
              iconColor={count > 0 ? "interactive-card-green" : "interactive-primary-text-pressed"}
              iconSize={24}
            />
            <IconButton
              onPress={handleEdit}
              variant="transparent"
              size="m"
              icon={<PencilIcon size={24} />}
              iconColor="interactive-orange"
              iconSize={24}
            />
            <IconButton
              onPress={handleDelete}
              variant="transparent"
              size="m"
              icon={<Trash2Icon size={24} />}
              iconColor="informational-error"
              iconSize={24}
            />
          </Box>
        </Animated.View>
      </Box>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[animatedStyle, { width: "100%" }]}>
          <SetCard data={data} count={count} />
        </Animated.View>
      </GestureDetector>

      <Modal
        visible={isDeleteConfirmModalOpen}
        title="Delete Set?"
        onClose={() => setIsDeleteConfirmModalOpen(false)}
      >
        <DeleteSetConfirmModal callback={handleDeleteConfirm} name={data.name} />
      </Modal>
    </Box>
  );
};
