import Box from "@/components/Box";
import Header from "@/components/Header";
import TextView from "@/components/text/Text";

interface NotFoundViewProps {
  title?: string;
  message?: string;
}

export default function NotFoundView({
  title = "Not Found",
  message = "The item you're looking for doesn't exist.",
}: NotFoundViewProps) {
  return (
    <Box
      flex={1}
      backgroundColor="elevation-background-3"
    >
      <Header
        title={title}
        showBackButton
      />
      <Box
        flex={1}
        justifyContent="center"
        alignItems="center"
      >
        <TextView
          variant="variant-2"
          color="interactive-text-1"
        >
          {message}
        </TextView>
      </Box>
    </Box>
  );
}
