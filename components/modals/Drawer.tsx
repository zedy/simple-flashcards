import {
  BottomSheetModal,
  type BottomSheetModalProps,
  BottomSheetScrollView,
  useBottomSheet,
} from "@gorhom/bottom-sheet";
import { useTheme } from "@shopify/restyle";
import { X } from "lucide-react-native";
import type React from "react";
import { useEffect, useMemo, useRef } from "react";
import { Dimensions, Pressable, StyleSheet } from "react-native";
import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { Theme } from "@/utils/theme/restyleTheme";

import Box from "../Box";
import IconButton from "../buttons/IconButton";
import TextButton from "../buttons/TextButton";
import ListItem from "../input/ListItem";

export interface DrawerProps extends Omit<BottomSheetModalProps, "children"> {
  children?: React.ReactNode;
  visible: boolean;
  onClose: () => void;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  onPrimaryActionPress?: () => void;
  onSecondaryActionPress?: () => void;
  scrollable?: boolean;
  showCloseButton?: boolean;
}

const CustomBackdrop = ({ onPress }: { onPress?: () => void }) => {
  const { animatedIndex } = useBottomSheet();
  const containerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(animatedIndex.value, [-1, 0], [0, 0.5]);
    return {
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: "#000",
        },
        containerAnimatedStyle,
      ]}
    >
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={onPress}
      />
    </Animated.View>
  );
};

const Drawer = ({
  visible,
  onClose,
  children,
  primaryActionLabel,
  secondaryActionLabel,
  onPrimaryActionPress,
  onSecondaryActionPress,
  stackBehavior = "push",
  scrollable = true,
  showCloseButton = true,
  ...rest
}: DrawerProps) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme<Theme>();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const screenHeight = Dimensions.get("window").height;
  const maxHeight = useMemo(() => screenHeight * 0.85, [screenHeight]);

  useEffect(() => {
    if (visible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [visible]);

  const handleDismiss = () => {
    onClose();
  };

  const hasActions = !!(primaryActionLabel || secondaryActionLabel);

  const content = (
    <>
      {showCloseButton && (
        <Box
          position={"absolute"}
          right={8}
          top={-8}
          zIndex={1}
        >
          <IconButton
            size="m"
            icon={
              <X
                width={24}
                height={24}
              />
            }
            onPress={onClose}
            variant="transparent"
          />
        </Box>
      )}
      <Box
        paddingTop="0"
        backgroundColor="interactive-primary-on"
      >
        {children}
      </Box>
      {hasActions && (
        <Box
          backgroundColor="interactive-primary-on"
          p="4"
        >
          <ListItem
            label=""
            variant="action"
            leftElement={
              <>
                {!!primaryActionLabel && (
                  <TextButton
                    label={primaryActionLabel}
                    variant="primary"
                    onPress={() => onPrimaryActionPress?.()}
                  />
                )}
              </>
            }
            rightElement={
              <>
                {!!secondaryActionLabel && (
                  <TextButton
                    label={secondaryActionLabel}
                    variant="secondary"
                    onPress={() => onSecondaryActionPress?.()}
                  />
                )}
              </>
            }
          />
        </Box>
      )}
    </>
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      enableDynamicSizing
      maxDynamicContentSize={maxHeight}
      backdropComponent={(props) => (
        <CustomBackdrop
          {...props}
          onPress={handleDismiss}
        />
      )}
      onDismiss={handleDismiss}
      stackBehavior={stackBehavior}
      enablePanDownToClose={true}
      enableContentPanningGesture={scrollable}
      handleIndicatorStyle={{
        backgroundColor: "transparent",
      }}
      handleStyle={{
        backgroundColor: theme.colors["interactive-primary-on"],
        borderTopLeftRadius: theme.borderRadii["4xl"],
        borderTopRightRadius: theme.borderRadii["4xl"],
        height: 0,
        // paddingTop: 0,
        // paddingBottom: 0,
      }}
      backgroundStyle={{
        backgroundColor: theme.colors["interactive-primary-on"],
        borderTopLeftRadius: theme.borderRadii["4xl"],
        borderTopRightRadius: theme.borderRadii["4xl"],
      }}
      onChange={(index) => {
        if (index === -1) {
          handleDismiss();
        }
      }}
      {...rest}
    >
      <Box
        justifyContent="space-between"
        flex={1}
      >
        {scrollable ? (
          <BottomSheetScrollView
            style={{
              backgroundColor: theme.colors["interactive-primary-on"],
            }}
            contentContainerStyle={{
              paddingBottom: Math.max(insets.bottom, 4),
            }}
            nestedScrollEnabled={true}
          >
            {content}
          </BottomSheetScrollView>
        ) : (
          <>{content}</>
        )}
      </Box>
    </BottomSheetModal>
  );
};

export default Drawer;
