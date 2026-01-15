import Box from "@/components/Box";
import SetForm from "@/components/forms/SetForm";
import Header from "@/components/Header";

export default function CreateSetScreen() {
  return (
    <Box
      flex={1}
      backgroundColor="elevation-background-3"
    >
      <Header
        title="Create New Set"
        showBackButton
      />
      <SetForm />
    </Box>
  );
}
