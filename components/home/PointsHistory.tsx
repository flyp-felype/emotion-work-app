import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";

interface PointsHistoryProps {
  transactions: {
    id: string;
    type: "earn" | "redeem";
    amount: number;
    description: string;
    date: string;
  }[];
  onViewAll: () => void;
}

export function PointsHistory({ transactions, onViewAll }: PointsHistoryProps) {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Últimas Movimentações</ThemedText>
      {transactions.length === 0 ? (
        <ThemedText style={styles.emptyText}>
          Nenhuma movimentação recente
        </ThemedText>
      ) : (
        <View style={styles.listContainer}>
          {transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionDetails}>
                <ThemedText style={styles.transactionDescription}>
                  {transaction.description}
                </ThemedText>
                <ThemedText style={styles.transactionDate}>
                  {transaction.date}
                </ThemedText>
              </View>
              <LinearGradient
                colors={
                  transaction.type === "earn"
                    ? ["#8B5CF6", "#F87171"]
                    : ["#EF4444", "#F87171"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.pointsBadge}
              >
                <FontAwesome name="gift" size={12} color="#FFFFFF" />
                <ThemedText style={styles.badgeText}>
                  {transaction.type === "earn" ? "+" : ""}
                  {transaction.amount}
                </ThemedText>
              </LinearGradient>
            </View>
          ))}
        </View>
      )}
      <TouchableOpacity style={styles.viewAllButton} onPress={onViewAll}>
        <ThemedText style={styles.viewAllText}>Ver Extrato Completo</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#000000",
  },
  listContainer: {
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: "#999999",
    paddingVertical: 12,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000000",
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: "#999999",
  },
  pointsBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  viewAllButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8B5CF6",
  },
});
