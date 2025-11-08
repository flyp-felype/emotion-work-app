import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActionButtons } from "../../components/home/ActionButtons";
import { ActiveCoupons } from "../../components/home/ActiveCoupons";
import { AnnouncementsBoard } from "../../components/home/AnnouncementsBoard";
import { HomeHeader } from "../../components/home/HomeHeader";
import { PointsHistory } from "../../components/home/PointsHistory";
import { RedeemableProductsCarousel } from "../../components/home/RedeemableProductsCarousel";
import { UserGreetingCard } from "../../components/home/UserGreetingCard";
export default function HomeScreen() {
  const activeCoupons = [
    {
      id: "redeem-1",
      couponId: "1",
      storeId: "1",
      storeName: "Starbucks Centro",
      couponName: "Café Grátis",
      couponPoints: 50,
      expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 dias
      used: false,
    },
    {
      id: "redeem-2",
      couponId: "2",
      storeId: "2",
      storeName: "McDonald's",
      couponName: "Lanche Grátis",
      couponPoints: 150,
      expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 5 dias
      used: false,
    },
  ];

  const handleCheckIn = () => {
    console.log("Check-in realizado");
  };

  const handleRedeemPoints = () => {
    console.log("Resgatar pontos");
  };

  const handleViewAllTransactions = () => {
    router.push("/(tabs)/statement/statement");
  };

  const handleRedeemProduct = (product: any) => {
    console.log("Resgatar produto:", product);
  };

  const handleViewAllProducts = () => {
    router.push("/(tabs)/stores/list");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <LinearGradient colors={["#F8F9FA", "#FFFFFF"]} style={styles.gradient}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <HomeHeader points={150} />

          <View style={[styles.section, styles.sectionSecondary]}>
            <UserGreetingCard
              name="João Silva"
              consecutiveDays={5}
              accumulatedPoints={150}
            />
          </View>

          <View>
            <ActiveCoupons coupons={activeCoupons} />
          </View>

          <View style={styles.section}>
            <ActionButtons
              onCheckIn={handleCheckIn}
              onRedeemPoints={handleRedeemPoints}
            />
          </View>

          <View style={styles.section}>
            <RedeemableProductsCarousel
              products={[]}
              onRedeem={handleRedeemProduct}
              onViewAll={handleViewAllProducts}
              userPoints={150}
            />
          </View>

          <View style={styles.section}>
            <PointsHistory
              transactions={[]}
              onViewAll={handleViewAllTransactions}
            />
          </View>

          <View style={styles.section}>
            <AnnouncementsBoard />
          </View>
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
