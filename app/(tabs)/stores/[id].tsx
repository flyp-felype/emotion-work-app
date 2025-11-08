import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "../../../components/themed-text";

interface Coupon {
  id: string;
  name: string;
  description: string;
  points: number;
  available: boolean;
  validUntil: string;
}

export default function StoreDetailsScreen() {
  const { id } = useLocalSearchParams();
  const userPoints = 150; // Mock - pegar do contexto/estado global

  // Mock de dados da loja
  const store = {
    id: id as string,
    name: "Starbucks Centro",
    description:
      "Desfrute dos melhores cafés e bebidas especiais com seus emotions!",
    category: "Alimentação",
    distance: 0.5,
    address: "Av. Paulista, 1000 - São Paulo, SP",
    phone: "(11) 3000-0000",
    hours: "Seg-Sex: 7h-20h | Sáb-Dom: 8h-18h",
    icon: "coffee",
  };

  const coupons: Coupon[] = [
    {
      id: "1",
      name: "Café Grátis",
      description: "Qualquer café de tamanho médio",
      points: 50,
      available: true,
      validUntil: "31/12/2025",
    },
    {
      id: "2",
      name: "20% de Desconto",
      description: "Em qualquer produto da loja",
      points: 80,
      available: true,
      validUntil: "31/12/2025",
    },
    {
      id: "3",
      name: "Combo Café + Lanche",
      description: "Café médio + sanduíche à escolha",
      points: 120,
      available: true,
      validUntil: "31/12/2025",
    },
    {
      id: "4",
      name: "Bebida Premium Grátis",
      description: "Qualquer bebida especial tamanho grande",
      points: 200,
      available: false, // Usuário não tem pontos suficientes
      validUntil: "31/12/2025",
    },
  ];

  const handleRedeemCoupon = (coupon: Coupon) => {
    if (userPoints >= coupon.points) {
      router.push({
        pathname: "/(tabs)/stores/redeem",
        params: {
          storeId: store.id,
          storeName: store.name,
          couponId: coupon.id,
          couponName: coupon.name,
          couponPoints: coupon.points,
        },
      });
    }
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
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <FontAwesome name="arrow-left" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Detalhes da Loja</ThemedText>
        <TouchableOpacity style={styles.headerRight}>
          <FontAwesome name="heart-o" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Store Info Card */}
        <View style={styles.storeCard}>
          <View style={styles.storeIconContainer}>
            <FontAwesome name={store.icon as any} size={48} color="#8B5CF6" />
          </View>
          <ThemedText style={styles.storeName}>{store.name}</ThemedText>
          <ThemedText style={styles.storeCategory}>{store.category}</ThemedText>
          <ThemedText style={styles.storeDescription}>
            {store.description}
          </ThemedText>

          <View style={styles.storeDetails}>
            <View style={styles.detailRow}>
              <FontAwesome name="map-marker" size={16} color="#666666" />
              <ThemedText style={styles.detailText}>{store.address}</ThemedText>
            </View>
            <View style={styles.detailRow}>
              <FontAwesome name="phone" size={16} color="#666666" />
              <ThemedText style={styles.detailText}>{store.phone}</ThemedText>
            </View>
            <View style={styles.detailRow}>
              <FontAwesome name="clock-o" size={16} color="#666666" />
              <ThemedText style={styles.detailText}>{store.hours}</ThemedText>
            </View>
          </View>
        </View>

        {/* User Points Card */}
        <View style={styles.pointsCard}>
          <LinearGradient
            colors={["#8B5CF6", "#F87171"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.pointsGradient}
          >
            <ThemedText style={styles.pointsLabel}>Seus Emotions</ThemedText>
            <View style={styles.pointsRow}>
              <FontAwesome name="gift" size={20} color="#FFFFFF" />
              <ThemedText style={styles.pointsValue}>{userPoints}</ThemedText>
            </View>
          </LinearGradient>
        </View>

        {/* Coupons Section */}
        <View style={styles.couponsSection}>
          <ThemedText style={styles.sectionTitle}>
            Cupons Disponíveis ({coupons.length})
          </ThemedText>

          {coupons.map((coupon) => {
            const canRedeem = userPoints >= coupon.points;

            return (
              <View
                key={coupon.id}
                style={[
                  styles.couponCard,
                  !canRedeem && styles.couponCardDisabled,
                ]}
              >
                <View style={styles.couponLeft}>
                  <View style={styles.couponIconContainer}>
                    <FontAwesome
                      name="ticket"
                      size={24}
                      color={canRedeem ? "#8B5CF6" : "#CCCCCC"}
                    />
                  </View>
                  <View style={styles.couponInfo}>
                    <ThemedText
                      style={[
                        styles.couponName,
                        !canRedeem && styles.couponNameDisabled,
                      ]}
                    >
                      {coupon.name}
                    </ThemedText>
                    <ThemedText
                      style={[
                        styles.couponDescription,
                        !canRedeem && styles.couponDescriptionDisabled,
                      ]}
                    >
                      {coupon.description}
                    </ThemedText>
                    <ThemedText style={styles.couponValid}>
                      Válido até {coupon.validUntil}
                    </ThemedText>
                  </View>
                </View>

                <View style={styles.couponRight}>
                  <View style={styles.couponPointsBadge}>
                    <FontAwesome name="gift" size={10} color="#8B5CF6" />
                    <ThemedText style={styles.couponPoints}>
                      {coupon.points}
                    </ThemedText>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.redeemButton,
                      !canRedeem && styles.redeemButtonDisabled,
                    ]}
                    onPress={() => handleRedeemCoupon(coupon)}
                    disabled={!canRedeem}
                    activeOpacity={0.7}
                  >
                    <ThemedText
                      style={[
                        styles.redeemButtonText,
                        !canRedeem && styles.redeemButtonTextDisabled,
                      ]}
                    >
                      {"Resgatar"}
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
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
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  storeCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  storeIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F5F3FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  storeName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 4,
  },
  storeCategory: {
    fontSize: 14,
    color: "#8B5CF6",
    marginBottom: 12,
  },
  storeDescription: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  storeDetails: {
    width: "100%",
    gap: 12,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  detailText: {
    fontSize: 14,
    color: "#666666",
    flex: 1,
  },
  pointsCard: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pointsGradient: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pointsLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  pointsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pointsValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  couponsSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  couponCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  couponCardDisabled: {
    opacity: 0.6,
  },
  couponLeft: {
    flexDirection: "row",
    flex: 1,
    marginRight: 12,
  },
  couponIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F5F3FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  couponInfo: {
    flex: 1,
  },
  couponName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  couponNameDisabled: {
    color: "#999999",
  },
  couponDescription: {
    fontSize: 13,
    color: "#666666",
    marginBottom: 4,
  },
  couponDescriptionDisabled: {
    color: "#CCCCCC",
  },
  couponValid: {
    fontSize: 11,
    color: "#999999",
  },
  couponRight: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  couponPointsBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F3FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  couponPoints: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8B5CF6",
  },
  redeemButton: {
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  redeemButtonDisabled: {
    backgroundColor: "#E5E7EB",
  },
  redeemButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  redeemButtonTextDisabled: {
    color: "#999999",
  },
});
