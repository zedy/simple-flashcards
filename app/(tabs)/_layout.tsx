import { useTheme } from "@shopify/restyle";
import { Tabs } from "expo-router";
import { LayoutGrid, Plus, Settings } from "lucide-react-native";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import type { Theme } from "@/utils/theme/restyleTheme";

export default function TabLayout() {
  const theme = useTheme<Theme>();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors["primary-color"],
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: theme.colors["elevation-background-4"],
          borderTopColor: theme.colors["interactive-border-1"],
          borderTopWidth: 1,
          paddingVertical: 10,
          height: 70,
        },
        tabBarItemStyle: {
          alignItems: "center",
        },
        tabBarIconStyle: {
          marginBottom: 4,
        },
        tabBarLabelStyle: {
          textAlign: "center",
          fontSize: 14,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Sets",
          tabBarIcon: ({ color }) => (
            <LayoutGrid
              size={32}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Add Card",
          tabBarIcon: ({ color }) => (
            <Plus
              size={32}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <Settings
              size={32}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="create-set"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="edit-set"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="setcard-page"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="edit-card"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="play"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
