import { Clipboard } from "lucide-react-native";
import { useState } from "react";
import { Controller } from "react-hook-form";

import Box from "@/components/Box";
import Button from "@/components/buttons/Button";
import Input from "@/components/input/Input";
import TextView from "@/components/text/Text";
import { SetCreationSchema, type SetCreationSchemaDTO } from "@/data/models/Set.models";
import { useForm } from "@/hooks/useForm";

import { EmojiPickerDrawer } from "./EmojiPickerDrawer";

interface AddNewSetModalProps {
  callback: (data: SetCreationSchemaDTO) => void;
}

export const AddNewSetModal = ({ callback }: AddNewSetModalProps) => {
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SetCreationSchemaDTO>({
    zodSchema: SetCreationSchema,
    mode: "onSubmit",
    defaultValues: {
      name: "",
      emoji: "📚",
    },
  });

  const selectedEmoji = watch("emoji");

  const callEmojiPickerDrawer = () => {
    setIsEmojiPickerOpen(true);
  };

  const handleEmojiSelected = (emoji: string) => {
    setValue("emoji", emoji);
  };

  const onSubmit = (data: SetCreationSchemaDTO) => {
    callback(data);
  };

  return (
    <Box
      padding={"4"}
      gap={"5"}
      paddingTop={"0"}
    >
      <Box flexDirection={"row"} alignItems={"center"} gap={"3"} paddingBottom={"2"}>
        <TextView variant={"variant-3"} color={"interactive-primary-text-idle"}>Icon:</TextView>
        <TextView variant="variant-3" fontSize={48} onPress={callEmojiPickerDrawer}>{selectedEmoji}</TextView>
      </Box>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Set Name"
            required
            leftElement={<Clipboard />}
            placeholder="Enter set name"
            value={value}
            variant="filled"
            onChangeText={onChange}
            error={errors.name?.message}
          />
        )}
      />
      <Button
        label="ADD"
        onPress={handleSubmit(onSubmit)}
        width="l"
        textVariant="variant-2-bold"
        variant="primary"
      />
      <EmojiPickerDrawer
        visible={isEmojiPickerOpen}
        onClose={() => setIsEmojiPickerOpen(false)}
        onEmojiSelected={handleEmojiSelected}
      />
    </Box>
  );
};
