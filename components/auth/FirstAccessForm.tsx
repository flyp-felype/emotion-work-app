import React from "react";
import { StyleSheet, View } from "react-native";
import { useColorScheme } from "../../../hooks/use-color-scheme";
import { ThemedText } from "../../themed-text";

const logoLight = require("../../../assets/images/emotion-work-logo.png");
const logoDark = require("../../../assets/images/emotion-work-logo-dark.png");

export function FirstAccessHeader() {
  const colorScheme = useColorScheme();
  const logoImage = colorScheme === "dark" ? logoDark : logoLight;

  return (
    <View style={styles.container}>
      <ThemedText
        type="title"
        style={styles.title}
        lightColor="#000000"
        darkColor="#FFFFFF"
      >
        Primeiro Acesso
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        Preencha os dados para criar sua conta
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: "center",
  },
});
