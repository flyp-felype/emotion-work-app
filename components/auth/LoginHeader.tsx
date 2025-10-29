import { ThemedText } from "@/components/themed-text";
import React from "react";
import { Image, StyleSheet, useColorScheme, View } from "react-native";
const logoLight = require("../../assets/images/emotion-work-logo.png");
const logoDark = require("../../assets/images/emotion-work-logo-dark.png");

export function LoginHeader() {
  const colorScheme = useColorScheme();
  const logoImage = colorScheme === "dark" ? logoDark : logoLight;
  return (
    <View style={styles.container}>
      <Image source={logoImage} style={styles.logo} resizeMode="contain" />
      <ThemedText type="title" style={styles.welcomeText}>
        Bem-vindo de volta
      </ThemedText>
      <ThemedText style={styles.subtitleText}>
        Entre com suas credenciais
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: "100%",
    height: 120,
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitleText: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: "center",
  },
});
