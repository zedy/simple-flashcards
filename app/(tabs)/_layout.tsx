import { Tabs } from "expo-router";
import { LayoutGrid, Plus, Settings } from "lucide-react-native";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#25786E",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: "#292929",
          borderTopColor: "#858585",
          borderTopWidth: 1
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Sets",
          tabBarIcon: ({ color }) => (
            <LayoutGrid
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Add",
          tabBarIcon: ({ color }) => (
            <Plus
              size={24}
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
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
