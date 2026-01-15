import { ActivityIndicator } from "react-native";

import Box from "./Box";

export default function LoadingScreen() {
  return (
    <Box
      flex={1}
      backgroundColor="elevation-background-3"
      justifyContent="center"
      alignItems="center"
    >
      <ActivityIndicator size="large" color="#FFFFFF" />
    </Box>
  );
}
