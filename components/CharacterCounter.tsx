import { StyleSheet, type StyleProp, type TextStyle } from "react-native";

import TextView from "./text/Text";

interface CharacterCounterProps {
  current: number;
  max: number;
  style?: StyleProp<TextStyle>;
}

export const CharacterCounter = ({ current, max, style }: CharacterCounterProps) => {
  const isOverLimit = current > max;

  return (
    <TextView
      color={isOverLimit ? "informational-error" : "interactive-text-1"}
      style={[styles.counter, style]}
    >
      {`${current || 0}/${max}`}
    </TextView>
  );
};

const styles = StyleSheet.create({
  counter: {
    alignSelf: "flex-end",
    paddingRight: 16,
    paddingTop: 4,
  },
});
