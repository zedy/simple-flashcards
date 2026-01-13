import { X } from "lucide-react-native";
import React from "react";
import { Modal as RNModal, type ModalProps as RNModalProps, StyleSheet, TouchableWithoutFeedback } from "react-native";

import Box from "../Box";
import Pressable from "../Pressable";
import TextView from '../text/Text';

export interface ModalProps extends RNModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  hideHeader?: boolean;
}

const Modal = ({ visible, onClose, children, title, hideHeader, ...rest }: ModalProps) => {
  return (
    <RNModal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      {...rest}
    >
      <Box
        height="100%"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <Box
            position="absolute"
            top={0}
            left={0}
            height="100%"
            width="100%"
            style={styles.container}
          />
        </TouchableWithoutFeedback>
        <Box
          backgroundColor="elevation-background-dark-2"
          margin="12"
          borderRadius="2xl"
          borderColor="interactive-border-1"
          borderWidth={1}
          flex={1}
        >
          {!hideHeader && (<Box padding={"4"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"} paddingBottom={"0"}>
            <TextView color={"interactive-text-dark-1"} variant={"variant-3-bold"}>{title}</TextView>
            <Box alignItems="flex-end">
              <Pressable
                onPress={onClose}
                padding="4"
                paddingRight="0"
              >
                <X
                  width={24}
                  height={24}
                  color={"#DBDBDB"}
                />
              </Pressable>
            </Box>
          </Box>)}
          {children}
        </Box>
      </Box>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0,0,0,0.4)",
  },
});

export default Modal;
