import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoginForm } from "../../components/auth/LoginForm";
import { LoginHeader } from "../../components/auth/LoginHeader";
import { ThemedView } from "../../components/themed-view";

export default function LoginScreen() {
  const handleLogin = async (matricula: string, senha: string) => {
    // Aqui você implementará a lógica de autenticação
    console.log("Login:", { matricula, senha });

    // Exemplo de navegação após login bem-sucedido
    // router.replace('/(tabs)');
  };

  const handleFirstAccess = () => {
    // Navegar para tela de primeiro acesso
    console.log("Primeiro acesso");
    // router.push('/auth/first-access');
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
            <LoginHeader />
            <LoginForm
              onLogin={handleLogin}
              onFirstAccess={handleFirstAccess}
            />
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
