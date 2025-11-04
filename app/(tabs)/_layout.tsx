import { ThemedText } from "@/components/themed-text";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HapticTab } from "../../components/haptic-tab";
import { useThemeColor } from "../../hooks/use-theme-color";

// Componente customizado para o botão de Check-in destacado
function CustomCheckInButton({ children, onPress }: any) {
  return (
    <TouchableOpacity
      style={styles.customButton}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={["#8B5CF6", "#F87171"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.circleButton}
      >
        {children}
      </LinearGradient>
    </TouchableOpacity>
  );
}
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
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
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
          title: "Check-in",
          tabBarButton: CustomCheckInButton,
          tabBarIcon: ({ focused }) => (
            <FontAwesome5
              name="check"
              size={25}
              color={focused ? tintColor : "#FFFFFF"}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <View>
              <ThemedText
                style={{
                  color: focused ? tintColor : "#FFFFFF",
                  fontSize: 10,
                }}
              >
                Check-in
              </ThemedText>
            </View>
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

const styles = StyleSheet.create({
  customButton: {
    top: -20, // Move o botão para cima
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  circleButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
