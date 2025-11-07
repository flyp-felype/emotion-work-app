import { router } from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FirstAccessForm } from "../../components/auth/FirstAccessForm";
import { FirstAccessHeader } from "../../components/auth/FirstAccessHeader";
import { ThemedView } from "../../components/themed-view";

export default function FirstAccessScreen() {
  const handleSubmit = async (data: {
    cpf: string;
    matricula: string;
    dataNascimento: Date;
    senha: string;
    confirmarSenha: string;
  }) => {
    // Aqui você implementará a lógica de criação de conta
    console.log("First Access Data:", data);

    // Exemplo: após sucesso, navegar para login ou home
    router.replace("/(tabs)");
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
            <FirstAccessForm onSubmit={handleSubmit} onBack={handleBack} />
          </ScrollView>
        </KeyboardAvoidingView>
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
