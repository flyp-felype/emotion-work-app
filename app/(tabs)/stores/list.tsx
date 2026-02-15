import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "../../../components/themed-text";
import { getPartnerCategories, getPartnerCompanies, PartnerCategory, PartnerCompany } from "../../../services/api";

type CategoryId = number | "all";

interface CategoryDisplay {
  id: CategoryId;
  label: string;
  icon: string;
}

export default function StoresScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>("all");
  const [categories, setCategories] = useState<CategoryDisplay[]>([
    { id: "all", label: "Todas", icon: "grid-view" },
  ]);
  const [companies, setCompanies] = useState<PartnerCompany[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [categoriesResponse, companiesResponse] = await Promise.all([
        getPartnerCategories(),
        getPartnerCompanies(),
      ]);

      const formattedCategories = categoriesResponse.categories.map(
        (cat: PartnerCategory) => ({
          id: cat.id,
          label: cat.name,
          icon: cat.icon,
        })
      );
      setCategories([
        { id: "all", label: "Todas", icon: "grid-view" },
        ...formattedCategories,
      ]);

      setCompanies(companiesResponse.companies);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar lojas
  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      company.category.uuid === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Separar lojas em destaque e normais
  const featuredCompanies = filteredCompanies.filter((company) => company.featured);
  const regularCompanies = filteredCompanies.filter((company) => !company.featured);

  const handleStorePress = (company: PartnerCompany) => {
    router.push(`/(tabs)/stores/${company.uuid}`);
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
            <MaterialIcons
              name={category.icon as any}
              size={18}
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
        {/* Companies List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="store" size={18} color="#8B5CF6" />
            <ThemedText style={styles.sectionTitle}>
              Nossas Lojas ({filteredCompanies.length})
            </ThemedText>
          </View>

          {filteredCompanies.map((company) => (
            <TouchableOpacity
              key={company.uuid}
              style={styles.storeCard}
              onPress={() => handleStorePress(company)}
              activeOpacity={0.7}
            >
              <View style={styles.storeIconContainer}>
                <MaterialIcons
                  name={company.category.icon as any}
                  size={24}
                  color="#8B5CF6"
                />
              </View>
              <View style={styles.storeInfo}>
                <ThemedText style={styles.storeName}>{company.name}</ThemedText>
                <View style={styles.storeMeta}>
                  <FontAwesome name="map-marker" size={12} color="#666666" />
                  <ThemedText style={styles.storeAddress}>
                    {company.address}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.storeRight}>
                <FontAwesome name="chevron-right" size={16} color="#999999" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Empty State */}
        {filteredCompanies.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialIcons name="store" size={64} color="#CCCCCC" />
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
    maxHeight: 80,
    flex: 1,
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
    maxHeight: 50,
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
    flex: 1,
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
