import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActionButtons } from "../../components/home/ActionButtons";
import { AnnouncementsBoard } from "../../components/home/AnnouncementsBoard";
import { HomeHeader } from "../../components/home/HomeHeader";
import { PointsHistory } from "../../components/home/PointsHistory";
import { RedeemableProductsCarousel } from "../../components/home/RedeemableProductsCarousel";
import { UserGreetingCard } from "../../components/home/UserGreetingCard";

export default function HomeScreen() {
  const handleCheckIn = () => {
    console.log("Check-in realizado");
  };

  const handleRedeemPoints = () => {
    console.log("Resgatar pontos");
  };

  const handleViewAllTransactions = () => {
    console.log("Ver extrato completo");
  };

  const handleRedeemProduct = (product: any) => {
    console.log("Resgatar produto:", product);
  };

  const handleViewAllProducts = () => {
    console.log("Ver todos os produtos");
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
    marginBottom: 16,
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
