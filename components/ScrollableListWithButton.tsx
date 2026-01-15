import type { ReactNode } from "react";
import { ScrollView, StyleSheet } from "react-native";

import Box from "@/components/Box";
import Button from "@/components/buttons/Button";

interface ScrollableListWithButtonProps {
  children: ReactNode;
  buttonLabel: string;
  onButtonPress: () => void;
}

export const ScrollableListWithButton = ({
  children,
  buttonLabel,
  onButtonPress,
}: ScrollableListWithButtonProps) => {
  return (
    <Box flex={1} width={"100%"}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <Box gap={"4"} paddingBottom={"4"}>
          {children}
        </Box>
      </ScrollView>
      <Box width={"100%"} paddingTop={"5"}>
        <Button
          label={buttonLabel}
          textVariant="variant-2-bold"
          onPress={onButtonPress}
          width="l"
          style={styles.addNewSetBtn}
        />
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  addNewSetBtn: {
    alignSelf: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
});
