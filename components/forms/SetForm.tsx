import { useRouter } from "expo-router";
import { Clipboard, CornerDownLeft, InfoIcon, Tag } from "lucide-react-native";
import { useRef, useState } from "react";
import { Controller } from "react-hook-form";
import { ScrollView, StyleSheet, type TextInput } from "react-native";

import Box from "@/components/Box";
import Button from "@/components/buttons/Button";
import PillButton from "@/components/buttons/PillButton";
import Input from "@/components/input/Input";
import { EmojiPickerDrawer } from "@/components/modals/content/EmojiPickerDrawer";
import TextView from "@/components/text/Text";
import { SetCreationSchema, type SetCreationSchemaDTO } from "@/data/models/Set.models";
import { useForm } from "@/hooks/useForm";
import { type FlashcardSet, type Tag as TagType, useSetsStore } from "@/stores/useSetsStore";
import type { ThemeColor } from "@/utils/theme/restyleTheme";
import { showToast } from "@/utils/toast";

import IconButton from "../buttons/IconButton";
import { InfoModal } from "../modals/content/InfoModal";
import Modal from "../modals/Modal";

const LabelsMap = [
  "interactive-primary-bg-idle",
  "informational-error",
  "interactive-border-1",
  "interactive-card-yellow",
  "interactive-card-blue",
  "interactive-card-green",
  "interactive-orange",
  "interactive-magenta",
  "interactive-purple",
];

interface SetFormProps {
  data?: FlashcardSet;
}

export default function SetForm({ data }: SetFormProps) {
  const router = useRouter();
  const [tags, setTags] = useState<TagType[]>(data?.tags || []);
  const [tag, setTag] = useState<string>();
  const [tagError, setTagError] = useState<string>();
  const [emoji, setEmoji] = useState<string>(data?.icon || "📚");
  const [label, setLabel] = useState<string>(data?.label || LabelsMap[0]);
  const tagRef = useRef<TextInput>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const { addSet, updateSet } = useSetsStore();
  const isEditMode = !!data;

  const createNewSet = (formData: SetCreationSchemaDTO) => {
    if (isEditMode && data) {
      // Update existing set
      updateSet(data.id, {
        ...data,
        name: formData.name,
        tags,
        label,
        icon: emoji,
      });
      showToast({
        variant: "success",
        message: `Successfully updated set: ${formData.name}`,
      });
    } else {
      // Create new set
      addSet({
        id: crypto.randomUUID(),
        name: formData.name,
        tags,
        label,
        icon: emoji,
      });
      setEmoji("📚");
      setTags([]);
      setTag("");
      setLabel(LabelsMap[0]);
      showToast({
        variant: "success",
        message: `Successfully created set: ${formData.name}`,
      });
    }
    router.back();
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SetCreationSchemaDTO>({
    zodSchema: SetCreationSchema,
    mode: "onSubmit",
    defaultValues: {
      name: data?.name || "",
      icon: data?.icon || "📚",
    },
  });

  const callEmojiPickerDrawer = () => {
    setIsEmojiPickerOpen(true);
  };

  const handleEmojiSelected = (emoji: string) => {
    setEmoji(emoji);
  };

  const onSubmit = (data: SetCreationSchemaDTO) => {
    createNewSet(data);
  };

  const handleAddTag = () => {
    // Reset error
    setTagError(undefined);

    // Validation
    if (!tag || tag.trim().length === 0) {
      setTagError("Tag must have at least 1 character");
      setTimeout(() => tagRef.current?.focus(), 100);
      return;
    }

    if (tag.length > 20) {
      setTagError("Tag must be at most 20 characters");
      setTimeout(() => tagRef.current?.focus(), 100);
      return;
    }

    // Add tag if validation passes
    setTags((state) => [
      ...state,
      {
        name: tag,
        id: crypto.randomUUID(),
      },
    ]);
    setTag("");
    setTimeout(() => tagRef.current?.focus(), 100);
  };

  const handleRemoveTag = (id: string) => {
    const filteredTags = tags.filter((item) => item.id !== id);

    setTags(filteredTags);
  };

  return (
    <Box
      padding={"5"}
      gap={"4"}
      flex={1}
      justifyContent={"center"}
      alignItems={"center"}
      paddingVertical={"0"}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <Box
          alignItems={"center"}
          gap={"2"}
          paddingTop={"8"}
          paddingBottom={"2"}
        >
          <Box
            borderRadius={"full"}
            overflow={"hidden"}
            justifyContent={"center"}
            alignItems={"center"}
            backgroundColor={"elevation-background-dark-1"}
            width={120}
            height={120}
            paddingTop={"3"}
          >
            <TextView
              variant="variant-3"
              lineHeight={80}
              fontSize={64}
              onPress={callEmojiPickerDrawer}
            >
              {emoji ?? "📚"}
            </TextView>
          </Box>
          <TextView
            variant={"variant-3"}
            color={"interactive-primary-text-idle"}
          >
            SET ICON
          </TextView>
        </Box>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <Input
              label=""
              leftElement={<Clipboard />}
              placeholder="Enter set name *"
              value={value}
              variant="filled"
              onChangeText={onChange}
              error={errors.name?.message}
            />
          )}
        />
        <Box
          width={"100%"}
          paddingTop={"6"}
        >
          <Box
            width={"100%"}
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Box
              width={"85%"}
              gap={"0"}
            >
              <Input
                label=""
                placeholder="Enter new tag"
                value={tag}
                ref={tagRef}
                variant="filled"
                onChangeText={(text) => {
                  setTag(text);
                  setTagError(undefined);
                }}
                onSubmitEditing={handleAddTag}
                leftElement={<Tag />}
                rightElement={<CornerDownLeft />}
                error={tagError}
                width={"auto"}
              />
              <TextView
                color={tag && tag?.length > 20 ? "informational-error" : "interactive-text-dark-1"}
                style={styles.counterLength}
              >
                {`${tag?.length || 0}/20`}
              </TextView>
            </Box>
            <IconButton
              icon={
                <InfoIcon
                  size={24}
                  color={"interactive-text-dark-1"}
                />
              }
              onPress={() => setIsInfoModalOpen(true)}
              variant={"transparent"}
              style={styles.infoIcon}
            />
          </Box>

          <Box
            paddingVertical={"4"}
            flexWrap={"wrap"}
            gap={"2"}
            flexDirection={"row"}
            width={"100%"}
          >
            {tags.map((item) => (
              <PillButton
                key={item.id}
                label={item.name}
                dismissable
                onPress={() => handleRemoveTag(item.id)}
              />
            ))}
          </Box>
          <Box
            width={"100%"}
            gap={"4"}
          >
            <TextView
              fontSize={18}
              color={"interactive-text-dark-1"}
              textAlign={"center"}
            >
              CARD COLOR
            </TextView>
            <Box
              flexDirection={"row"}
              gap={"4"}
              flexWrap={"wrap"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              {LabelsMap.map((color) => (
                <Box
                  width={48}
                  height={48}
                  borderRadius={"m"}
                  key={color}
                  backgroundColor={color as ThemeColor}
                  borderColor={label === color ? "interactive-text-dark-1" : (color as ThemeColor)}
                  borderWidth={2}
                >
                  <Button
                    onPress={() => setLabel(color)}
                    variant="primary"
                    label=""
                    width="fit"
                    style={styles.colorBtn}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </ScrollView>
      <Button
        label={isEditMode ? "UPDATE" : "CREATE"}
        onPress={handleSubmit(onSubmit)}
        width="l"
        textVariant="variant-2-bold"
        variant="primary"
        style={styles.addBtn}
      />
      <EmojiPickerDrawer
        visible={isEmojiPickerOpen}
        onClose={() => setIsEmojiPickerOpen(false)}
        onEmojiSelected={handleEmojiSelected}
      />
      <Modal
        hideHeader
        visible={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      >
        <InfoModal text="Tags can later be assign to the cards in this set." />
      </Modal>
    </Box>
  );
}

const styles = StyleSheet.create({
  addBtn: {
    marginTop: 0,
  },
  colorBtn: {
    padding: 0,
    backgroundColor: "transparent",
    height: "100%",
  },
  counterLength: {
    alignSelf: "flex-end",
    paddingRight: 20,
    paddingTop: 2,
  },
  infoIcon: {
    marginTop: 5,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
});
