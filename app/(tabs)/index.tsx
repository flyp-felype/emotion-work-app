import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActionButtons } from "../../components/home/ActionButtons";
import { ActiveCoupons } from "../../components/home/ActiveCoupons";
import { HomeHeader } from "../../components/home/HomeHeader";
import { PointsHistory } from "../../components/home/PointsHistory";
import { RedeemableProductsCarousel } from "../../components/home/RedeemableProductsCarousel";
import { UserGreetingCard } from "../../components/home/UserGreetingCard";
import {
  getMe,
  getPartnerPromotions,
  MeResponse,
  Promotion,
} from "../../services/api";

export default function HomeScreen() {
  const [meData, setMeData] = useState<MeResponse | null>(null);
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      const loadData = async () => {
        try {
          const [meResponse, promotionsResponse] = await Promise.all([
            getMe(),
            getPartnerPromotions(true),
          ]);

          if (isMounted) {
            setMeData(meResponse);
            setPromotions(promotionsResponse.promotions);
          }
        } catch (error) {
          console.error("Erro ao carregar dados", error);
        }
      };

      loadData();

      return () => {
        isMounted = false;
      };
    }, [])
  );

  const handleCheckIn = () => {
    router.push("/(tabs)/redeem");
  };

  const handleRedeemPoints = () => {
    router.push("/(tabs)/stores/list");
  };

  const handleViewAllTransactions = () => {
    router.push("/(tabs)/statement/statement");
  };

  const handleRedeemProduct = (product: any) => {
    router.push({
      pathname: "/(tabs)/stores/promotion-detail",
      params: {
        promotionId: product.uuid,
        userPoints: meData?.balance ?? 0,
      },
    });
  };

  const handleViewAllProducts = () => {
    router.push("/(tabs)/stores/list");
  };

  const formattedTransactions =
    meData?.transactions.map((transaction) => ({
      id: transaction.id,
      transaction_type: transaction.transaction_type,
      points: transaction.points,
      description: transaction.description,
      date: new Date(transaction.created_at).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    })) ?? [];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <LinearGradient colors={["#F8F9FA", "#FFFFFF"]} style={styles.gradient}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <HomeHeader points={meData?.balance ?? 0} />

          <View style={[styles.section, styles.sectionSecondary]}>
            <UserGreetingCard
              name={meData?.employee.name ?? "Funcionário"}
              consecutiveDays={meData?.consecutive_days ?? 0}
              totalCheckins={meData?.total_checkins ?? 0}
            />
          </View>

          <View>
            <ActiveCoupons />
          </View>

          <View style={styles.section}>
            <ActionButtons
              onCheckIn={handleCheckIn}
              onRedeemPoints={handleRedeemPoints}
            />
          </View>

          <View style={styles.section}>
            <RedeemableProductsCarousel
              products={promotions}
              onRedeem={handleRedeemProduct}
              onViewAll={handleViewAllProducts}
              userPoints={meData?.balance ?? 0}
            />
          </View>

          <View style={styles.section}>
            <PointsHistory
              transactions={formattedTransactions}
              onViewAll={handleViewAllTransactions}
            />
          </View>

          {/* <View style={styles.section}>
            <AnnouncementsBoard />
          </View> */}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 10,
  },
  sectionPrimary: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 0,
    paddingVertical: 8,
  },
  sectionSecondary: {
    backgroundColor: "#F8F9FA",
    marginHorizontal: 0,
    paddingVertical: 8,
  },
});
