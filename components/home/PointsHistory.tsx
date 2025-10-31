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
  const mockTransactions = [
    {
      id: "1",
      type: "earn",
      amount: 50,
      description: "Checkin realizado",
      date: "Hoje, 09:00",
    },
    {
      id: "2",
      type: "earn",
      amount: 50,
      description: "Checkin realizado",
      date: "Ontem, 08:30",
    },
    {
      id: "3",
      type: "redeem",
      amount: -30,
      description: "Prêmio resgatado",
      date: "15/01/2025, 14:00",
    },
    {
      id: "4",
      type: "earn",
      amount: 50,
      description: "Checkin realizado",
      date: "14/01/2025, 08:15",
    },
    {
      id: "5",
      type: "earn",
      amount: 50,
      description: "Checkin realizado",
      date: "13/01/2025, 08:00",
    },
  ];

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Últimas Movimentações</ThemedText>
      <View style={styles.listContainer}>
        {mockTransactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionItem}>
            <View style={styles.transactionIcon}>
              <ThemedText style={styles.iconText}>
                {transaction.type === "earn" ? "➕" : "➖"}
              </ThemedText>
            </View>
            <View style={styles.transactionDetails}>
              <ThemedText style={styles.transactionDescription}>
                {transaction.description}
              </ThemedText>
              <ThemedText style={styles.transactionDate}>
                {transaction.date}
              </ThemedText>
            </View>
            <ThemedText
              style={[
                styles.transactionAmount,
                transaction.type === "earn"
                  ? styles.earnAmount
                  : styles.redeemAmount,
              ]}
            >
              {transaction.type === "earn" ? "+" : ""}
              {transaction.amount} pts
            </ThemedText>
          </View>
        ))}
      </View>
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
  transactionAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
  earnAmount: {
    color: "#10B981",
  },
  redeemAmount: {
    color: "#EF4444",
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
