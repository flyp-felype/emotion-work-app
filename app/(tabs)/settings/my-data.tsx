import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "../../../components/themed-text";

export default function MyDataScreen() {
  const [name, setName] = useState("João Silva");
  const [email, setEmail] = useState("joao.silva@empresa.com");
  const [birthDate, setBirthDate] = useState("15/03/1990");
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // Validações básicas
    if (!name.trim()) {
      Alert.alert("Atenção", "Por favor, preencha o nome.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      Alert.alert("Atenção", "Por favor, preencha um email válido.");
      return;
    }

    if (!birthDate.trim()) {
      Alert.alert("Atenção", "Por favor, preencha a data de nascimento.");
      return;
    }

    // Aqui você implementaria a lógica de salvamento
    console.log("Salvando dados:", { name, email, birthDate });

    Alert.alert("Sucesso", "Seus dados foram atualizados com sucesso!", [
      {
        text: "OK",
        onPress: () => {
          setIsEditing(false);
          // router.back();
        },
      },
    ]);
  };

  const handleCancel = () => {
    // Restaurar valores originais
    setName("João Silva");
    setEmail("joao.silva@empresa.com");
    setBirthDate("15/03/1990");
    setIsEditing(false);
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
        <ThemedText style={styles.headerTitle}>Meus Dados</ThemedText>
        <View style={styles.headerRight} />
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Info Card */}
          <View style={styles.infoCard}>
            <View style={styles.avatarContainer}>
              <FontAwesome name="user-circle" size={80} color="#8B5CF6" />
              <TouchableOpacity style={styles.editAvatarButton}>
                <FontAwesome name="camera" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            <ThemedText style={styles.sectionTitle}>
              Informações Pessoais
            </ThemedText>

            {/* Nome */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Nome Completo</ThemedText>
              <View style={styles.inputContainer}>
                <FontAwesome
                  name="user"
                  size={16}
                  color="#999999"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Digite seu nome"
                  placeholderTextColor="#CCCCCC"
                  editable={isEditing}
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Email</ThemedText>
              <View style={styles.inputContainer}>
                <FontAwesome
                  name="envelope"
                  size={16}
                  color="#999999"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Digite seu email"
                  placeholderTextColor="#CCCCCC"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={isEditing}
                />
              </View>
            </View>

            {/* Data de Nascimento */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Data de Nascimento</ThemedText>
              <View style={styles.inputContainer}>
                <FontAwesome
                  name="calendar"
                  size={16}
                  color="#999999"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={birthDate}
                  onChangeText={setBirthDate}
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor="#CCCCCC"
                  keyboardType="numeric"
                  maxLength={10}
                  editable={isEditing}
                />
              </View>
            </View>

            {/* Info apenas leitura */}
            <View style={styles.readOnlySection}>
              <ThemedText style={styles.readOnlyLabel}>Matrícula</ThemedText>
              <ThemedText style={styles.readOnlyValue}>123456</ThemedText>
            </View>
          </View>

          {/* Botões */}
          {!isEditing ? (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#8B5CF6", "#F87171"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.editButtonGradient}
              >
                <FontAwesome name="edit" size={18} color="#FFFFFF" />
                <Text style={styles.editButtonText}>Editar Dados</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#8B5CF6", "#F87171"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.saveButtonGradient}
                >
                  <FontAwesome name="check" size={18} color="#FFFFFF" />
                  <Text style={styles.saveButtonText}>Salvar</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
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
  avatarContainer: {
    position: "relative",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#8B5CF6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 20,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666666",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#000000",
  },
  readOnlySection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    marginTop: 4,
  },
  readOnlyLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666666",
  },
  readOnlyValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
  },
  editButton: {
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: "hidden",
  },
  editButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  actionButtons: {
    flexDirection: "row",
    marginHorizontal: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 16,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666666",
  },
  saveButton: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  saveButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
