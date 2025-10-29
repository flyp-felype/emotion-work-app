import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { ThemedText } from "../themed-text";
import { InputField } from "./InputField";
import { LoginButton } from "./LoginButton";

interface LoginFormProps {
  onLogin: (matricula: string, senha: string) => Promise<void>;
  onFirstAccess: () => void;
}

export function LoginForm({ onLogin, onFirstAccess }: LoginFormProps) {
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!matricula.trim() || !senha.trim()) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      await onLogin(matricula.trim(), senha.trim());
    } catch (error) {
      Alert.alert("Erro", "Credenciais inválidas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <InputField
        label="Matrícula"
        placeholder="Digite sua matrícula"
        value={matricula}
        onChangeText={setMatricula}
        keyboardType="numeric"
      />

      <InputField
        label="Senha"
        placeholder="Digite sua senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <LoginButton
        title="Entrar"
        onPress={handleLogin}
        loading={loading}
        disabled={loading}
      />

      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <ThemedText style={styles.dividerText}>OU</ThemedText>
        <View style={styles.dividerLine} />
      </View>

      <LoginButton
        title="Primeiro acesso"
        onPress={onFirstAccess}
        variant="secondary"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.7,
  },
});
