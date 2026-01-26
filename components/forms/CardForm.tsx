import { useTheme } from "@shopify/restyle";
import * as Crypto from "expo-crypto";
import { useFocusEffect, useRouter } from "expo-router";
import { LayoutGrid, RefreshCcw, TagIcon } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";

import Box from "@/components/Box";
import Button from "@/components/buttons/Button";
import IconButton from "@/components/buttons/IconButton";
import { CharacterCounter } from "@/components/CharacterCounter";
import Input from "@/components/input/Input";
import type { SelectItem } from "@/components/input/Select";
import Pressable from "@/components/Pressable";
import { type Card, useSetsStore } from "@/stores/useSetsStore";
import type { Theme } from "@/utils/theme/restyleTheme";
import { showToast } from "@/utils/toast";

import { SelectSetDrawer } from "../SelectSetDrawer";
import { SelectTagDrawer } from "../SelectTagDrawer";
import TextView from "../text/Text";

interface CardFormProps {
  data?: Card;
  prefilledSetId?: string;
  returnTo?: "play" | "setcard";
}

export const CardForm = ({ data, prefilledSetId, returnTo = "setcard" }: CardFormProps) => {
  const router = useRouter();
  const { sets, addCard, updateCard } = useSetsStore();
  const [selectedSet, setSelectedSet] = useState<string>(data?.setId || prefilledSetId || "");
  const [textTop, setTextTop] = useState<string>(data?.topText || "");
  const [textBottom, setTextBottom] = useState<string>(data?.bottomText || "");
  const [setItems, setSetItems] = useState<SelectItem[] | []>([]);
  const [tagList, setTagList] = useState<SelectItem[] | []>([]);
  const [setError, setSetError] = useState<string>();
  const [isSelectSetVisible, setIsSelectSetVisible] = useState<boolean>(false);
  const [isSelectTagVisible, setIsSelectTagVisible] = useState<boolean>(false);
  const [selectedTag, setSelectedTag] = useState<string>(data?.tag || "");
  const [textTopError, setTextTopError] = useState<string>();
  const [textBottomError, setTextBottomError] = useState<string>();
  const theme = useTheme<Theme>();
  const isEditMode = !!data;

  const handleSetSelection = (value: string) => {
    setSelectedSet(value as string);
    setSetError(undefined);
    setIsSelectSetVisible(false);
  };

  const handleTagSelection = (value: string | string[]) => {
    setSelectedTag(value as string);
    setIsSelectTagVisible(false);
  };

  // Get tag label from selected tag ID
  const getTagLabel = (tagId: string): string => {
    if (!tagId) return "";
    const tag = tagList.find((item) => item.value === tagId);
    return tag?.label || "";
  };

  useEffect(() => {
    setSetItems(
      sets.map((set) => ({
        label: set.name,
        value: set.id,
      })),
    );

    if (selectedSet && sets) {
      const tags = sets
        .find((item) => item.id === selectedSet)
        ?.tags.map((tag) => ({
          label: tag.name,
          value: tag.id,
        }));
      setTagList(tags || []);
    }
  }, [selectedSet, sets]);

  useEffect(() => {
    if (data) {
      setSelectedSet(data.setId);
      setTextTop(data.topText);
      setTextBottom(data.bottomText);
      setSelectedTag(data.tag && data.tag.trim() !== "" ? data.tag : "");
    } else if (prefilledSetId) {
      setSelectedSet(prefilledSetId);
    }
  }, [data, prefilledSetId]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (!isEditMode) {
          setTextTop("");
          setTextBottom("");
          setSelectedSet("");
          setSelectedTag("");
          setSetError(undefined);
          setTextTopError(undefined);
          setTextBottomError(undefined);
        }
      };
    }, [isEditMode]),
  );

  const handleSwitchText = () => {
    setTextBottom(textTop);
    setTextTop(textBottom);
  };

  const handleGoToSetCreation = () => {
    router.push(`/(tabs)/create-set`);
  };

  const handleAddCard = () => {
    // Reset errors
    setSetError(undefined);
    setTextTopError(undefined);
    setTextBottomError(undefined);

    let hasError = false;

    // Validation
    if (!selectedSet || selectedSet === "") {
      setSetError("Please select a set");
      showToast({
        variant: "error",
        message: "Please choose a set",
      });
      hasError = true;
    }

    if (!textTop || textTop.trim().length === 0) {
      setTextTopError("Text must have at least 1 character");
      hasError = true;
    } else if (textTop.length > 99) {
      setTextTopError("Text must be at most 99 characters");
      hasError = true;
    }

    if (!textBottom || textBottom.trim().length === 0) {
      setTextBottomError("Text must have at least 1 character");
      hasError = true;
    } else if (textBottom.length > 99) {
      setTextBottomError("Text must be at most 99 characters");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      if (isEditMode && data) {
        // Update existing card
        updateCard(data.id, {
          ...data,
          bottomText: textBottom,
          topText: textTop,
          setId: selectedSet,
          tag: selectedTag,
          tagLabel: getTagLabel(selectedTag),
        });
        showToast({
          variant: "success",
          message: "Card updated successfully",
        });

        if (returnTo === "play") {
          router.push(`/(tabs)/play?setId=${selectedSet}`);
        } else {
          router.push(`/(tabs)/setcard-page?id=${selectedSet}`);
        }
      } else {
        // Add new card
        addCard({
          bottomText: textBottom,
          topText: textTop,
          id: Crypto.randomUUID(),
          setId: selectedSet,
          tag: selectedTag || "",
          tagLabel: getTagLabel(selectedTag),
        });
        setTextTop("");
        setTextBottom("");
        showToast({
          variant: "success",
          message: "Card added successfully",
        });
      }
    } catch (error) {
      showToast({
        variant: "error",
        message: error instanceof Error ? error.message : "Failed to save card",
      });
    }
  };

  return (
    <Box
      padding={"5"}
      gap={"2"}
      flex={1}
      justifyContent={"space-between"}
      alignItems={"center"}
      paddingTop={"0"}
    >
      <Box
        flexDirection={"row"}
        alignItems={"center"}
        width={"100%"}
        paddingVertical={"6"}
        justifyContent={"space-around"}
      >
        <Pressable
          onPress={() => setIsSelectSetVisible(true)}
          flexDirection={"row"}
          alignItems={"center"}
          gap={"2"}
        >
          <LayoutGrid
            size={40}
            color={setError ? theme.colors["informational-error"] : theme.colors["primary-color"]}
          />
          <TextView
            color={"interactive-text-1"}
            textAlign={"center"}
            variant={"variant-3-medium"}
          >
            {sets.find((setItem) => setItem.id === selectedSet)?.name || "Select Set"}
          </TextView>
        </Pressable>
        <Pressable
          onPress={() => setIsSelectTagVisible(true)}
          flexDirection={"row"}
          alignItems={"center"}
          gap={"2"}
        >
          <TagIcon
            size={36}
            color={theme.colors["primary-color"]}
          />
          <TextView
            color={"interactive-text-1"}
            textAlign={"center"}
            variant={"variant-3-medium"}
          >
            {tagList.find((tagItem) => tagItem.value === selectedTag)?.label || "Select tag"}
          </TextView>
        </Pressable>
      </Box>

      <Box
        flex={1}
        alignSelf={"stretch"}
        justifyContent={"center"}
      >
        <Box flexGrow={1}>
          <Input
            variant="outlined"
            type="textArea"
            label=""
            textVariant="variant-3-medium"
            borderRadius="m"
            placeholder="Front card text *"
            onChangeText={(text) => {
              setTextTop(text);
              setTextTopError(undefined);
            }}
            flexGrow={1}
            value={textTop}
            error={textTopError}
            paddingBottom={"1"}
          />
          <CharacterCounter
            current={textTop.length}
            max={99}
          />
        </Box>
        <Box
          width={"100%"}
          justifyContent={"center"}
          alignItems={"center"}
          flexDirection={"row"}
        >
          <IconButton
            variant="transparent"
            onPress={handleSwitchText}
            icon={<RefreshCcw size={64} />}
            iconColor="interactive-text-pressed"
          />
        </Box>
        <Box flexGrow={1}>
          <Input
            variant="outlined"
            type="textArea"
            label=""
            flexGrow={1}
            textVariant="variant-3-medium"
            borderRadius="m"
            placeholder="Back card text *"
            paddingBottom={"1"}
            onChangeText={(text) => {
              setTextBottom(text);
              setTextBottomError(undefined);
            }}
            value={textBottom}
            error={textBottomError}
          />
          <CharacterCounter
            current={textBottom.length}
            max={99}
          />
        </Box>
      </Box>
      <Button
        label={isEditMode ? "UPDATE CARD" : "ADD CARD"}
        onPress={handleAddCard}
        width="l"
        textVariant="variant-2-bold"
        variant="primary"
      />
      <SelectSetDrawer
        visible={isSelectSetVisible}
        currentSet={selectedSet}
        onClose={() => setIsSelectSetVisible(false)}
        sets={sets}
        onSetSelect={handleSetSelection}
      />
      <SelectTagDrawer
        visible={isSelectTagVisible}
        currentTag={selectedTag}
        onClose={() => setIsSelectTagVisible(false)}
        tagList={tagList}
        onSetSelect={handleTagSelection}
      />
    </Box>
  );
};
