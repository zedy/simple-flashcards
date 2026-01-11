import { useTheme } from "@shopify/restyle";
import React, { useRef, useState } from "react";
import { PanResponder } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { clamp, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import type { Theme } from "@/utils/theme/restyleTheme";

import Box, { AnimatedBox } from "../Box";
import Text from "../text/Text";

const KNOB_WIDTH = 28;
const TOOLTIP_OFFSET = 12;

export interface SliderProps {
  min: number;
  max: number;
  title: string;
  onValueChange?: (value: number) => void;
  onRangeChange?: (range: { min: number; max: number }) => void;
  unit?: string;
  disabled?: boolean;
  rangeMode?: boolean;
  initialValue?: number;
  initialRange?: { min: number; max: number };
}

const Slider = ({
  title,
  min,
  max,
  unit,
  onValueChange,
  onRangeChange,
  disabled,
  rangeMode = false,
  initialValue,
  initialRange,
}: SliderProps) => {
  const theme = useTheme<Theme>();
  const isPressedMin = useSharedValue(false);
  const isPressedMax = useSharedValue(false);
  const thumbMinX = useSharedValue(0);
  const thumbMaxX = useSharedValue(0);
  const prevThumbMinX = useSharedValue(0);
  const prevThumbMaxX = useSharedValue(0);
  const sliderWidth = useSharedValue(0);

  const [selectedMinValue, setSelectedMinValue] = useState(min);
  const [selectedMaxValue, setSelectedMaxValue] = useState(max);
  const isDraggingMin = useRef(false);
  const isDraggingMax = useRef(false);
  const lastSetMinValue = useRef(min);
  const lastSetMaxValue = useRef(max);

  // Update display state only (for tooltip) - no callbacks
  const updateDisplayState = (minVal: number, maxVal: number) => {
    if (lastSetMinValue.current !== minVal) {
      lastSetMinValue.current = minVal;
      setSelectedMinValue(minVal);
    }
    if (lastSetMaxValue.current !== maxVal) {
      lastSetMaxValue.current = maxVal;
      setSelectedMaxValue(maxVal);
    }
  };

  const updateDisplayStateSingle = (value: number) => {
    if (lastSetMaxValue.current !== value) {
      lastSetMaxValue.current = value;
      setSelectedMaxValue(value);
    }
  };

  // Final update with callbacks - called on gesture end
  const handleChange = (value: number) => {
    if (lastSetMaxValue.current !== value) {
      lastSetMaxValue.current = value;
      setSelectedMaxValue(value);
    }
    onValueChange?.(value);
  };

  const handleRangeChange = (minVal: number, maxVal: number) => {
    if (lastSetMinValue.current !== minVal) {
      lastSetMinValue.current = minVal;
      setSelectedMinValue(minVal);
    }
    if (lastSetMaxValue.current !== maxVal) {
      lastSetMaxValue.current = maxVal;
      setSelectedMaxValue(maxVal);
    }
    onRangeChange?.({ min: minVal, max: maxVal });
  };

  const initializeKnobs = (width: number) => {
    if (rangeMode) {
      const rangeMin = initialRange?.min ?? min;
      const rangeMax = initialRange?.max ?? max;

      // Calculate positions based on initial values
      const minPosition = ((rangeMin - min) / (max - min)) * (width - KNOB_WIDTH);
      const maxPosition = ((rangeMax - min) / (max - min)) * (width - KNOB_WIDTH);

      thumbMinX.value = minPosition;
      thumbMaxX.value = maxPosition;
      lastSetMinValue.current = rangeMin;
      lastSetMaxValue.current = rangeMax;
      setSelectedMinValue(rangeMin);
      setSelectedMaxValue(rangeMax);
    } else {
      const value = initialValue ?? min;
      const position = ((value - min) / (max - min)) * (width - KNOB_WIDTH);

      thumbMaxX.value = position;
      lastSetMaxValue.current = value;
      setSelectedMaxValue(value);
    }
  };

  const panResponderMin = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled && rangeMode,
      onMoveShouldSetPanResponder: () => !disabled && rangeMode,
      onPanResponderGrant: () => {
        isDraggingMin.current = true;
        isPressedMin.value = true;
        prevThumbMinX.value = thumbMinX.value;
      },
      onPanResponderMove: (_, gestureState) => {
        if (disabled) return;
        const newX = clamp(gestureState.dx + prevThumbMinX.value, 0, thumbMaxX.value - KNOB_WIDTH);
        thumbMinX.value = newX;
        const normalizedMin = Math.round((newX / (sliderWidth.value - KNOB_WIDTH)) * (max - min) + min);
        const normalizedMax = Math.round((thumbMaxX.value / (sliderWidth.value - KNOB_WIDTH)) * (max - min) + min);
        updateDisplayState(normalizedMin, normalizedMax);
      },
      onPanResponderRelease: () => {
        isDraggingMin.current = false;
        isPressedMin.value = false;
        const normalizedMin = Math.round((thumbMinX.value / (sliderWidth.value - KNOB_WIDTH)) * (max - min) + min);
        const normalizedMax = Math.round((thumbMaxX.value / (sliderWidth.value - KNOB_WIDTH)) * (max - min) + min);
        handleRangeChange(normalizedMin, normalizedMax);
      },
    })
  ).current;

  const panResponderMax = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: () => {
        isDraggingMax.current = true;
        isPressedMax.value = true;
        prevThumbMaxX.value = thumbMaxX.value;
      },
      onPanResponderMove: (_, gestureState) => {
        if (disabled) return;
        const minBound = rangeMode ? thumbMinX.value + KNOB_WIDTH : 0;
        const newX = clamp(gestureState.dx + prevThumbMaxX.value, minBound, sliderWidth.value - KNOB_WIDTH);
        thumbMaxX.value = newX;

        if (rangeMode) {
          const normalizedMin = Math.round((thumbMinX.value / (sliderWidth.value - KNOB_WIDTH)) * (max - min) + min);
          const normalizedMax = Math.round((newX / (sliderWidth.value - KNOB_WIDTH)) * (max - min) + min);
          updateDisplayState(normalizedMin, normalizedMax);
        } else {
          const normalizedValue = Math.round((newX / (sliderWidth.value - KNOB_WIDTH)) * (max - min) + min);
          updateDisplayStateSingle(normalizedValue);
        }
      },
      onPanResponderRelease: () => {
        isDraggingMax.current = false;
        isPressedMax.value = false;
        if (rangeMode) {
          const normalizedMin = Math.round((thumbMinX.value / (sliderWidth.value - KNOB_WIDTH)) * (max - min) + min);
          const normalizedMax = Math.round((thumbMaxX.value / (sliderWidth.value - KNOB_WIDTH)) * (max - min) + min);
          handleRangeChange(normalizedMin, normalizedMax);
        } else {
          const normalizedValue = Math.round((thumbMaxX.value / (sliderWidth.value - KNOB_WIDTH)) * (max - min) + min);
          handleChange(normalizedValue);
        }
      },
    })
  ).current;

  const gestureMin = Gesture.Pan()
    .manualActivation(true)
    .enabled(rangeMode)
    .onBegin(() => {
      isPressedMin.value = true;
      prevThumbMinX.value = thumbMinX.value;
    })
    .onTouchesDown((e, state) => {
      state.activate();
    })
    .onUpdate((e) => {
      if (disabled) return;
      thumbMinX.value = clamp(e.translationX + prevThumbMinX.value, 0, thumbMaxX.value - KNOB_WIDTH);
      const normalizedMin = Math.round((thumbMinX.value / (sliderWidth.value - KNOB_WIDTH)) * (max - min) + min);
      const normalizedMax = Math.round((thumbMaxX.value / (sliderWidth.value - KNOB_WIDTH)) * (max - min) + min);
      runOnJS(updateDisplayState)(normalizedMin, normalizedMax);
    })
    .onEnd(() => {
      isPressedMin.value = false;
      const normalizedMin = Math.round((thumbMinX.value / (sliderWidth.value - KNOB_WIDTH)) * (max - min) + min);
      const normalizedMax = Math.round((thumbMaxX.value / (sliderWidth.value - KNOB_WIDTH)) * (max - min) + min);
      runOnJS(handleRangeChange)(normalizedMin, normalizedMax);
    });

  const gestureMax = Gesture.Pan()
    .manualActivation(true)
    .onBegin(() => {
      isPressedMax.value = true;
      prevThumbMaxX.value = thumbMaxX.value;
    })
    .onTouchesDown((e, state) => {
      state.activate();
    })
    .onUpdate((e) => {
      if (disabled) return;
      const minBound = rangeMode ? thumbMinX.value + KNOB_WIDTH : 0;
      thumbMaxX.value = clamp(e.translationX + prevThumbMaxX.value, minBound, sliderWidth.value - KNOB_WIDTH);

      if (rangeMode) {
        const normalizedMin = Math.round((thumbMinX.value / (sliderWidth.value - KNOB_WIDTH)) * (max - min) + min);
        const normalizedMax = Math.round((thumbMaxX.value / (sliderWidth.value - KNOB_WIDTH)) * (max - min) + min);
        runOnJS(updateDisplayState)(normalizedMin, normalizedMax);
      } else {
        const normalizedValue = Math.round((thumbMaxX.value / (sliderWidth.value - KNOB_WIDTH)) * (max - min) + min);
        runOnJS(updateDisplayStateSingle)(normalizedValue);
      }
    })
    .onEnd(() => {
      isPressedMax.value = false;
      if (rangeMode) {
        const normalizedMin = Math.round((thumbMinX.value / (sliderWidth.value - KNOB_WIDTH)) * (max - min) + min);
        const normalizedMax = Math.round((thumbMaxX.value / (sliderWidth.value - KNOB_WIDTH)) * (max - min) + min);
        runOnJS(handleRangeChange)(normalizedMin, normalizedMax);
      } else {
        const normalizedValue = Math.round((thumbMaxX.value / (sliderWidth.value - KNOB_WIDTH)) * (max - min) + min);
        runOnJS(handleChange)(normalizedValue);
      }
    });

  const knobMinStyle = useAnimatedStyle(() => {
    const getKnobBackgroundColor = (isPressed: boolean) => {
      if (disabled) {
        return theme.colors["interactive-primary-disabled"];
      }
      return isPressed ? theme.colors["interactive-icon-pressed"] : theme.colors["interactive-icon-idle-2"];
    };

    return {
      backgroundColor: getKnobBackgroundColor(isPressedMin.value),
      transform: [{ translateX: thumbMinX.value }],
    };
  });

  const knobMaxStyle = useAnimatedStyle(() => {
    const getKnobBackgroundColor = (isPressed: boolean) => {
      if (disabled) {
        return theme.colors["interactive-primary-disabled"];
      }
      return isPressed ? theme.colors["interactive-icon-pressed"] : theme.colors["interactive-icon-idle-2"];
    };

    return {
      backgroundColor: getKnobBackgroundColor(isPressedMax.value),
      transform: [{ translateX: thumbMaxX.value }],
    };
  });

  const trackStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(sliderWidth.value, {
        duration: 100,
      }),
      marginTop: -2,
    };
  });

  const trackOverlayStyle = useAnimatedStyle(() => {
    if (rangeMode) {
      return {
        width: withTiming(thumbMaxX.value - thumbMinX.value + KNOB_WIDTH / 2, {
          duration: 5,
        }),
        marginTop: -2,
        marginLeft: thumbMinX.value + KNOB_WIDTH / 2,
      };
    }
    return {
      width: withTiming(thumbMaxX.value + KNOB_WIDTH / 2, {
        duration: 5,
      }),
      marginTop: -2,
    };
  });

  const tooltipMinStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isPressedMin.value ? 1 : 0),
    };
  });

  const tooltipMaxStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isPressedMax.value ? 1 : 0),
    };
  });

  const tooltipMinPositionStyle = useAnimatedStyle(() => {
    return {
      left: thumbMinX.value - TOOLTIP_OFFSET,
    };
  });

  const tooltipMinArrowStyle = useAnimatedStyle(() => {
    return {
      left: thumbMinX.value + KNOB_WIDTH / 4,
    };
  });

  const tooltipMaxPositionStyle = useAnimatedStyle(() => {
    return {
      left: thumbMaxX.value - TOOLTIP_OFFSET,
    };
  });

  const tooltipMaxArrowStyle = useAnimatedStyle(() => {
    return {
      left: thumbMaxX.value + KNOB_WIDTH / 4,
    };
  });

  return (
    <Box alignItems="flex-start" flexDirection="column" width={"100%"} gap="1">
      <Text variant="variant-2" color="text-default-primary">
        {title}
      </Text>
      <Box flexDirection="row" alignItems="center" gap="3" width={"100%"}>
        <Text variant="variant-2" color="text-default-tertiary">
          {min}
          {unit}
        </Text>
        <Box
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            sliderWidth.value = width;
            initializeKnobs(width);
          }}
          flex={1}
        >
          <AnimatedBox backgroundColor="elevation-outline-1" borderRadius="xs" height={4} style={trackStyle} />
          <AnimatedBox
            backgroundColor="interactive-icon-pressed"
            borderRadius="xs"
            height={4}
            style={trackOverlayStyle}
            position="absolute"
          />
          <Box position="relative">
            {rangeMode && (
              <>
                <AnimatedBox style={tooltipMinStyle}>
                  <AnimatedBox
                    position="absolute"
                    bottom={KNOB_WIDTH}
                    paddingVertical="2"
                    width={KNOB_WIDTH + TOOLTIP_OFFSET * 2}
                    borderRadius="sm"
                    backgroundColor="interactive-icon-pressed"
                    style={tooltipMinPositionStyle}
                    alignItems="center"
                  >
                    <Text variant="variant-2" color="text-inverted-tertiary">
                      {`${selectedMinValue}${unit}`}
                    </Text>
                  </AnimatedBox>
                  <AnimatedBox
                    backgroundColor="interactive-icon-pressed"
                    height={13}
                    width={13}
                    position="absolute"
                    bottom={20}
                    style={[
                      tooltipMinArrowStyle,
                      {
                        transform: [{ rotate: "45deg" }],
                      },
                    ]}
                  />
                </AnimatedBox>
                <GestureDetector gesture={gestureMin}>
                  <AnimatedBox
                    position="absolute"
                    height={KNOB_WIDTH}
                    width={KNOB_WIDTH}
                    borderRadius="full"
                    backgroundColor="interactive-primary-on"
                    borderWidth={4}
                    borderColor="interactive-icon-on"
                    style={[
                      {
                        marginTop: -14,
                      },
                      knobMinStyle,
                    ]}
                  />
                </GestureDetector>
              </>
            )}
            <AnimatedBox style={tooltipMaxStyle}>
              <AnimatedBox
                position="absolute"
                bottom={KNOB_WIDTH}
                paddingVertical="2"
                width={KNOB_WIDTH + TOOLTIP_OFFSET * 2}
                borderRadius="sm"
                backgroundColor="interactive-icon-pressed"
                style={tooltipMaxPositionStyle}
                alignItems="center"
              >
                <Text variant="variant-2" color="text-inverted-tertiary">
                  {`${selectedMaxValue}${unit}`}
                </Text>
              </AnimatedBox>
              <AnimatedBox
                backgroundColor="interactive-icon-pressed"
                height={13}
                width={13}
                position="absolute"
                bottom={20}
                style={[
                  tooltipMaxArrowStyle,
                  {
                    transform: [{ rotate: "45deg" }],
                  },
                ]}
              />
            </AnimatedBox>
            <GestureDetector gesture={gestureMax}>
              <AnimatedBox
                position="absolute"
                height={KNOB_WIDTH}
                width={KNOB_WIDTH}
                borderRadius="full"
                backgroundColor="interactive-primary-on"
                borderWidth={4}
                borderColor="interactive-icon-on"
                style={[
                  {
                    marginTop: -14,
                  },
                  knobMaxStyle,
                ]}
              />
            </GestureDetector>
          </Box>
        </Box>
        <Text variant="variant-2" color="text-default-tertiary">
          {max}
          {unit}
        </Text>
      </Box>
    </Box>
  );
};

export default Slider;
