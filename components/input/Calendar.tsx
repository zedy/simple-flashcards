import { useTheme } from "@shopify/restyle";
import { ChevronLeftCircle, ChevronRightCircle } from "lucide-react-native";
import React from "react";
import type { TextStyle } from "react-native";
import DateTimePicker, { type DateType, useDefaultStyles } from "react-native-ui-datepicker";

import type { Theme } from "@/utils/theme/restyleTheme";

import Box from "../Box";
import TextButton from "../buttons/TextButton";
import Text from "../text/Text";
import ListItem from "./ListItem";

export interface CalendarProps {
  date: Date | undefined;
  setDate: (newDate: Date | undefined) => void;
  label: string;
  showControls?: boolean;
}

const Calendar = ({
  date,
  setDate,
  label,
  showControls = true,
  ...rest
}: CalendarProps & Partial<typeof DateTimePicker>) => {
  const theme = useTheme<Theme>();
  const defaultStyles = useDefaultStyles("light");

  const handleChange = (change: { date: DateType }) => {
    if (change?.date) {
      // oxlint-disable-next-line no-unsafe-type-assertion
      setDate(new Date(change.date as string));
    }
  };

  const handleTodayPress = () => {
    setDate(new Date());
  };

  const handleClearPress = () => {
    setDate(undefined);
  };

  return (
    <Box width={"100%"}>
      <Box pb="4" paddingHorizontal="2">
        <Text variant="variant-2" color="text-default-primary">
          {label}
        </Text>
      </Box>
      <DateTimePicker
        mode="single"
        date={date}
        onChange={handleChange}
        showOutsideDays
        navigationPosition="around"
        components={{
          IconPrev: <ChevronLeftCircle />,
          IconNext: <ChevronRightCircle />,
        }}
        styles={{
          ...defaultStyles,
          selected: {
            ...defaultStyles.selected,
            backgroundColor: theme.colors["pill-outlined-border"],
          },
          day: {
            ...defaultStyles.day,
            borderRadius: theme.borderRadii["rounding-button-rounding"],
          },
          day_cell: {
            ...defaultStyles.day_cell,
            padding: theme.spacing["2"],
          },
          day_label: {
            ...defaultStyles.day_label,
            fontSize: theme.textVariants["variant-8"].fontSize,
            fontFamily: theme.textVariants["variant-8"].fontFamily,
            color: theme.colors["button-text-color"],
          } as TextStyle,
          weekday_label: {
            ...defaultStyles.weekday_label,
            fontSize: theme.textVariants["variant-2-bold"].fontSize,
            fontFamily: theme.textVariants["variant-2-bold"].fontFamily,
            color: theme.colors["button-text-color"],
            height: 24,
          } as TextStyle,
          year_selector_label: {
            fontSize: theme.textVariants["variant-2-bold"].fontSize,
            fontFamily: theme.textVariants["variant-2-bold"].fontFamily,
            backgroundColor: theme.colors["transparent"],
          },
          year: {
            fontSize: theme.textVariants["variant-2-bold"].fontSize,
            fontFamily: theme.textVariants["variant-2-bold"].fontFamily,
            backgroundColor: theme.colors["transparent"],
            borderColor: theme.colors["transparent"],
            borderWidth: 0,
            borderRadius: theme.borderRadii["rounding-button-rounding"],
          },
          month_selector_label: {
            borderColor: theme.colors["transparent"],
            borderWidth: 0,
            backgroundColor: theme.colors["transparent"],
            fontSize: theme.textVariants["variant-2-bold"].fontSize,
            fontFamily: theme.textVariants["variant-2-bold"].fontFamily,
          },
          month_selector: {
            borderColor: theme.colors["transparent"],
            borderWidth: 0,
            backgroundColor: theme.colors["transparent"],
            fontSize: theme.textVariants["variant-2-bold"].fontSize,
            fontFamily: theme.textVariants["variant-2-bold"].fontFamily,
          },
          year_label: {
            fontSize: theme.textVariants["variant-2-bold"].fontSize,
            fontFamily: theme.textVariants["variant-2-bold"].fontFamily,
            backgroundColor: theme.colors["transparent"],
            borderColor: theme.colors["transparent"],
            borderWidth: 0,
            borderRadius: theme.borderRadii["rounding-button-rounding"],
          },
          weekdays: {
            ...defaultStyles.weekdays,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors["text-disabled"],
            paddingBottom: 10,
            borderTopWidth: 0,
          },
          selected_month: {
            backgroundColor: theme.colors["pill-outlined-border"],
            borderRadius: theme.borderRadii["rounding-button-rounding"],
          },
          months: {
            fontSize: theme.textVariants["variant-2-bold"].fontSize,
            fontFamily: theme.textVariants["variant-2-bold"].fontFamily,
          },
          selected_year: {
            backgroundColor: theme.colors["pill-outlined-border"],
            borderRadius: theme.borderRadii["rounding-button-rounding"],
          },
          month: {
            ...defaultStyles.month,
            borderColor: theme.colors["transparent"],
            borderWidth: 0,
            backgroundColor: theme.colors["transparent"],
            margin: theme.spacing["2"],
            fontSize: theme.textVariants["variant-2-bold"].fontSize,
            fontFamily: theme.textVariants["variant-2-bold"].fontFamily,
          },
          header: {
            marginRight: theme.spacing["2"],
            backgroundColor: theme.colors["trasnaparent"],
            marginBottom: theme.spacing["4"],
          },
        }}
        {...rest}
      />
      {showControls && (
        <ListItem
          label=""
          variant="action"
          mt="8"
          leftElement={<TextButton label="Today" variant="primary" onPress={handleTodayPress} />}
          rightElement={<TextButton label="Clear" variant="secondary" onPress={handleClearPress} />}
        />
      )}
    </Box>
  );
};

export default Calendar;
