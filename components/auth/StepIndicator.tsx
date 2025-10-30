import React from "react";
import { StyleSheet, View } from "react-native";
import { useThemeColor } from "../../hooks/use-theme-color";
import { ThemedText } from "../themed-text";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  const tintColor = useThemeColor({}, "tint");

  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber <= currentStep;
        const isCurrent = stepNumber === currentStep;

        return (
          <View key={index} style={styles.stepContainer}>
            <View
              style={[
                styles.stepCircle,
                isActive && { backgroundColor: tintColor },
                isCurrent && styles.currentStep,
              ]}
            >
              <ThemedText
                style={[styles.stepNumber, isActive && styles.stepNumberActive]}
              >
                {stepNumber}
              </ThemedText>
            </View>
            {index < totalSteps - 1 && (
              <View
                style={[
                  styles.stepLine,
                  isActive && { backgroundColor: tintColor },
                ]}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  currentStep: {
    borderColor: "#8B5CF6",
    borderWidth: 2,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: "#999",
  },
  stepNumberActive: {
    color: "#FFFFFF",
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 8,
  },
});
