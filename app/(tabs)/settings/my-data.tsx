import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import { getMe, MeResponse, updateEmployee } from "../../../services/api";

export default function MyDataScreen() {
  const [meData, setMeData] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Editable fields
  const [name, setName] = useState("");
  const [registration, setRegistration] = useState("");
  const [department, setDepartment] = useState("");
  const [phone, setPhone] = useState("");

  // Original values to restore on cancel
  const [original, setOriginal] = useState({
    name: "",
    registration: "",
    department: "",
    phone: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getMe();
      setMeData(data);
      const fields = {
        name: data.employee.name ?? "",
        registration: data.employee.registration ?? "",
        department: data.employee.department ?? "",
        phone: data.employee.phone ?? "",
      };
      setName(fields.name);
      setRegistration(fields.registration);
      setDepartment(fields.department);
      setPhone(fields.phone);
      setOriginal(fields);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      Alert.alert("Erro", "Não foi possível carregar seus dados.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Atenção", "Por favor, preencha o nome.");
      return;
    }

    if (!meData) return;

    try {
      setSaving(true);
      await updateEmployee(meData.employee.uuid, {
        name: name.trim(),
        registration: registration.trim(),
        department: department.trim(),
        phone: phone.trim(),
      });

      const updated = { name: name.trim(), registration: registration.trim(), department: department.trim(), phone: phone.trim() };
      setOriginal(updated);
      setIsEditing(false);

      Alert.alert("Sucesso", "Seus dados foram atualizados com sucesso!");
    } catch (error: any) {
      const message =
        error?.response?.data?.detail ||
        "Não foi possível salvar os dados. Tente novamente.";
      Alert.alert("Erro", message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setName(original.name);
    setRegistration(original.registration);
    setDepartment(original.department);
    setPhone(original.phone);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#8B5CF6" />
        <ThemedText style={styles.loadingText}>Carregando seus dados...</ThemedText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="light" />

      {/* Header */}
      <LinearGradient
        colors={["#8B5CF6", "#F87171"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
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
          {/* Avatar Card */}
          <View style={styles.infoCard}>
            <View style={styles.avatarContainer}>
              <FontAwesome name="user-circle" size={80} color="#8B5CF6" />
              <View style={styles.editAvatarButton}>
                <FontAwesome name="camera" size={16} color="#FFFFFF" />
              </View>
            </View>
            <ThemedText style={styles.userName}>{name || "—"}</ThemedText>
            <ThemedText style={styles.userEmail}>
              {meData?.user.email ?? "—"}
            </ThemedText>
          </View>

          {/* Read-only info */}
          <View style={styles.readOnlyCard}>
            <View style={styles.readOnlyRow}>
              <FontAwesome name="envelope-o" size={14} color="#8B5CF6" />
              <ThemedText style={styles.readOnlyLabel}>Email</ThemedText>
              <ThemedText style={styles.readOnlyValue} numberOfLines={1}>
                {meData?.user.email ?? "—"}
              </ThemedText>
            </View>
            <View style={styles.readOnlyRow}>
              <FontAwesome name="id-badge" size={14} color="#8B5CF6" />
              <ThemedText style={styles.readOnlyLabel}>Matrícula</ThemedText>
              <ThemedText style={styles.readOnlyValue}>
                {meData?.employee.registration ?? "—"}
              </ThemedText>
            </View>
          </View>

          {/* Editable Form */}
          <View style={styles.formCard}>
            <ThemedText style={styles.sectionTitle}>
              Informações Pessoais
            </ThemedText>

            {/* Nome */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Nome Completo</ThemedText>
              <View style={[styles.inputContainer, !isEditing && styles.inputContainerDisabled]}>
                <FontAwesome name="user" size={16} color="#999999" style={styles.inputIcon} />
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

            {/* Departamento */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Departamento</ThemedText>
              <View style={[styles.inputContainer, !isEditing && styles.inputContainerDisabled]}>
                <FontAwesome name="building-o" size={16} color="#999999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={department}
                  onChangeText={setDepartment}
                  placeholder="Digite seu departamento"
                  placeholderTextColor="#CCCCCC"
                  editable={isEditing}
                />
              </View>
            </View>

            {/* Telefone */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Telefone</ThemedText>
              <View style={[styles.inputContainer, !isEditing && styles.inputContainerDisabled]}>
                <FontAwesome name="phone" size={16} color="#999999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="(00) 00000-0000"
                  placeholderTextColor="#CCCCCC"
                  keyboardType="phone-pad"
                  editable={isEditing}
                />
              </View>
            </View>
          </View>

          {/* Buttons */}
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
                disabled={saving}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                activeOpacity={0.8}
                disabled={saving}
              >
                <LinearGradient
                  colors={["#8B5CF6", "#F87171"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.saveButtonGradient}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <FontAwesome name="check" size={18} color="#FFFFFF" />
                  )}
                  <Text style={styles.saveButtonText}>
                    {saving ? "Salvando..." : "Salvar"}
                  </Text>
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
    backgroundColor: "#8B5CF6",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666666",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
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
    backgroundColor: "#F8F9FA",
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
    marginBottom: 12,
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    gap: 6,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 8,
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
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  userEmail: {
    fontSize: 13,
    color: "#6B7280",
  },
  readOnlyCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  readOnlyRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  readOnlyLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    flex: 1,
  },
  readOnlyValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    maxWidth: "55%",
    textAlign: "right",
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
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
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6B7280",
    marginBottom: 6,
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
  inputContainerDisabled: {
    backgroundColor: "#F3F4F6",
    borderColor: "#E5E7EB",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
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
