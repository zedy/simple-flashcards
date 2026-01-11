import { useEffect, useState } from "react";

import Box from "@/components/Box";
import Header from "@/components/Header";
import { AddNewSetModal } from "@/components/modals/content/AddNewSetModal";
import Modal from "@/components/modals/Modal";
import { SetCardList } from "@/components/SetCardList";
import { useSetsStore } from "@/stores/useSetsStore";
import { showToast } from "@/utils/toast";

export default function SetsScreen() {
  const [isAddSetModalOpen, setIsAddSetModalOpen] = useState<boolean>(false);
  const { sets, addSet, hydrate } = useSetsStore();
  console.log("sets", sets);
  useEffect(() => {
    hydrate();
  }, []);

  const createNewSet = (name: string) => {
    addSet({
      id: crypto.randomUUID(),
      name,
      tags: ["default"],
      label: "",
      icon: "clipboard",
    });
    showToast({
      variant: "success",
      message: `Successfully created set: ${name}`,
    });
    setIsAddSetModalOpen(false);
  };

  return (
    <Box
      flex={1}
      backgroundColor="elevation-backgrund-dark-2"
    >
      <Header title="YOUR SETS" />
      <SetCardList toggleModal={setIsAddSetModalOpen} />
      <Modal
        visible={isAddSetModalOpen}
        onClose={() => setIsAddSetModalOpen(false)}
      >
        <AddNewSetModal callback={createNewSet} />
      </Modal>
    </Box>
  );
}
