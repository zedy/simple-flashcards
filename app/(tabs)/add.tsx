import Box from "@/components/Box";
import TextView from '@/components/text/Text';
import Header from '@/components/Header';

export default function AddScreen() {
  return (
    <Box flex={1} backgroundColor="elevation-backgrund-dark-2">
      <Header title="Add Card" />
      <Box flex={1} padding="5">
        <TextView color="interactive-text-dark-1">Create a new flashcard here.</TextView>
      </Box>
    </Box>
  );
}
