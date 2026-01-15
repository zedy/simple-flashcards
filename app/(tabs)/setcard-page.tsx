import { useLocalSearchParams, useRouter } from "expo-router";
import { FilterIcon, PencilIcon, X } from "lucide-react-native";
import { useMemo, useState } from "react";
import { StyleSheet } from "react-native";

import Box from "@/components/Box";
import IconButton from "@/components/buttons/IconButton";
import { CardList } from "@/components/CardList";
import { FilterTagsDrawer } from "@/components/FilterTagsDrawer";
import Header from "@/components/Header";
import Input from "@/components/input/Input";
import NotFoundView from "@/components/NotFoundView";
import { useDebounce } from "@/hooks/useDebounce";
import { useSetsStore } from "@/stores/useSetsStore";
import type { ThemeColor } from "@/utils/theme/restyleTheme";

export default function SetCardPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { sets, cards: allCards } = useSetsStore();
  const [search, setSearch] = useState<string>("");
  const [isFilterVisible, setIsFilterVisible] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const debouncedSearch = useDebounce(search, 300);

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
        search={search !== "" && selectedTags.length > 0}
      />
      <FilterTagsDrawer
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        currentSet={currentSet}
        selectedTags={selectedTags}
        onTagToggle={handleTagToggle}
        onApply={handleFilterApply}
        onClear={handleClearFilters}
      />
    </Box>
  );
}

const styles = StyleSheet.create({
  filterIcon: {
    marginTop: 4,
  },
});
