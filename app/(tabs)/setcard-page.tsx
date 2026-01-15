import { useTheme } from "@shopify/restyle";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CheckIcon, FilterIcon, PencilIcon, X } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Dimensions, ScrollView, StyleSheet } from "react-native";

import Box from "@/components/Box";
import IconButton from "@/components/buttons/IconButton";
import { CardList } from "@/components/CardList";
import Header from "@/components/Header";
import Input from "@/components/input/Input";
import Drawer from "@/components/modals/Drawer";
import NotFoundView from "@/components/NotFoundView";
import Pressable from "@/components/Pressable";
import TextView from "@/components/text/Text";
import { useDebounce } from "@/hooks/useDebounce";
import { useSetsStore } from "@/stores/useSetsStore";
import type { Theme, ThemeColor } from "@/utils/theme/restyleTheme";

export default function SetCardPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { sets, cards: allCards } = useSetsStore();
  const [search, setSearch] = useState<string>("");
  const [isFilterVisible, setIsFilterVisible] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const debouncedSearch = useDebounce(search, 300);
  const theme = useTheme<Theme>();

  const currentSet = sets.find((set) => set.id === id);
  const allSetCards = allCards.filter((card) => card.setId === id);

  // Filter cards based on debounced search term and selected tags
  const cards = useMemo(() => {
    let filtered = allSetCards;

    // Apply search filter
    if (debouncedSearch.trim()) {
      const searchLower = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (card) =>
          card.topText.toLowerCase().includes(searchLower) || card.bottomText.toLowerCase().includes(searchLower),
      );
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((card) => card.tag && selectedTags.includes(card.tag));
    }

    return filtered;
  }, [allSetCards, debouncedSearch, selectedTags]);

  const handleEditPress = () => {
    router.push(`/(tabs)/edit-set?id=${id}`);
  };

  const handleClearSearch = () => {
    setSearch("");
  };

  const handleOpenFilter = () => {
    setIsFilterVisible(true);
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tagId)) {
        return prev.filter((id) => id !== tagId);
      } else {
        return [...prev, tagId];
      }
    });
  };

  const handleFilterApply = () => {
    setIsFilterVisible(false);
  };

  const handleClearFilters = () => {
    setSelectedTags([]);
    setIsFilterVisible(false);
  };

  if (!currentSet) {
    return (
      <NotFoundView
        title="SET NOT FOUND"
        message="The set you're looking for doesn't exist."
      />
    );
  }

  return (
    <Box
      flex={1}
      backgroundColor="elevation-background-3"
    >
      <Header
        title={`${currentSet.name.toUpperCase()}`}
        titleSuffix={`(${allSetCards.length})`}
        showBackButton
      >
        <IconButton
          onPress={handleEditPress}
          size="s"
          variant="transparent"
          icon={<PencilIcon size={24} />}
          iconColor="interactive-text-1"
          iconSize={24}
        />
      </Header>
      <Box
        width={"100%"}
        padding={"4"}
        paddingBottom={"0"}
        flexDirection={"row"}
        gap={"2"}
        backgroundColor={"elevation-background-3"}
      >
        <Input
          onChangeText={setSearch}
          variant="outlined"
          label=""
          placeholder="Search for a card"
          value={search}
          flexGrow={1}
          width={"auto"}
          rightElement={
            <IconButton
              iconColor={"interactive-text-1"}
              icon={<X size={24} />}
              onPress={handleClearSearch}
              variant="transparent"
            />
          }
        />
        <Box
          position="relative"
          pointerEvents="box-none"
        >
          <IconButton
            icon={<FilterIcon />}
            iconColor={selectedTags.length > 0 ? "interactive-primary-text-idle" : "interactive-text-1"}
            onPress={handleOpenFilter}
            variant="transparent"
            style={styles.filterIcon}
          />
          {selectedTags.length > 0 && (
            <Box
              position="absolute"
              top={8}
              right={8}
              width={8}
              height={8}
              borderRadius="full"
              backgroundColor="interactive-primary-bg-idle"
              pointerEvents="none"
            />
          )}
        </Box>
      </Box>
      <CardList
        cards={cards}
        setId={id}
        color={currentSet.label as ThemeColor}
        search={search}
      />
      <Drawer
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        primaryActionLabel={"Apply"}
        secondaryActionLabel={selectedTags.length > 0 ? "Clear" : undefined}
        onPrimaryActionPress={handleFilterApply}
        onSecondaryActionPress={handleClearFilters}
        scrollable={true}
        showCloseButton={false}
      >
        <Box
          paddingTop="4"
          paddingBottom="6"
        >
          <TextView
            variant="variant-3-bold"
            color="interactive-text-1"
            marginBottom="4"
            paddingLeft={"4"}
          >
            Filter by Tags
          </TextView>
          {currentSet?.tags && currentSet.tags.length > 0 ? (
            <ScrollView style={[styles.tagList, { maxHeight: Dimensions.get("window").height * 0.5 }]}>
              {currentSet.tags.map((tag) => {
                const isSelected = selectedTags.includes(tag.id);
                return (
                  <Pressable
                    key={tag.id}
                    onPress={() => handleTagToggle(tag.id)}
                  >
                    <Box
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="space-between"
                      paddingVertical="3"
                      paddingHorizontal="3"
                      backgroundColor={"transparent"}
                      borderBottomColor={"drawer-border"}
                      borderBottomWidth={1}
                      marginBottom="2"
                    >
                      <TextView
                        variant="variant-2"
                        color={isSelected ? "interactive-primary-text-idle" : "interactive-primary-text-pressed"}
                      >
                        {tag.name}
                      </TextView>
                      {isSelected && (
                        <CheckIcon
                          size={20}
                          color={theme.colors["primary-color"]}
                        />
                      )}
                    </Box>
                  </Pressable>
                );
              })}
            </ScrollView>
          ) : (
            <TextView
              variant="variant-2"
              color="interactive-primary-text-pressed"
              textAlign="center"
              marginTop="4"
            >
              No tags available in this set
            </TextView>
          )}
        </Box>
      </Drawer>
    </Box>
  );
}

const styles = StyleSheet.create({
  filterIcon: {
    marginTop: 4,
  },
  tagList: {
    flexGrow: 0,
  },
});
