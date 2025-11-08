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

interface Store {
  id: string;
  name: string;
  category: string;
  distance: number; // em km
  logo?: string;
  icon?: string;
  address: string;
  featured?: boolean;
}

type CategoryType = "all" | "food" | "retail" | "services" | "wellness";

export default function StoresScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("all");

  // Mock de lojas
  const stores: Store[] = [
    {
      id: "1",
      name: "Starbucks Centro",
      category: "food",
      distance: 0.5,
      icon: "coffee",
      address: "Av. Paulista, 1000",
      featured: true,
    },
    {
      id: "2",
      name: "iFood",
      category: "food",
      distance: 0.0, // Online
      icon: "cutlery",
      address: "Delivery Online",
      featured: true,
    },
    {
      id: "3",
      name: "Café do Ponto",
      category: "food",
      distance: 1.2,
      icon: "coffee",
      address: "Rua Augusta, 250",
    },
    {
      id: "4",
      name: "Amazon",
      category: "retail",
      distance: 0.0,
      icon: "shopping-cart",
      address: "Loja Online",
    },
    {
      id: "5",
      name: "Livraria Cultura",
      category: "retail",
      distance: 2.5,
      icon: "book",
      address: "Shopping Iguatemi",
    },
    {
      id: "6",
      name: "Spa Wellness",
      category: "wellness",
      distance: 3.0,
      icon: "heart",
      address: "Rua dos Pinheiros, 850",
    },
    {
      id: "7",
      name: "Academia SmartFit",
      category: "wellness",
      distance: 0.8,
      icon: "heartbeat",
      address: "Rua Consolação, 500",
    },
    {
      id: "8",
      name: "Cabeleireiro Elegance",
      category: "services",
      distance: 1.5,
      icon: "cut",
      address: "Rua Oscar Freire, 120",
    },
  ];

  const categories = [
    { id: "all" as CategoryType, label: "Todas", icon: "th" },
    { id: "food" as CategoryType, label: "Alimentação", icon: "cutlery" },
    { id: "retail" as CategoryType, label: "Varejo", icon: "shopping-bag" },
    { id: "services" as CategoryType, label: "Serviços", icon: "briefcase" },
    { id: "wellness" as CategoryType, label: "Bem-estar", icon: "heart" },
  ];

  // Filtrar lojas
  const filteredStores = stores.filter((store) => {
    const matchesSearch = store.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || store.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Separar lojas em destaque e normais
  const featuredStores = filteredStores.filter((store) => store.featured);
  const regularStores = filteredStores.filter((store) => !store.featured);

  const handleStorePress = (store: Store) => {
    console.log("Navegar para detalhes da loja:", store.id);
    router.push(`/(tabs)/stores/${store.id}`);
  };

  const formatDistance = (distance: number) => {
    if (distance === 0) return "Online";
    if (distance < 1) return `${(distance * 1000).toFixed(0)}m`;
    return `${distance.toFixed(1)}km`;
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
        <ThemedText style={styles.headerTitle}>Lojas Parceiras</ThemedText>
        <View style={styles.headerRight} />
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <FontAwesome name="search" size={16} color="#999999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar lojas..."
            placeholderTextColor="#999999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <FontAwesome name="times-circle" size={16} color="#999999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(category.id)}
            activeOpacity={0.7}
          >
            <FontAwesome
              name={category.icon as any}
              size={14}
              color={selectedCategory === category.id ? "#FFFFFF" : "#666666"}
            />
            <ThemedText
              style={[
                styles.categoryChipText,
                selectedCategory === category.id &&
                  styles.categoryChipTextActive,
              ]}
            >
              {category.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Featured Stores */}
        {featuredStores.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <FontAwesome name="star" size={18} color="#F59E0B" />
              <ThemedText style={styles.sectionTitle}>Em Destaque</ThemedText>
            </View>

            {featuredStores.map((store) => (
              <TouchableOpacity
                key={store.id}
                style={styles.featuredCard}
                onPress={() => handleStorePress(store)}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={["#8B5CF6", "#F87171"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.featuredGradient}
                ></LinearGradient>

                <View style={styles.featuredContent}>
                  <View style={styles.featuredLeft}>
                    <View style={styles.featuredIconContainer}>
                      <FontAwesome
                        name={store.icon as any}
                        size={32}
                        color="#8B5CF6"
                      />
                    </View>
                    <View style={styles.featuredInfo}>
                      <ThemedText style={styles.featuredName}>
                        {store.name}
                      </ThemedText>
                      <View style={styles.featuredMeta}>
                        <FontAwesome
                          name="map-marker"
                          size={12}
                          color="#666666"
                        />
                        <ThemedText style={styles.featuredAddress}>
                          {store.address}
                        </ThemedText>
                      </View>
                    </View>
                  </View>
                  <View style={styles.distanceBadge}>
                    <FontAwesome
                      name="location-arrow"
                      size={10}
                      color="#8B5CF6"
                    />
                    <ThemedText style={styles.distanceText}>
                      {formatDistance(store.distance)}
                    </ThemedText>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Regular Stores */}
        {regularStores.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <FontAwesome name="map-marker" size={18} color="#8B5CF6" />
              <ThemedText style={styles.sectionTitle}>
                Próximas de Você ({regularStores.length})
              </ThemedText>
            </View>

            {regularStores.map((store) => (
              <TouchableOpacity
                key={store.id}
                style={styles.storeCard}
                onPress={() => handleStorePress(store)}
                activeOpacity={0.7}
              >
                <View style={styles.storeIconContainer}>
                  <FontAwesome
                    name={store.icon as any}
                    size={24}
                    color="#8B5CF6"
                  />
                </View>
                <View style={styles.storeInfo}>
                  <ThemedText style={styles.storeName}>{store.name}</ThemedText>
                  <View style={styles.storeMeta}>
                    <FontAwesome name="map-marker" size={12} color="#666666" />
                    <ThemedText style={styles.storeAddress}>
                      {store.address}
                    </ThemedText>
                  </View>
                </View>
                <View style={styles.storeRight}>
                  <View style={styles.distanceBadgeSmall}>
                    <FontAwesome
                      name="location-arrow"
                      size={10}
                      color="#8B5CF6"
                    />
                    <ThemedText style={styles.distanceTextSmall}>
                      {formatDistance(store.distance)}
                    </ThemedText>
                  </View>
                  <FontAwesome name="chevron-right" size={16} color="#999999" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Empty State */}
        {filteredStores.length === 0 && (
          <View style={styles.emptyState}>
            <FontAwesome name="store" size={64} color="#CCCCCC" />
            <ThemedText style={styles.emptyTitle}>
              Nenhuma loja encontrada
            </ThemedText>
            <ThemedText style={styles.emptyText}>
              Tente ajustar sua busca ou filtros
            </ThemedText>
          </View>
        )}
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000000",
  },
  categoriesContainer: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  categoriesContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 6,
    height: 50,
    marginBottom: 30,
  },
  categoryChipActive: {
    backgroundColor: "#8B5CF6",
    borderColor: "#8B5CF6",
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666666",
  },
  categoryChipTextActive: {
    color: "#FFFFFF",
  },
  content: {
    // flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },
  featuredCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 12,
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
  featuredGradient: {
    height: 8,
    position: "relative",
  },
  featuredBadge: {
    position: "absolute",
    top: -4,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  featuredBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#000",
  },
  featuredContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  featuredLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  featuredIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F5F3FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  featuredInfo: {
    flex: 1,
  },
  featuredName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  featuredMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  featuredAddress: {
    fontSize: 13,
    color: "#666666",
  },
  distanceBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F3FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8B5CF6",
  },
  storeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  storeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F5F3FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  storeMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  storeAddress: {
    fontSize: 12,
    color: "#666666",
  },
  storeRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  distanceBadgeSmall: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F3FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  distanceTextSmall: {
    fontSize: 11,
    fontWeight: "600",
    color: "#8B5CF6",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#999999",
    textAlign: "center",
  },
});
