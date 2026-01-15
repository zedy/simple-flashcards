import { useTheme } from "@shopify/restyle";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import type { ReactNode } from "react";
import { TouchableOpacity } from "react-native";

import Box from "@/components/Box";
import TextView from "@/components/text/Text";
import type { Theme } from "@/utils/theme/restyleTheme";

interface HeaderProps {
  title: string;
  titleSuffix?: string;
  showBackButton?: boolean;
  children?: ReactNode;
  onBackPress?: () => void;
}

export default function Header({ title, titleSuffix, showBackButton = false, children, onBackPress }: HeaderProps) {
  const router = useRouter();
  const theme = useTheme<Theme>();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <Box
      backgroundColor="elevation-background-4"
      paddingHorizontal="5"
      paddingVertical="4"
      flexDirection="row"
      alignItems="center"
      height={68}
      justifyContent="space-between"
      borderBottomColor={"interactive-border-1"}
      borderBottomWidth={1}
    >
      <Box width={40}>
        {showBackButton && (
          <TouchableOpacity onPress={handleBackPress}>
            <ChevronLeft
              size={24}
              color={theme.colors["interactive-text-1"]}
            />
          </TouchableOpacity>
        )}
      </Box>

      <Box
        flexDirection={"row"}
        alignItems="center"
        gap={"2"}
      >
        <TextView
          variant="variant-4-bold"
          color="interactive-text-1"
        >
          {title}
        </TextView>
        {titleSuffix && (<TextView
          variant="variant-4-bold"
          color="interactive-border-1"
        >
          {titleSuffix}
        </TextView>)}
      </Box>

      <Box
        width={40}
        alignItems="flex-end"
      >
        {children}
      </Box>
    </Box>
  );
}
