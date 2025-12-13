import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
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
  const router = useRouter();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (matricula: string, senha: string) => {
    try {
      setLoading(true);
      await signIn(matricula, senha);
    } catch (error: any) {
      Alert.alert(
        "Erro no Login",
        "Verifique sua matrícula e senha e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFirstAccess = () => {
    // Navegar para tela de primeiro acesso
    router.push("/(auth)/first-access"); // Descomentar esta linha
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
