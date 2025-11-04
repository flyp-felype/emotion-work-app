import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";

const logoLight = require("../../assets/images/emotion-work-logo.png");
const logoDark = require("../../assets/images/emotion-work-logo-dark.png");

interface HomeHeaderProps {
  points: number;
}

export function HomeHeader({ points = 150 }: HomeHeaderProps) {
  const logoImage = logoDark;

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={["#8B5CF6", "#F87171"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.logoContainer}>
          <Image source={logoImage} style={styles.logo} resizeMode="contain" />
        </View>
        <TouchableOpacity style={styles.pointsContainer}>
          <FontAwesome
            name="gift"
            size={20}
            color="#FFFFFF"
            style={styles.icon}
          />
          <ThemedText style={styles.pointsValue}>{points} pts</ThemedText>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
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
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  icon: {
    marginRight: 8,
  },
  pointsValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
