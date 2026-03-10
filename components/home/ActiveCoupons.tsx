import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { getVouchers, Voucher } from "../../services/api";
import { ThemedText } from "../themed-text";

export function ActiveCoupons() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVouchers();
  }, []);

  const loadVouchers = async () => {
    try {
      setLoading(true);
      const data = await getVouchers();
      // Only show active (non-expired) vouchers
      const active = data.vouchers.filter((v) => {
        if (v.status === "used") return false;
        return new Date(v.expires_at) > new Date();
      });
      setVouchers(active);
    } catch (error) {
      console.error("Erro ao carregar vouchers:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();

    if (diff <= 0) return "Expirado";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h restantes`;
  };

  const handleVoucherPress = (voucher: Voucher) => {
    router.push({
      pathname: "/(tabs)/stores/redeem",
      params: {
        voucherUuid: voucher.uuid,
        promotionTitle: voucher.promotion_title,
        promotionIcon: voucher.promotion_icon.replace('_', '-'),
        promotionPoints: voucher.promotion_points,
        promotionDescription: voucher.promotion_description,
        expiresAt: voucher.expires_at,
        status: voucher.status,
        storeName: voucher.partner_company.name,
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#8B5CF6" />
      </View>
    );
  }

  if (vouchers.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <FontAwesome name="ticket" size={20} color="#8B5CF6" />
          <ThemedText style={styles.title}>Meus Cupons Ativos</ThemedText>
        </View>
        <View style={styles.badge}>
          <ThemedText style={styles.badgeText}>{vouchers.length}</ThemedText>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {vouchers.map((voucher) => (
          <TouchableOpacity
            key={voucher.uuid}
            style={styles.couponCard}
            onPress={() => handleVoucherPress(voucher)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#8B5CF6", "#F87171"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradient}
            >
              {/* Active indicator */}
              <View style={styles.pulseIndicator}>
                <View style={styles.pulseOuter}>
                  <View style={styles.pulseInner} />
                </View>
              </View>

              <View style={styles.cardContent}>
                <View style={styles.iconContainer}>
                  <MaterialIcons
                    name={(voucher.promotion_icon.replace('_', '-') as any) || "local-offer"}
                    size={36}
                    color="#FFFFFF"
                  />
                </View>

                <ThemedText style={styles.couponName} numberOfLines={2}>
                  {voucher.promotion_title}
                </ThemedText>
                <ThemedText style={styles.storeName} numberOfLines={1}>
                  {voucher.partner_company.name}
                </ThemedText>

                <View style={styles.expiryBadge}>
                  <FontAwesome name="clock-o" size={10} color="#FFF" />
                  <ThemedText style={styles.expiryText}>
                    {getTimeRemaining(voucher.expires_at)}
                  </ThemedText>
                </View>

                <View style={styles.tapHint}>
                  <FontAwesome name="hand-pointer-o" size={12} color="#FFF" />
                  <ThemedText style={styles.tapHintText}>
                    Toque para usar
                  </ThemedText>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
  },
  badge: {
    backgroundColor: "#EF4444",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  couponCard: {
    width: 180,
    height: 220,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  gradient: {
    flex: 1,
    padding: 16,
    position: "relative",
  },
  pulseIndicator: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  pulseOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  pulseInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
  },
  cardContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  iconContainer: {
    alignSelf: "center",
    marginTop: 8,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  couponName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 20,
  },
  storeName: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
  expiryBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  expiryText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  tapHint: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 4,
  },
  tapHintText: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.8)",
  },
});
