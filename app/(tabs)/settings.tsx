import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "../../components/themed-text";

const coinImage = require("../../assets/images/emotions-coin.png");

interface MenuItem {
  id: string;
  icon: string;
  label: string;
  onPress: () => void;
}

export default function SettingsScreen() {
  const userData = {
    name: "João Silva",
    email: "joao.silva@empresa.com",
    matricula: "123456",
    points: 150,
  };

  const handleMyData = () => {
    console.log("Navegar para Meus Dados");
    // router.push("/settings/my-data");
  };

  const handleStatement = () => {
    console.log("Navegar para Extrato");
    // router.push("/settings/statement");
  };

  const handleNotifications = () => {
    console.log("Navegar para Notificações");
    // router.push("/settings/notifications");
  };

  const handleLGPD = () => {
    console.log("Navegar para LGPD");
    // router.push("/settings/lgpd");
  };

  const handleFAQ = () => {
    console.log("Navegar para Dúvidas Frequentes");
    // router.push("/settings/faq");
  };

  const handleLogout = () => {
    Alert.alert("Sair", "Tem certeza que deseja sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: () => {
          console.log("Logout");
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Deletar Conta",
      "Esta ação é irreversível. Todos os seus dados serão permanentemente apagados. Deseja continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: () => {
            console.log("Delete account");
            // Implementar lógica de deleção
          },
        },
      ]
    );
  };

  const menuItems: MenuItem[] = [
    {
      id: "my-data",
      icon: "user",
      label: "Meus Dados",
      onPress: handleMyData,
    },
    {
      id: "statement",
      icon: "file-text",
      label: "Extrato",
      onPress: handleStatement,
    },
    {
      id: "notifications",
      icon: "bell",
      label: "Notificações",
      onPress: handleNotifications,
    },
    {
      id: "lgpd",
      icon: "shield",
      label: "LGPD",
      onPress: handleLGPD,
    },
    {
      id: "faq",
      icon: "question-circle",
      label: "Dúvidas Frequentes",
      onPress: handleFAQ,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header com gradiente */}
      <LinearGradient
        colors={["#8B5CF6", "#F87171"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <ThemedText style={styles.headerTitle}>Configurações</ThemedText>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Card de perfil */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <FontAwesome name="user-circle" size={60} color="#8B5CF6" />
          </View>
          <View style={styles.profileInfo}>
            <ThemedText style={styles.profileName}>{userData.name}</ThemedText>
            <ThemedText style={styles.profileEmail}>
              {userData.email}
            </ThemedText>
            <ThemedText style={styles.profileMatricula}>
              Matrícula: {userData.matricula}
            </ThemedText>
          </View>
          <View style={styles.pointsCard}>
            <LinearGradient
              colors={["#8B5CF6", "#F87171"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.pointsGradient}
            >
              <ThemedText style={styles.pointsLabel}>Meus Emotions</ThemedText>
              <View style={styles.pointsRow}>
                <ThemedText style={styles.pointsValue}>
                  {userData.points}
                </ThemedText>
                <Image
                  source={coinImage}
                  style={styles.coinImage}
                  resizeMode="contain"
                />
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Menu items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && styles.menuItemLast,
              ]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIconContainer}>
                  <FontAwesome
                    name={item.icon as any}
                    size={20}
                    color="#8B5CF6"
                  />
                </View>
                <ThemedText style={styles.menuItemLabel}>
                  {item.label}
                </ThemedText>
              </View>
              <FontAwesome name="chevron-right" size={16} color="#999999" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Botão de Sair */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <FontAwesome name="sign-out" size={20} color="#EF4444" />
          <ThemedText style={styles.logoutButtonText}>Sair da Conta</ThemedText>
        </TouchableOpacity>

        {/* Botão de Deletar Conta */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteAccount}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.deleteButtonText}>Deletar Conta</ThemedText>
        </TouchableOpacity>

        <View style={styles.footer}>
          <ThemedText style={styles.version}>Versão 1.0.0</ThemedText>
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
    paddingHorizontal: 20,
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  profileInfo: {
    alignItems: "center",
    marginBottom: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
  },
  profileMatricula: {
    fontSize: 12,
    color: "#999999",
  },
  pointsCard: {
    marginTop: 8,
    borderRadius: 12,
    overflow: "hidden",
  },
  pointsGradient: {
    padding: 16,
    alignItems: "center",
  },
  pointsLabel: {
    fontSize: 12,
    color: "#FFFFFF",
    opacity: 0.9,
    marginBottom: 8,
  },
  pointsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pointsValue: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFFFFF",
    lineHeight: 40,
  },
  coinImage: {
    width: 28,
    height: 28,
  },
  menuContainer: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F3FF",
    justifyContent: "center",
    alignItems: "center",
  },
  menuItemLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000000",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EF4444",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#EF4444",
  },
  deleteButton: {
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 12,
    padding: 16,
  },
  deleteButtonText: {
    fontSize: 14,
    color: "#999999",
    textDecorationLine: "underline",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  version: {
    fontSize: 12,
    color: "#999999",
  },
});
