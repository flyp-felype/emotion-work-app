import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { ThemedText } from "../../themed-text";
import { DatePickerInput } from "./DatePickerInput";
import { InputField } from "./InputField";
import { LoginButton } from "./LoginButton";
import { StepIndicator } from "./StepIndicator";

interface FirstAccessFormProps {
  onSubmit: (data: {
    cpf: string;
    dataNascimento: Date;
    senha: string;
    confirmarSenha: string;
  }) => Promise<void>;
  onBack: () => void;
}

export function FirstAccessForm({ onSubmit, onBack }: FirstAccessFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Dados dos steps
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState<Date | null>(null);
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    return value;
  };

  const validateCPF = (cpf: string) => {
    const numbers = cpf.replace(/\D/g, "");
    return numbers.length === 11;
  };

  const validateDate = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 100); // Máximo 100 anos
    return date <= today && date >= minDate;
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      const formattedCPF = cpf.replace(/\D/g, "");
      if (!validateCPF(formattedCPF)) {
        Alert.alert("Erro", "Por favor, digite um CPF válido");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!dataNascimento || !validateDate(dataNascimento)) {
        Alert.alert(
          "Erro",
          "Por favor, selecione uma data de nascimento válida"
        );
        return;
      }
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const handleSubmit = async () => {
    if (!validatePassword(senha)) {
      Alert.alert("Erro", "A senha deve ter no mínimo 6 caracteres");
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem");
      return;
    }

    if (!dataNascimento) {
      Alert.alert("Erro", "Data de nascimento inválida");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        cpf: cpf.replace(/\D/g, ""),
        dataNascimento,
        senha,
        confirmarSenha,
      });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível criar sua conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StepIndicator currentStep={currentStep} totalSteps={3} />

      {currentStep === 1 && (
        <View style={styles.stepContent}>
          <ThemedText style={styles.stepTitle}>CPF do Colaborador</ThemedText>
          <ThemedText style={styles.stepDescription}>
            Digite seu CPF para verificar sua identidade
          </ThemedText>
          <InputField
            label="CPF"
            placeholder="000.000.000-00"
            value={cpf}
            onChangeText={(text) => setCpf(formatCPF(text))}
            keyboardType="numeric"
          />
        </View>
      )}

      {currentStep === 2 && (
        <View style={styles.stepContent}>
          <ThemedText style={styles.stepTitle}>Data de Nascimento</ThemedText>
          <ThemedText style={styles.stepDescription}>
            Informe sua data de nascimento
          </ThemedText>
          <DatePickerInput
            label="Data de Nascimento"
            placeholder="DD/MM/AAAA"
            value={dataNascimento}
            onChange={setDataNascimento}
            maximumDate={new Date()}
          />
        </View>
      )}

      {currentStep === 3 && (
        <View style={styles.stepContent}>
          <ThemedText style={styles.stepTitle}>Criar Senha</ThemedText>
          <ThemedText style={styles.stepDescription}>
            Defina uma senha segura para sua conta
          </ThemedText>
          <InputField
            label="Senha"
            placeholder="Digite sua senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />
          <InputField
            label="Confirmar Senha"
            placeholder="Digite novamente sua senha"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry
          />
        </View>
      )}

      <View style={styles.buttonContainer}>
        {currentStep < 3 ? (
          <>
            <LoginButton
              title="Continuar"
              onPress={handleNext}
              variant="primary"
            />
            <LoginButton
              title="Voltar"
              onPress={handleBack}
              variant="secondary"
            />
          </>
        ) : (
          <>
            <LoginButton
              title="Finalizar"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
              variant="primary"
            />
            <LoginButton
              title="Voltar"
              onPress={handleBack}
              variant="secondary"
              disabled={loading}
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  stepContent: {
    marginBottom: 32,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  stepDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 24,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 20,
  },
});
