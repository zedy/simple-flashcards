import { Clipboard } from "lucide-react-native";
import { StyleSheet } from "react-native";

import Box from "@/components/Box";
import Button from "@/components/buttons/Button";
import { SetCard } from "@/components/SetCard";
import TextView from "@/components/text/Text";
import { useSetsStore } from "@/stores/useSetsStore";

interface SetCardListProps {
  toggleModal: (open: boolean) => void;
}

export const SetCardList = ({ toggleModal }: SetCardListProps) => {
  const { sets } = useSetsStore();

  const handleAddNewSet = () => {
    toggleModal(true);
  };

  return (
    <Box
      flex={1}
      padding="5"
      justifyContent={"center"}
      alignContent={"center"}
      gap={"4"}
    >
      {sets.length === 0 ? (
        <>
          <Box
            width={"100%"}
            justifyContent={"center"}
            flexDirection={"row"}
          >
            <Clipboard
              width={128}
              height={128}
              color={"#DBDBDB"}
            />
          </Box>
          <TextView
            textAlign={"center"}
            variant={"variant-2-bold"}
            color="interactive-text-dark-1"
          >
            Currently you have no sets
          </TextView>
          <Button
            label="Add new set"
            textVariant="variant-2"
            onPress={handleAddNewSet}
            width="l"
            style={styles.addNewSetBtn}
          />
        </>
      ) : (
        <Box gap={"4"}>
          <Box gap={"1"}>
            {sets.map((set) => (
              <SetCard
                key={set.id}
                data={set}
                count={1}
              />
            ))}
          </Box>
          <Button
            label="Add new set"
            textVariant="variant-2"
            onPress={handleAddNewSet}
            width="l"
            style={styles.addNewSetBtn}
          />
        </Box>
      )}
    </Box>
  );
}

const styles = StyleSheet.create({
  addNewSetBtn: {
    alignSelf: "center",
  },
});
