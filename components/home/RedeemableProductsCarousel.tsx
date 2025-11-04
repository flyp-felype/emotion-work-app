import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "../themed-text";

interface Product {
  id: string;
  name: string;
  companyName: string;
  description?: string;
  points: number;
  image?: string;
  icon?: string;
}

interface RedeemableProductsCarouselProps {
  products: Product[];
  onRedeem: (product: Product) => void;
  onViewAll?: () => void;
  userPoints: number;
}

export function RedeemableProductsCarousel({
  products = [],
  onRedeem,
  onViewAll,
  userPoints = 150,
}: RedeemableProductsCarouselProps) {
  // Dados mockados caso não seja passado produtos
  const defaultProducts: Product[] = [
    {
      id: "2",
      name: "Café grátis",
      companyName: "Café do Ponto",
      points: 80,
      icon: "coffee",
    },
    {
      id: "1",
      name: "20% de desconto",
      companyName: "Starbucks",
      points: 200,
      icon: "percent",
    },
    {
      id: "3",
      name: "R$ 50 de desconto",
      companyName: "iFood",
      points: 150,
      icon: "cutlery",
    },
    {
      id: "4",
      name: "Frete grátis",
      companyName: "Amazon",
      points: 100,
      icon: "truck",
    },
  ];

  const displayProducts = products.length > 0 ? products : defaultProducts;

  const canRedeem = (productPoints: number) => {
    return userPoints >= productPoints;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome
          name="gift"
          size={20}
          color="#8B5CF6"
          style={styles.titleIcon}
        />
        <ThemedText style={styles.title}>Recompensas em Destaque</ThemedText>
      </View>

      <View style={styles.contentWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          decelerationRate="fast"
        >
          {displayProducts.map((product) => {
            const canRedeemProduct = canRedeem(product.points);

            return (
              <TouchableOpacity
                key={product.id}
                style={[styles.card, !canRedeemProduct && styles.cardDisabled]}
                onPress={() => canRedeemProduct && onRedeem(product)}
                disabled={!canRedeemProduct}
                activeOpacity={0.8}
              >
                <View style={styles.cardLeft}>
                  <ThemedText style={styles.companyName}>
                    {product.companyName}
                  </ThemedText>
                  <ThemedText style={styles.productName} numberOfLines={2}>
                    {product.name}
                  </ThemedText>
                  <LinearGradient
                    colors={["#8B5CF6", "#F87171"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                      styles.pointsBadge,
                      !canRedeemProduct && styles.badgeDisabled,
                    ]}
                  >
                    <FontAwesome name="gift" size={10} color="#FFFFFF" />
                    <ThemedText style={styles.badgeText}>
                      {product.points} pts
                    </ThemedText>
                  </LinearGradient>

                  {!canRedeemProduct && (
                    <ThemedText style={styles.insufficientText}>
                      Pontos insuficientes
                    </ThemedText>
                  )}
                </View>

                <View style={styles.cardRight}>
                  {product.icon ? (
                    <View style={styles.iconContainer}>
                      <FontAwesome
                        name={product.icon as any}
                        size={32}
                        color={canRedeemProduct ? "#8B5CF6" : "#CCCCCC"}
                      />
                    </View>
                  ) : product.image ? (
                    <Image
                      source={{ uri: product.image }}
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.iconContainer}>
                      <FontAwesome
                        name="image"
                        size={32}
                        color={canRedeemProduct ? "#8B5CF6" : "#CCCCCC"}
                      />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {onViewAll && (
          <TouchableOpacity style={styles.viewAllButton} onPress={onViewAll}>
            <ThemedText style={styles.viewAllText}>
              Ver Todas as Recompensas
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  titleIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
  },
  contentWrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scrollContent: {
    gap: 12,
    paddingBottom: 4,
    paddingRight: 16,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    width: Dimensions.get("window").width - 150, // 20 margin + 16 padding de cada lado
    marginRight: 12,
  },
  cardDisabled: {
    opacity: 0.6,
  },
  cardLeft: {
    flex: 1,
    paddingRight: 12,
    justifyContent: "center",
  },
  companyName: {
    fontSize: 12,
    color: "#999999",
    marginBottom: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
  },
  pointsBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  badgeDisabled: {
    opacity: 0.5,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  insufficientText: {
    fontSize: 10,
    color: "#EF4444",
    marginTop: 4,
    fontWeight: "500",
  },
  cardRight: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  viewAllButton: {
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8B5CF6",
  },
});
