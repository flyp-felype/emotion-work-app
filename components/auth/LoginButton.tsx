import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { useThemeColor } from "../../hooks/use-theme-color";
import { ThemedText } from "../themed-text";

interface LoginButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  loading?: boolean;
  disabled?: boolean;
}

export function LoginButton({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
}: LoginButtonProps) {
  const tintColor = useThemeColor({}, "tint");
  const textColor = variant === "primary" ? "#FFFFFF" : tintColor;

  // Cores do gradiente baseadas no CSS fornecido
  const gradientColors = ["#8B5CF6", "#F87171"]; // hsl(266 77% 56%) e hsl(5 78% 70%)

  if (variant === "primary") {
    return (
      <TouchableOpacity
        style={[styles.button, disabled && styles.disabledButton]}
        onPress={onPress}
        disabled={disabled || loading}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {loading ? (
            <ActivityIndicator color={textColor} />
          ) : (
            <ThemedText style={[styles.buttonText, { color: textColor }]}>
              {title}
            </ThemedText>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // Botão secundário sem gradiente
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles.secondaryButton,
        disabled && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <ThemedText style={[styles.buttonText, { color: textColor }]}>
          {title}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden", // Importante para o gradiente
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
