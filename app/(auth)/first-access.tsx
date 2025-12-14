import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FirstAccessForm } from "../../components/auth/FirstAccessForm";
import { FirstAccessHeader } from "../../components/auth/FirstAccessHeader";
import { ThemedView } from "../../components/themed-view";
import { useAuth } from "../../context/AuthContext";
import { onboardingService } from "../../services/api";

export default function FirstAccessScreen() {
  const { completeOnboardingSession } = useAuth();
  const [userUuid, setUserUuid] = useState<string | null>(null);

  // Passo 1: Validação do Usuário
  const handleCheckUser = async (data: {
    cpf: string;
    name: string;
    matricula: string;
    dataNascimento: Date;
  }) => {
    try {
      // Formata a data para YYYY-MM-DD
      const formattedDate = data.dataNascimento.toISOString().split("T")[0];

      const response = await onboardingService.checkUser({
        document: data.cpf.replace(/\D/g, ""),
        name: data.name,
        registration: data.matricula,
        birth_date: formattedDate,
      });

      if (response.found && response.user_uuid) {
        setUserUuid(response.user_uuid);
        return true;
      } else {
        Alert.alert("Atenção", response.message || "Dados não encontrados.");
        return false;
      }
    } catch (error: any) {
      console.error(error);
      const msg =
        error.response?.data?.message ||
        "Erro ao verificar dados. Tente novamente.";
      Alert.alert("Erro", msg);
      return false;
    }
  };

  // Passo 2: Finalização (Criação de senha)
  const handleSubmit = async (data: {
    email: string;
    senha: string;
    confirmarSenha: string;
  }) => {
    if (!userUuid) {
      Alert.alert(
        "Erro",
        "Identificador do usuário perdido. Reinicie o processo."
      );
      return;
    }

    try {
      const response = await onboardingService.completeRegistration({
        user_uuid: userUuid,
        email: data.email,
        password: data.senha,
        password_confirmation: data.confirmarSenha,
      });

      if (response.access_token) {
        // Login automático
        await completeOnboardingSession(response.access_token);
      }
    } catch (error: any) {
      console.error(error);
      const msg =
        error.response?.data?.message || "Erro ao finalizar cadastro.";
      Alert.alert("Erro", msg);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <FirstAccessHeader />
            <FirstAccessForm
              onCheckUser={handleCheckUser}
              onSubmit={handleSubmit}
              onBack={handleBack}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </ThemedView>
    </SafeAreaView>
  );
}

// styles (mesmo do original)
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
});
