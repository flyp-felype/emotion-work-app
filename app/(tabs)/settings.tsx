import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "../../components/themed-text";
import { ThemedView } from "../../components/themed-view";
import { useThemeColor } from "../../hooks/use-theme-color";

export default function SettingsScreen() {
  const iconColor = useThemeColor({}, "icon");

  const handleLogout = () => {
    router.replace("/auth/login");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ThemedView style={styles.content}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              Configurações
            </ThemedText>
          </View>

          <View style={styles.section}>
            <TouchableOpacity style={styles.settingItem}>
              <FontAwesome name="user" size={20} color={iconColor} />
              <ThemedText style={styles.settingText}>Perfil</ThemedText>
              <FontAwesome name="chevron-right" size={16} color={iconColor} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <FontAwesome name="bell" size={20} color={iconColor} />
              <ThemedText style={styles.settingText}>Notificações</ThemedText>
              <FontAwesome name="chevron-right" size={16} color={iconColor} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <FontAwesome name="question-circle" size={20} color={iconColor} />
              <ThemedText style={styles.settingText}>Ajuda</ThemedText>
              <FontAwesome name="chevron-right" size={16} color={iconColor} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <FontAwesome name="info-circle" size={20} color={iconColor} />
              <ThemedText style={styles.settingText}>Sobre</ThemedText>
              <FontAwesome name="chevron-right" size={16} color={iconColor} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <FontAwesome name="sign-out" size={20} color="#EF4444" />
            <ThemedText style={styles.logoutText}>Sair</ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000000",
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 16,
    color: "#000000",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FFE5E5",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#EF4444",
    marginLeft: 12,
  },
});
