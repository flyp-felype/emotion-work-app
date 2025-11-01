import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HapticTab } from "../../components/haptic-tab";
import { useThemeColor } from "../../hooks/use-theme-color";

export default function TabLayout() {
  const tintColor = useThemeColor({}, "tint");
  const iconColor = useThemeColor({}, "icon");
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tintColor,
        tabBarInactiveTintColor: iconColor,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          height: 60 + insets.bottom, // Altura + área segura inferior
          paddingBottom: insets.bottom, // Padding dinâmico baseado no dispositivo
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size || 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="redeem"
        options={{
          title: "Resgatar",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="gift" size={size || 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Configurações",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="cog" size={size || 24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
