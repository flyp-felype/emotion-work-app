import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useThemeColor } from "../../hooks/use-theme-color";
import { ThemedText } from "../themed-text";

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
  const [inputValue, setInputValue] = useState("");

  const borderColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");

  // Sincroniza o texto do input quando o valor externo (Date) muda
  useEffect(() => {
    if (value) {
      const day = value.getDate().toString().padStart(2, "0");
      const month = (value.getMonth() + 1).toString().padStart(2, "0");
      const year = value.getFullYear();
      setInputValue(`${day}/${month}/${year}`);
    }
  }, [value]);

  // Função para aplicar máscara e validar a data digitada
  const handleTextChange = (text: string) => {
    // Remove tudo que não é número
    const cleaned = text.replace(/[^0-9]/g, "");
    let formatted = cleaned;

    // Aplica a máscara DD/MM/AAAA
    if (cleaned.length > 2) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    if (cleaned.length > 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(
        2,
        4
      )}/${cleaned.slice(4, 8)}`;
    }

    setInputValue(formatted);

    // Se a data estiver completa (10 caracteres: DD/MM/AAAA), tenta converter
    if (formatted.length === 10) {
      const day = parseInt(formatted.slice(0, 2));
      const month = parseInt(formatted.slice(3, 5)) - 1; // Meses em JS são 0-11
      const year = parseInt(formatted.slice(6, 10));

      const dateObj = new Date(year, month, day);

      // Verifica se é uma data válida e respeita os limites
      if (
        dateObj.getDate() === day &&
        dateObj.getMonth() === month &&
        dateObj.getFullYear() === year
      ) {
        // Valida limites (máximo e mínimo)
        if (maximumDate && dateObj > maximumDate) return;
        if (minimumDate && dateObj < minimumDate) return;

        onChange(dateObj);
      }
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    // No Android, fechar o picker ao selecionar
    if (Platform.OS === "android") {
      setShowPicker(false);
    }

    if (selectedDate) {
      onChange(selectedDate);
      // No iOS, mantemos o picker aberto até confirmação explicíta ou deixamos o usuário fechar clicando fora,
      // mas aqui vamos fechar para simplificar a UX híbrida
      setShowPicker(false);
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <View
        style={[
          styles.inputContainer,
          { borderColor: isFocused ? borderColor : "#E0E0E0" },
        ]}
      >
        <TextInput
          style={[styles.input, { color: textColor }]}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={inputValue}
          onChangeText={handleTextChange}
          keyboardType="numeric"
          maxLength={10} // DD/MM/AAAA
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <TouchableOpacity onPress={() => setShowPicker(true)}>
          <ThemedText style={styles.calendarIcon}>📅</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Renderização condicional do Picker */}
      {showPicker &&
        (Platform.OS === "ios" ? (
          // Modal para iOS para evitar quebras de layout
          <Modal transparent animationType="fade" visible={showPicker}>
            <TouchableWithoutFeedback onPress={() => setShowPicker(false)}>
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <DateTimePicker
                    value={value || new Date()}
                    mode="date"
                    display="inline" // 'inline' no iOS é muito melhor para selecionar ano/mês
                    onChange={handleDateChange}
                    maximumDate={maximumDate || new Date()}
                    minimumDate={minimumDate}
                    locale="pt-BR"
                  />
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setShowPicker(false)}
                  >
                    <ThemedText style={{ color: "white", fontWeight: "bold" }}>
                      Confirmar
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        ) : (
          <DateTimePicker
            value={value || new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={maximumDate || new Date()}
            minimumDate={minimumDate}
            locale="pt-BR"
          />
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 50,
    backgroundColor: "#F8F9FA",
  },
  input: { flex: 1, fontSize: 16 },
  calendarIcon: { fontSize: 20, marginLeft: 10 },
  // Estilos extras para o Modal iOS
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    alignItems: "center",
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
});
