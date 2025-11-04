import { FontAwesome } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useThemeColor } from "../../hooks/use-theme-color";
import { ThemedText } from "../themed-text";

interface Product {
  id: string;
  name: string;
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
  const scrollViewRef = useRef<ScrollView>(null);
  const iconColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");

  const [scrollX, setScrollX] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Dados mockados caso não seja passado produtos
  const defaultProducts: Product[] = [
    {
      id: "1",
      name: "Vale-refeição",
      description: "R$ 50,00",
      points: 200,
      icon: "cutlery",
    },
    {
      id: "3",
      name: "Vale-presente",
      description: "R$ 30,00",
      points: 80,
      icon: "gift",
    },
    {
      id: "4",
      name: "Desconto ",
      description: "20% off",
      points: 150,
      icon: "percent",
    },
  ];

  const displayProducts = products.length > 0 ? products : defaultProducts;
  const screenWidth = Dimensions.get("window").width;
  const paddingHorizontal = 20;
  const gap = 12;
  const availableWidth = screenWidth - paddingHorizontal * 2;
  const cardWidth = (availableWidth - gap) / 2.2;
  const totalWidth = (cardWidth + gap) * displayProducts.length;

  const canRedeem = (productPoints: number) => {
    return userPoints >= productPoints;
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollX = event.nativeEvent.contentOffset.x;
    const scrollWidth = event.nativeEvent.contentSize.width;
    const containerWidth = event.nativeEvent.layoutMeasurement.width;

    setScrollX(currentScrollX);
    setShowLeftArrow(currentScrollX > 0);
    setShowRightArrow(currentScrollX < scrollWidth - containerWidth - 10);
  };

  const scrollLeft = () => {
    scrollViewRef.current?.scrollTo({
      x: Math.max(0, scrollX - (cardWidth + gap) * 2),
      animated: true,
    });
  };

  const scrollRight = () => {
    const maxScroll = totalWidth - screenWidth + paddingHorizontal * 2;
    scrollViewRef.current?.scrollTo({
      x: Math.min(maxScroll, scrollX + (cardWidth + gap) * 2),
      animated: true,
    });
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Produtos para Resgate</ThemedText>
      <View style={styles.carouselWrapper}>
        {showLeftArrow && (
          <TouchableOpacity
            style={[styles.arrowButton, styles.leftArrow]}
            onPress={scrollLeft}
            activeOpacity={0.7}
          >
            <FontAwesome name="chevron-left" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          decelerationRate="fast"
          pagingEnabled={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {displayProducts.map((product, index) => {
            const canRedeemProduct = canRedeem(product.points);
            const isLast = index === displayProducts.length - 1;

            return (
              <TouchableOpacity
                key={product.id}
                style={[
                  styles.card,
                  { width: cardWidth },
                  !isLast && styles.cardWithMargin,
                  !canRedeemProduct && styles.cardDisabled,
                ]}
                onPress={() => canRedeemProduct && onRedeem(product)}
                disabled={!canRedeemProduct}
                activeOpacity={0.8}
              >
                <View style={styles.cardContent}>
                  {product.icon ? (
                    <View style={styles.iconContainer}>
                      <FontAwesome
                        name={product.icon as any}
                        size={36}
                        color={canRedeemProduct ? tintColor : "#CCCCCC"}
                      />
                    </View>
                  ) : product.image ? (
                    <Image
                      source={{ uri: product.image }}
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.placeholderIcon}>
                      <FontAwesome
                        name="image"
                        size={36}
                        color={canRedeemProduct ? tintColor : "#CCCCCC"}
                      />
                    </View>
                  )}

                  <ThemedText style={styles.productName} numberOfLines={2}>
                    {product.name}
                  </ThemedText>

                  {product.description && (
                    <ThemedText
                      style={styles.productDescription}
                      numberOfLines={2}
                    >
                      {product.description}
                    </ThemedText>
                  )}

                  <View style={styles.pointsContainer}>
                    <FontAwesome
                      name="gift"
                      size={14}
                      color={canRedeemProduct ? "#8B5CF6" : "#CCCCCC"}
                      style={styles.pointsIcon}
                    />
                    <ThemedText
                      style={[
                        styles.pointsText,
                        !canRedeemProduct && styles.pointsTextDisabled,
                      ]}
                    >
                      {product.points} pts
                    </ThemedText>
                  </View>

                  {!canRedeemProduct && (
                    <View style={styles.insufficientPointsBadge}>
                      <ThemedText
                        style={styles.insufficientPointsText}
                        numberOfLines={1}
                      >
                        Pontos insuficientes
                      </ThemedText>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        {showRightArrow && (
          <TouchableOpacity
            style={[styles.arrowButton, styles.rightArrow]}
            onPress={scrollRight}
            activeOpacity={0.7}
          >
            <FontAwesome name="chevron-right" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>
      {onViewAll && (
        <TouchableOpacity style={styles.viewAllButton} onPress={onViewAll}>
          <ThemedText style={styles.viewAllText}>
            Ver Todos os Produtos
          </ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    paddingHorizontal: 20,
    color: "#000000",
  },
  carouselWrapper: {
    position: "relative",
  },
  scrollContent: {
    paddingLeft: 20,
    paddingRight: 20,
    gap: 12,
    marginBottom: 12,
  },
  arrowButton: {
    position: "absolute",
    top: "50%",
    marginTop: -25,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(139, 92, 246, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  leftArrow: {
    left: 10,
  },
  rightArrow: {
    right: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden",
  },
  cardWithMargin: {
    marginRight: 12,
  },
  cardDisabled: {
    opacity: 0.6,
  },
  cardContent: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 180,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  placeholderIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 12,
  },
  productName: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
    textAlign: "center",
    color: "#000000",
  },
  productDescription: {
    fontSize: 13,
    color: "#666666",
    marginBottom: 10,
    textAlign: "center",
  },
  pointsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 6,
  },
  pointsIcon: {
    marginRight: 6,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8B5CF6",
  },
  pointsTextDisabled: {
    color: "#CCCCCC",
  },
  insufficientPointsBadge: {
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#FFE5E5",
    borderRadius: 12,
  },
  insufficientPointsText: {
    fontSize: 11,
    color: "#EF4444",
    fontWeight: "500",
  },
  viewAllButton: {
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 20,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8B5CF6",
  },
});
