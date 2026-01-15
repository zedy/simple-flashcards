import { useRouter } from "expo-router";
import { RefreshCcw } from "lucide-react-native";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

import Box from "@/components/Box";
import Button from "@/components/buttons/Button";
import IconButton from "@/components/buttons/IconButton";
import Input from "@/components/input/Input";
import Select, { type SelectItem } from "@/components/input/Select";
import TextView from "@/components/text/Text";
import { type Card, useSetsStore } from "@/stores/useSetsStore";
import { showToast } from "@/utils/toast";

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
  const [cardTag, setCardTag] = useState<string>(data?.tag || "");
  const [textTopError, setTextTopError] = useState<string>();
  const [textBottomError, setTextBottomError] = useState<string>();
  const isEditMode = !!data;

  const handleSetSelection = (value: string | string[]) => {
    setSelectedSet(value as string);
    setSetError(undefined);
  };

  const handleTagSelection = (value: string | string[]) => {
    setCardTag(value as string);
  };

  // Get tag label from selected tag ID
  const getTagLabel = (tagId: string): string => {
    if (!tagId) return "";
    const tag = tagList.find(item => item.value === tagId);
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
      const tags = sets.find((item) => item.id === selectedSet)?.tags.map((tag) => ({
        label: tag.name,
        value: tag.id,
      }));
      setTagList(tags || []);
    }
  }, [selectedSet, sets]);

  // Update form fields when data changes (when navigating to different cards)
  useEffect(() => {
    if (data) {
      setSelectedSet(data.setId);
      setTextTop(data.topText);
      setTextBottom(data.bottomText);
      // Explicitly set tag, clearing it if not present
      setCardTag(data.tag && data.tag.trim() !== "" ? data.tag : "");
    } else if (prefilledSetId) {
      setSelectedSet(prefilledSetId);
    }
  }, [data, prefilledSetId]);

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
          tag: cardTag,
          tagLabel: getTagLabel(cardTag),
        });
        showToast({
          variant: "success",
          message: "Card updated successfully",
        });
        // Navigate based on returnTo (use selectedSet in case card was moved to a different set)
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
          id: crypto.randomUUID(),
          setId: selectedSet,
          tag: cardTag || "",
          tagLabel: getTagLabel(cardTag),
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
      gap={"8"}
      flex={1}
      justifyContent={"space-between"}
      alignItems={"center"}
      paddingTop={"0"}
    >
      <Box
        width={"100%"}
        paddingTop={"8"}
      >
        <TextView
          color={"interactive-text-dark-1"}
          textAlign={"center"}
        >
          Choose a set to add the card to *
        </TextView>
        <Select
          variant="filled"
          label=""
          placeholder="Choose a set ..."
          onSelect={handleSetSelection}
          selectedValue={selectedSet}
          items={setItems}
          error={setError}
          fallbackText="You need to create a SET first before adding cards. Click on SETS and get started."
          fallbackAction={{
            button: "CREATE SET",
            callback: handleGoToSetCreation
          }}
        />
        {tagList.length > 0 && (
          <>
            <TextView
              color={"interactive-text-dark-1"}
              textAlign={"center"}
              paddingTop={"4"}
            >
              Choose an optional tag to add the card
            </TextView>
            <Select
              variant="filled"
              label=""
              placeholder="Add tag to card"
              onSelect={handleTagSelection}
              selectedValue={cardTag}
              items={tagList}
            />
          </>
        )}
      </Box>

      <Box
        flex={1}
        alignSelf={"stretch"}
        justifyContent={"center"}
      >
        <Box>
          <Input
            variant="filled"
            type="textArea"
            label=""
            textVariant="variant-3-medium"
            borderRadius="m"
            placeholder="Front card text"
            onChangeText={(text) => {
              setTextTop(text);
              setTextTopError(undefined);
            }}
            value={textTop}
            error={textTopError}
          />
          <TextView
            color={textTop.length > 99 ? "informational-error" : "interactive-text-dark-1"}
            style={styles.counterLength}
          >
            {`${textTop?.length || 0}/99`}
          </TextView>
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
            iconColor="interactive-text-dark-1"
          />
        </Box>
        <Box>
          <Input
            variant="filled"
            type="textArea"
            label=""
            textVariant="variant-3-medium"
            borderRadius="m"
            placeholder="Back card text"
            onChangeText={(text) => {
              setTextBottom(text);
              setTextBottomError(undefined);
            }}
            value={textBottom}
            error={textBottomError}
          />
          <TextView
            color={textBottom.length > 99 ? "informational-error" : "interactive-text-dark-1"}
            style={styles.counterLength}
          >
            {`${textBottom?.length || 0}/99`}
          </TextView>
        </Box>
      </Box>
      <Button
        label={isEditMode ? "UPDATE CARD" : "ADD CARD"}
        onPress={handleAddCard}
        width="l"
        textVariant="variant-2-bold"
        variant="primary"
      />
    </Box>
  );
}

const styles = StyleSheet.create({
  counterLength: {
    alignSelf: "flex-end",
    paddingRight: 10,
    paddingTop: 2,
  },
});
