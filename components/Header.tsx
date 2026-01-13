import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import type { ReactNode } from "react";
import { TouchableOpacity } from "react-native";

import Box from "@/components/Box";
import TextView from "@/components/text/Text";

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  children?: ReactNode;
  onBackPress?: () => void;
}

export default function Header({ title, showBackButton = false, children, onBackPress }: HeaderProps) {
  const router = useRouter();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <Box
      backgroundColor="elevation-background-dark-4"
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
              color="#DBDBDB"
            />
          </TouchableOpacity>
        )}
      </Box>

      <Box
        flex={1}
        alignItems="center"
      >
        <TextView
          variant="variant-4-bold"
          color="interactive-text-dark-1"
        >
          {title}
        </TextView>
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
