import React from "react";
import { ScrollView, StyleSheet } from "react-native";

import Box from "./Box";
import TextView from "./text/Text";

interface DoubleCardsProps {
  text: string;
  isFront?: boolean;
}

export const SingleCard = ({
  text,
  isFront
}: DoubleCardsProps) => {
  return (
    <>
      <Box
        width={"100%"}
        flexDirection={"row"}
        justifyContent={"center"}
        backgroundColor={"elevation-background-1"}
        style={styles.cardText}
        zIndex={1}
      >
        <TextView
          variant="variant-1"
          color="interactive-primary-text-pressed"
          textAlign="center"
          marginTop="4"
        >
          {isFront ? "front" : "back"}
        </TextView>
      </Box>
      <ScrollView
        style={styles.cardScrollView}
        contentContainerStyle={styles.cardScrollContent}
        showsVerticalScrollIndicator={true}
      >
        <TextView
          variant="variant-4"
          color="interactive-text-1"
          textAlign="center"
          width={"100%"}
        >
          {text}
        </TextView>
        {isFront && <TextView
          variant="variant-1"
          color="interactive-primary-text-pressed"
          textAlign="center"
          marginTop="4"
        >
          Tap to flip
        </TextView>}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
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
  cardText: {
    position: "absolute",
    top: 10,
  },
});
