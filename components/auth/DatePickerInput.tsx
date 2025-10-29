import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useThemeColor } from "../../../hooks/use-theme-color";
import { ThemedText } from "../../themed-text";

interface DatePickerInputProps {
  label: string;
  placeholder: string;
  value: Date | null;
  onChange: (date: Date) => void;
  maximumDate?: Date;
  minimumDate?: Date;
}

export function DatePickerInput({
  label,
  placeholder,
  value,
  onChange,
  maximumDate,
  minimumDate,
}: DatePickerInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const borderColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }

    if (selectedDate) {
      onChange(selectedDate);
      if (Platform.OS === "ios") {
        setShowPicker(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={[
          styles.inputContainer,
          { borderColor: isFocused ? borderColor : "#E0E0E0" },
        ]}
      >
        <TextInput
          style={[styles.input, { color: textColor }]}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={formatDate(value)}
          editable={false}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <ThemedText style={styles.calendarIcon}>📅</ThemedText>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
          maximumDate={maximumDate || new Date()}
          minimumDate={minimumDate}
          locale="pt-BR"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 50,
    backgroundColor: "#F8F9FA",
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  calendarIcon: {
    fontSize: 20,
  },
});
