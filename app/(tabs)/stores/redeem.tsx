import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "../../../components/themed-text";

export default function RedeemScreen() {
  const params = useLocalSearchParams();
  const {
    voucherUuid,
    promotionTitle,
    promotionIcon,
    promotionPoints,
    promotionDescription,
    expiresAt,
    status,
    storeName,
  } = params;

  const [timeRemaining, setTimeRemaining] = useState("");

  const expirationDate = expiresAt ? new Date(expiresAt as string) : null;

  useEffect(() => {
    const updateTime = () => {
      if (!expirationDate) return;

      const now = new Date();
      const diff = expirationDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining("Expirado");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h ${minutes}min`);
      } else {
        setTimeRemaining(`${hours}h ${minutes}min`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const qrCodeData = voucherUuid
    ? JSON.stringify({
      voucherUuid,
      issuedAt: new Date().toISOString(),
    })
    : "";

  const formattedExpiry = expirationDate
    ? expirationDate.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    : "";

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="light" />
      {/* Header */}
      <LinearGradient
        colors={["#8B5CF6", "#F87171"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity
          onPress={() => router.push("/(tabs)")}
          style={styles.backButton}
        >
          <FontAwesome name="arrow-left" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Voucher Gerado</ThemedText>
        <View style={styles.headerRight} />
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon */}
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <FontAwesome name="check-circle" size={60} color="#10B981" />
          </View>
          <ThemedText style={styles.successTitle}>Cupom Resgatado!</ThemedText>
          <ThemedText style={styles.successMessage}>
            Apresente este QR Code no estabelecimento
          </ThemedText>
        </View>

        {/* Coupon Info */}
        <View style={styles.infoCard}>
          <View style={styles.iconContainer}>
            <MaterialIcons
              name={(promotionIcon as any) || "local-offer"}
              size={32}
              color="#8B5CF6"
            />
          </View>
          <ThemedText style={styles.couponName}>{promotionTitle}</ThemedText>
          <ThemedText style={styles.storeName}>{storeName}</ThemedText>

          {promotionDescription ? (
            <ThemedText style={styles.couponDescription}>
              {promotionDescription}
            </ThemedText>
          ) : null}

          <View style={styles.pointsUsed}>
            <FontAwesome name="gift" size={14} color="#8B5CF6" />
            <ThemedText style={styles.pointsText}>
              -{promotionPoints} emotions
            </ThemedText>
          </View>

          {status ? (
            <View style={styles.statusBadge}>
              <MaterialIcons name="info" size={13} color="#059669" />
              <ThemedText style={styles.statusText}>
                Status: {status}
              </ThemedText>
            </View>
          ) : null}
        </View>

        {/* QR Code */}
        <View style={styles.qrContainer}>
          <View style={styles.qrCodeWrapper}>
            {qrCodeData ? (
              <QRCode value={qrCodeData} size={220} />
            ) : (
              <View style={styles.qrPlaceholder}>
                <FontAwesome name="qrcode" size={100} color="#CCCCCC" />
              </View>
            )}
          </View>

          {/* Expiration Info */}
          <View style={styles.expirationCard}>
            <View style={styles.expirationRow}>
              <FontAwesome name="clock-o" size={16} color="#F59E0B" />
              <ThemedText style={styles.expirationLabel}>
                Válido por:
              </ThemedText>
              <ThemedText style={styles.expirationTime}>
                {timeRemaining || formattedExpiry}
              </ThemedText>
            </View>
            {formattedExpiry ? (
              <ThemedText style={styles.expirationDate}>
                Expira em {formattedExpiry}
              </ThemedText>
            ) : null}
            <ThemedText style={styles.expirationNote}>
              Use apenas uma vez • Não é reembolsável
            </ThemedText>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <ThemedText style={styles.instructionsTitle}>
            Como usar este cupom
          </ThemedText>

          <View style={styles.instructionsList}>
            {[
              "Vá até o estabelecimento parceiro",
              "Mostre este QR Code ao atendente",
              "O atendente irá escanear o código",
              "Aproveite seu benefício!",
            ].map((step, i) => (
              <View style={styles.instructionItem} key={i}>
                <View style={styles.instructionNumber}>
                  <ThemedText style={styles.instructionNumberText}>
                    {i + 1}
                  </ThemedText>
                </View>
                <ThemedText style={styles.instructionText}>{step}</ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* Warning */}
        <View style={styles.warningCard}>
          <FontAwesome name="exclamation-triangle" size={20} color="#F59E0B" />
          <ThemedText style={styles.warningText}>
            Este cupom pode ser usado apenas uma vez e expira na data indicada.
            Após o uso, ele será automaticamente removido.
          </ThemedText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8B5CF6",
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
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  successContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  successIcon: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F5F3FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  couponName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
  },
  storeName: {
    fontSize: 15,
    color: "#666666",
  },
  couponDescription: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 19,
    paddingHorizontal: 8,
  },
  pointsUsed: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F3FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8B5CF6",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    color: "#059669",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  qrContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  qrCodeWrapper: {
    backgroundColor: "#FFFFFF",
    padding: 30,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  qrPlaceholder: {
    width: 220,
    height: 220,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  expirationCard: {
    backgroundColor: "#FFF7ED",
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#FED7AA",
    gap: 6,
  },
  expirationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  expirationLabel: {
    fontSize: 14,
    color: "#92400E",
  },
  expirationTime: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#92400E",
  },
  expirationDate: {
    fontSize: 12,
    color: "#92400E",
    fontWeight: "500",
  },
  expirationNote: {
    fontSize: 12,
    color: "#92400E",
    textAlign: "center",
  },
  instructionsCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 16,
  },
  instructionsList: {
    gap: 16,
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F5F3FF",
    justifyContent: "center",
    alignItems: "center",
  },
  instructionNumberText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#8B5CF6",
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
    paddingTop: 4,
  },
  warningCard: {
    flexDirection: "row",
    backgroundColor: "#FFF7ED",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FED7AA",
    gap: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: "#92400E",
    lineHeight: 20,
  },
});
