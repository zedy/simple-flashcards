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
import TextButton from "../buttons/TextButton";
import ListItem from "../input/ListItem";
import PressableUI from "../Pressable";

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
          top={-18}
          zIndex={1}
        >
          <PressableUI
            onPress={onClose}
            padding="4"
            paddingRight="0"
          >
            <X
              width={24}
              height={24}
              color={"#DBDBDB"}
            />
          </PressableUI>
        </Box>
      )}
      <Box alignSelf={"center"} width={110} height={4} backgroundColor={"interactive-border-1"} borderRadius={"full"} flexDirection={"row"} justifyContent={"center"}/>
      <Box
        paddingTop="0"
        backgroundColor="elevation-background-dark-3"
      >
        {children}
      </Box>
      {hasActions && (
        <Box
          backgroundColor="elevation-background-dark-3"
          p="4"
        >
          <ListItem
            label=""
            variant="action"
            backgroundColor={"transparent"}
            borderColor={"interactive-border-1"}
            borderBottomColor={"interactive-border-1"}
            borderWidth={1}
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
        backgroundColor: theme.colors["elevation-background-dark-3"],
        borderTopLeftRadius: theme.borderRadii["4xl"],
        borderTopRightRadius: theme.borderRadii["4xl"],
        borderTopColor: theme.colors['interactive-border-1'],
        borderTopWidth: 2,
        height: 0,
      }}
      backgroundStyle={{
        backgroundColor: theme.colors["elevation-background-dark-3"],
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
              backgroundColor: theme.colors["elevation-background-dark-3"],
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
