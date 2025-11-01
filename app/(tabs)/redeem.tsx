import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "../../components/themed-text";
import { ThemedView } from "../../components/themed-view";

export default function RedeemScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ThemedView style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedText type="title">Resgatar</ThemedText>
          <ThemedText style={styles.description}>
            Em breve você poderá resgatar seus pontos aqui
          </ThemedText>
        </ScrollView>
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
  scrollContent: {
    padding: 20,
  },
  description: {
    marginTop: 12,
    fontSize: 16,
  },
});
