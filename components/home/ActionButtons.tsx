import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";

interface ActionButtonsProps {
  onCheckIn: () => void;
  onRedeemPoints: () => void;
}

export function ActionButtons({
  onCheckIn,
  onRedeemPoints,
}: ActionButtonsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.checkInButton}
        onPress={onCheckIn}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={["#8B5CF6", "#F87171"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <ThemedText style={styles.checkInText}>Fazer Check-in</ThemedText>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.redeemButton}
        onPress={onRedeemPoints}
        activeOpacity={0.8}
      >
        <ThemedText style={styles.redeemText}>Resgatar Pontos</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  checkInButton: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  checkInText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  redeemButton: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  redeemText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
});
