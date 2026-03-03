import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "../../../components/themed-text";
import {
  TransactionItem,
  TransactionSummary,
  TransactionsParams,
  getTransactions,
} from "../../../services/api";

// ── Types ─────────────────────────────────────────────────────────────────────

type FilterType = "all" | "checkin" | "checkout";

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Convert DD/MM/YYYY → YYYY-MM-DD for the API */
function toApiDate(ddmmyyyy: string): string | undefined {
  const parts = ddmmyyyy.split("/");
  if (parts.length !== 3 || parts[2].length !== 4) return undefined;
  return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
}

/** Format ISO date to DD/MM/YYYY HH:MM */
function formatDate(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}

const PAGE_SIZE = 10;

// ── Component ─────────────────────────────────────────────────────────────────

export default function StatementScreen() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");

  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [summary, setSummary] = useState<TransactionSummary | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track applied filters (only sent after user taps Filtrar)
  const [appliedStart, setAppliedStart] = useState<string | undefined>();
  const [appliedEnd, setAppliedEnd] = useState<string | undefined>();
  const [appliedType, setAppliedType] = useState<FilterType>("all");

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const fetchData = useCallback(
    async (
      pageNum: number,
      start?: string,
      end?: string,
      type?: FilterType
    ) => {
      setLoading(true);
      setError(null);
      try {
        const params: TransactionsParams = { page: pageNum, page_size: PAGE_SIZE };
        if (start) params.start_date = start;
        if (end) params.end_date = end;
        if (type && type !== "all") params.transaction_type = type;

        const data = await getTransactions(params);
        setTransactions(data.transactions);
        setSummary(data.summary);
        setTotal(data.total);
        setPage(data.page);
      } catch (err: any) {
        setError("Erro ao carregar movimentações. Tente novamente.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Initial load – no filters
  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  const applyFilters = () => {
    const start = toApiDate(startDate);
    const end = toApiDate(endDate);
    setAppliedStart(start);
    setAppliedEnd(end);
    setAppliedType(filterType);
    fetchData(1, start, end, filterType);
  };

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setFilterType("all");
    setAppliedStart(undefined);
    setAppliedEnd(undefined);
    setAppliedType("all");
    fetchData(1);
  };

  const goToPage = (p: number) => {
    fetchData(p, appliedStart, appliedEnd, appliedType);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <LinearGradient
        colors={["#8B5CF6", "#F87171"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
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
        {/* Summary card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <ThemedText style={styles.summaryLabel}>Entradas</ThemedText>
              <ThemedText style={styles.summaryValueGreen}>
                +{summary?.total_checkin ?? 0}
              </ThemedText>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <ThemedText style={styles.summaryLabel}>Saídas</ThemedText>
              <ThemedText style={styles.summaryValueRed}>
                -{summary?.total_checkout ?? 0}
              </ThemedText>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <ThemedText style={styles.summaryLabel}>Saldo</ThemedText>
              <ThemedText style={styles.summaryValuePurple}>
                {summary?.balance ?? 0}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Filters card */}
        <View style={styles.filtersCard}>
          <ThemedText style={styles.filtersTitle}>Filtros</ThemedText>

          {/* Date filters */}
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

          {/* Type filter */}
          <View style={styles.typeFilters}>
            <ThemedText style={styles.typeLabel}>Tipo de Movimentação</ThemedText>
            <View style={styles.typeButtons}>
              {(["all", "checkin", "checkout"] as FilterType[]).map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.typeButton,
                    filterType === t && styles.typeButtonActive,
                  ]}
                  onPress={() => setFilterType(t)}
                  activeOpacity={0.7}
                >
                  <ThemedText
                    style={[
                      styles.typeButtonText,
                      filterType === t && styles.typeButtonTextActive,
                    ]}
                  >
                    {t === "all" ? "Todas" : t === "checkin" ? "Entradas" : "Saídas"}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Action buttons */}
          <View style={styles.filterActions}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearFilters}
              activeOpacity={0.7}
            >
              <ThemedText style={styles.clearButtonText}>Limpar</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={applyFilters}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={["#8B5CF6", "#F87171"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.applyButtonGradient}
              >
                <ThemedText style={styles.applyButtonText}>Filtrar</ThemedText>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Transactions card */}
        <View style={styles.transactionsCard}>
          <View style={styles.transactionsTitleRow}>
            <ThemedText style={styles.transactionsTitle}>
              Movimentações ({total})
            </ThemedText>
            {loading && <ActivityIndicator size="small" color="#8B5CF6" />}
          </View>

          {error ? (
            <View style={styles.emptyState}>
              <FontAwesome name="exclamation-circle" size={48} color="#EF4444" />
              <ThemedText style={styles.emptyText}>{error}</ThemedText>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => fetchData(page, appliedStart, appliedEnd, appliedType)}
              >
                <ThemedText style={styles.retryText}>Tentar novamente</ThemedText>
              </TouchableOpacity>
            </View>
          ) : !loading && transactions.length === 0 ? (
            <View style={styles.emptyState}>
              <FontAwesome name="inbox" size={48} color="#CCCCCC" />
              <ThemedText style={styles.emptyText}>
                Nenhuma movimentação encontrada
              </ThemedText>
            </View>
          ) : (
            <View style={styles.transactionsList}>
              {transactions.map((tx, index) => (
                <View
                  key={tx.uuid}
                  style={[
                    styles.transactionItem,
                    index === transactions.length - 1 && styles.transactionItemLast,
                  ]}
                >
                  <View style={styles.transactionLeft}>
                    <ThemedText style={styles.transactionDescription}>
                      {tx.description}
                    </ThemedText>
                    <ThemedText style={styles.transactionDate}>
                      {formatDate(tx.created_at)}
                    </ThemedText>
                  </View>

                  <LinearGradient
                    colors={
                      tx.transaction_type === "checkin"
                        ? ["#8B5CF6", "#F87171"]
                        : ["#EF4444", "#F87171"]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.pointsBadge}
                  >
                    <FontAwesome name="gift" size={12} color="#FFFFFF" />
                    <ThemedText style={styles.badgeText}>
                      {tx.transaction_type === "checkin" ? "+" : "-"}
                      {tx.points}
                    </ThemedText>
                  </LinearGradient>
                </View>
              ))}
            </View>
          )}

          {/* Pagination */}
          {!loading && total > PAGE_SIZE && (
            <View style={styles.pagination}>
              <TouchableOpacity
                style={[styles.pageButton, page === 1 && styles.pageButtonDisabled]}
                onPress={() => page > 1 && goToPage(page - 1)}
                disabled={page === 1}
                activeOpacity={0.7}
              >
                <FontAwesome
                  name="chevron-left"
                  size={14}
                  color={page === 1 ? "#CCCCCC" : "#8B5CF6"}
                />
              </TouchableOpacity>

              <ThemedText style={styles.pageInfo}>
                {page} / {totalPages}
              </ThemedText>

              <TouchableOpacity
                style={[styles.pageButton, page >= totalPages && styles.pageButtonDisabled]}
                onPress={() => page < totalPages && goToPage(page + 1)}
                disabled={page >= totalPages}
                activeOpacity={0.7}
              >
                <FontAwesome
                  name="chevron-right"
                  size={14}
                  color={page >= totalPages ? "#CCCCCC" : "#8B5CF6"}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

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
    shadowOffset: { width: 0, height: 3 },
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
  content: { flex: 1 },
  scrollContent: { paddingBottom: 40 },

  // Summary
  summaryCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryItem: { flex: 1, alignItems: "center" },
  summaryDivider: { width: 1, height: 40, backgroundColor: "#E5E7EB" },
  summaryLabel: { fontSize: 12, color: "#666666", marginBottom: 8 },
  summaryValueGreen: { fontSize: 20, fontWeight: "bold", color: "#10B981" },
  summaryValueRed: { fontSize: 20, fontWeight: "bold", color: "#EF4444" },
  summaryValuePurple: { fontSize: 20, fontWeight: "bold", color: "#8B5CF6" },

  // Filters
  filtersCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
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
  dateFilters: { flexDirection: "row", gap: 12, marginBottom: 20 },
  dateInputGroup: { flex: 1 },
  dateLabel: { fontSize: 12, fontWeight: "500", color: "#666666", marginBottom: 8 },
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
  dateIcon: { marginRight: 8 },
  dateInput: { flex: 1, fontSize: 14, color: "#000000" },
  typeFilters: { marginBottom: 20 },
  typeLabel: { fontSize: 12, fontWeight: "500", color: "#666666", marginBottom: 8 },
  typeButtons: { flexDirection: "row", gap: 8 },
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
  typeButtonActive: { backgroundColor: "#8B5CF6", borderColor: "#8B5CF6" },
  typeButtonText: { fontSize: 14, fontWeight: "500", color: "#666666" },
  typeButtonTextActive: { color: "#FFFFFF" },

  // Filter actions
  filterActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F8F9FA",
    alignItems: "center",
  },
  clearButtonText: { fontSize: 14, fontWeight: "600", color: "#666666" },
  applyButton: { flex: 2, borderRadius: 8, overflow: "hidden" },
  applyButtonGradient: {
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  applyButtonText: { fontSize: 14, fontWeight: "600", color: "#FFFFFF" },

  // Transactions
  transactionsCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  transactionsTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  transactionsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },
  transactionsList: { gap: 12 },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  transactionItemLast: { borderBottomWidth: 0, paddingBottom: 0 },
  transactionLeft: { flex: 1 },
  transactionDescription: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000000",
    marginBottom: 4,
  },
  transactionDate: { fontSize: 12, color: "#999999" },
  pointsBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: { fontSize: 12, fontWeight: "600", color: "#FFFFFF" },

  // Empty / error
  emptyState: { alignItems: "center", paddingVertical: 40 },
  emptyText: { fontSize: 14, color: "#999999", marginTop: 16 },
  retryButton: { marginTop: 12, paddingVertical: 8, paddingHorizontal: 20 },
  retryText: { fontSize: 14, color: "#8B5CF6", fontWeight: "600" },

  // Pagination
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    gap: 16,
  },
  pageButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  pageButtonDisabled: { borderColor: "#F0F0F0", backgroundColor: "#FAFAFA" },
  pageInfo: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    minWidth: 60,
    textAlign: "center",
  },
});
