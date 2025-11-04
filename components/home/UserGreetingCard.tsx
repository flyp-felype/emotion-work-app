import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useThemeColor } from "../../hooks/use-theme-color";
import { ThemedText } from "../themed-text";

interface UserGreetingCardProps {
  name: string;
  consecutiveDays: number;
  accumulatedPoints: number;
}

export function UserGreetingCard({
  name = "Funcionário",
  consecutiveDays = 5,
  accumulatedPoints = 150,
}: UserGreetingCardProps) {
  const iconColor = useThemeColor({}, "icon");

  return (
    <View style={styles.container}>
      <ThemedText style={styles.greeting}>Olá, {name}!</ThemedText>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <FontAwesome
            name="calendar"
            size={15}
            color={iconColor}
            style={styles.statIcon}
          />
          <ThemedText style={styles.statText}>
            {consecutiveDays} dias consecutivos
          </ThemedText>
        </View>
        <View style={styles.statItem}>
          <FontAwesome
            name="bar-chart"
            size={15}
            color={iconColor}
            style={styles.statIcon}
          />
          <ThemedText style={styles.statText}>
            {accumulatedPoints} pontos acumulados
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#000000",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statIcon: {
    marginRight: 3,
  },
  statText: {
    fontSize: 12,
    color: "#666666",
  },
});
