import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "../../../components/themed-text";

type TransactionType = "all" | "earn" | "redeem";

interface Transaction {
  id: string;
  type: "earn" | "redeem";
  amount: number;
  description: string;
  date: string;
  dateSort: Date;
}

export default function StatementScreen() {
  const [startDate, setStartDate] = useState("08/11/2024"); // 3 meses atrás
  const [endDate, setEndDate] = useState("08/02/2025"); // hoje
  const [filterType, setFilterType] = useState<TransactionType>("all");

  // Mock de transações
  const allTransactions: Transaction[] = [
    {
      id: "1",
      type: "earn",
      amount: 50,
      description: "Check-in realizado",
      date: "08/02/2025",
      dateSort: new Date("2025-02-08"),
    },
    {
      id: "2",
      type: "earn",
      amount: 50,
      description: "Check-in realizado",
      date: "07/02/2025",
      dateSort: new Date("2025-02-07"),
    },
    {
      id: "3",
      type: "redeem",
      amount: -30,
      description: "Café grátis - Starbucks",
      date: "05/02/2025",
      dateSort: new Date("2025-02-05"),
    },
    {
      id: "4",
      type: "earn",
      amount: 50,
      description: "Check-in realizado",
      date: "04/02/2025",
      dateSort: new Date("2025-02-04"),
    },
    {
      id: "5",
      type: "earn",
      amount: 50,
      description: "Check-in realizado",
      date: "03/02/2025",
      dateSort: new Date("2025-02-03"),
    },
    {
      id: "6",
      type: "redeem",
      amount: -100,
      description: "20% de desconto - iFood",
      date: "01/02/2025",
      dateSort: new Date("2025-02-01"),
    },
    {
      id: "7",
      type: "earn",
      amount: 50,
      description: "Check-in realizado",
      date: "31/01/2025",
      dateSort: new Date("2025-01-31"),
    },
    {
      id: "8",
      type: "earn",
      amount: 50,
      description: "Check-in realizado",
      date: "30/01/2025",
      dateSort: new Date("2025-01-30"),
    },
  ];

  // Filtrar transações
  const filteredTransactions = allTransactions.filter((transaction) => {
    if (filterType === "earn") return transaction.type === "earn";
    if (filterType === "redeem") return transaction.type === "redeem";
    return true; // "all"
  });

  // Calcular total
  const totalEarned = filteredTransactions
    .filter((t) => t.type === "earn")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRedeemed = Math.abs(
    filteredTransactions
      .filter((t) => t.type === "redeem")
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const balance = totalEarned - totalRedeemed;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <LinearGradient
        colors={["#8B5CF6", "#F87171"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <FontAwesome name="arrow-left" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Extrato</ThemedText>
        <View style={styles.headerRight} />
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Card de resumo */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <ThemedText style={styles.summaryLabel}>Entradas</ThemedText>
              <ThemedText style={styles.summaryValueGreen}>
                +{totalEarned}
              </ThemedText>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <ThemedText style={styles.summaryLabel}>Saídas</ThemedText>
              <ThemedText style={styles.summaryValueRed}>
                -{totalRedeemed}
              </ThemedText>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <ThemedText style={styles.summaryLabel}>Saldo</ThemedText>
              <ThemedText style={styles.summaryValuePurple}>
                {balance}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Card de filtros */}
        <View style={styles.filtersCard}>
          <ThemedText style={styles.filtersTitle}>Filtros</ThemedText>

          {/* Filtro de datas */}
          <View style={styles.dateFilters}>
            <View style={styles.dateInputGroup}>
              <ThemedText style={styles.dateLabel}>Data Inicial</ThemedText>
              <View style={styles.dateInputContainer}>
                <FontAwesome
                  name="calendar"
                  size={14}
                  color="#999999"
                  style={styles.dateIcon}
                />
                <TextInput
                  style={styles.dateInput}
                  value={startDate}
                  onChangeText={setStartDate}
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor="#CCCCCC"
                  keyboardType="numeric"
                  maxLength={10}
                />
              </View>
            </View>

            <View style={styles.dateInputGroup}>
              <ThemedText style={styles.dateLabel}>Data Final</ThemedText>
              <View style={styles.dateInputContainer}>
                <FontAwesome
                  name="calendar"
                  size={14}
                  color="#999999"
                  style={styles.dateIcon}
                />
                <TextInput
                  style={styles.dateInput}
                  value={endDate}
                  onChangeText={setEndDate}
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor="#CCCCCC"
                  keyboardType="numeric"
                  maxLength={10}
                />
              </View>
            </View>
          </View>

          {/* Filtro por tipo */}
          <View style={styles.typeFilters}>
            <ThemedText style={styles.typeLabel}>
              Tipo de Movimentação
            </ThemedText>
            <View style={styles.typeButtons}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  filterType === "all" && styles.typeButtonActive,
                ]}
                onPress={() => setFilterType("all")}
                activeOpacity={0.7}
              >
                <ThemedText
                  style={[
                    styles.typeButtonText,
                    filterType === "all" && styles.typeButtonTextActive,
                  ]}
                >
                  Todas
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  filterType === "earn" && styles.typeButtonActive,
                ]}
                onPress={() => setFilterType("earn")}
                activeOpacity={0.7}
              >
                <ThemedText
                  style={[
                    styles.typeButtonText,
                    filterType === "earn" && styles.typeButtonTextActive,
                  ]}
                >
                  Entradas
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  filterType === "redeem" && styles.typeButtonActive,
                ]}
                onPress={() => setFilterType("redeem")}
                activeOpacity={0.7}
              >
                <ThemedText
                  style={[
                    styles.typeButtonText,
                    filterType === "redeem" && styles.typeButtonTextActive,
                  ]}
                >
                  Saídas
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Lista de transações */}
        <View style={styles.transactionsCard}>
          <ThemedText style={styles.transactionsTitle}>
            Movimentações ({filteredTransactions.length})
          </ThemedText>

          {filteredTransactions.length === 0 ? (
            <View style={styles.emptyState}>
              <FontAwesome name="inbox" size={48} color="#CCCCCC" />
              <ThemedText style={styles.emptyText}>
                Nenhuma movimentação encontrada
              </ThemedText>
            </View>
          ) : (
            <View style={styles.transactionsList}>
              {filteredTransactions.map((transaction, index) => (
                <View
                  key={transaction.id}
                  style={[
                    styles.transactionItem,
                    index === filteredTransactions.length - 1 &&
                      styles.transactionItemLast,
                  ]}
                >
                  <View style={styles.transactionLeft}>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#E5E7EB",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 8,
  },
  summaryValueGreen: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#10B981",
  },
  summaryValueRed: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#EF4444",
  },
  summaryValuePurple: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#8B5CF6",
  },
  filtersCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 16,
  },
  dateFilters: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  dateInputGroup: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666666",
    marginBottom: 8,
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dateIcon: {
    marginRight: 8,
  },
  dateInput: {
    flex: 1,
    fontSize: 14,
    color: "#000000",
  },
  typeFilters: {},
  typeLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666666",
    marginBottom: 8,
  },
  typeButtons: {
    flexDirection: "row",
    gap: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F8F9FA",
    alignItems: "center",
  },
  typeButtonActive: {
    backgroundColor: "#8B5CF6",
    borderColor: "#8B5CF6",
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666666",
  },
  typeButtonTextActive: {
    color: "#FFFFFF",
  },
  transactionsCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  transactionsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 16,
  },
  transactionsList: {
    gap: 12,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  transactionItemLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  transactionLeft: {
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
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: "#999999",
    marginTop: 16,
  },
});
