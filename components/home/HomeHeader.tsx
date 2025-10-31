import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { useThemeColor } from "../../hooks/use-theme-color";
import { ThemedText } from "../themed-text";

const logoLight = require("../../assets/images/emotion-work-logo.png");
const logoDark = require("../../assets/images/emotion-work-logo-dark.png");

interface HomeHeaderProps {
  points: number;
}

export function HomeHeader({ points = 150 }: HomeHeaderProps) {
  const colorScheme = useColorScheme();
  const logoImage = colorScheme === "dark" ? logoDark : logoLight;
  const iconColor = useThemeColor({}, "text");

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={logoImage} style={styles.logo} resizeMode="contain" />
      </View>
      <TouchableOpacity style={styles.pointsContainer}>
        <FontAwesome
          name="gift"
          size={20}
          color={iconColor}
          style={styles.icon}
        />
        <ThemedText style={styles.pointsValue}>{points} pts</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  logoContainer: {
    width: 120,
    height: 40,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  pointsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  icon: {
    marginRight: 8,
  },
  pointsValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
});
