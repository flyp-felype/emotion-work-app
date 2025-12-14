import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { ThemedText } from "../themed-text";
import { DatePickerInput } from "./DatePickerInput";
import { InputField } from "./InputField";
import { LoginButton } from "./LoginButton";
import { StepIndicator } from "./StepIndicator";

interface FirstAccessFormProps {
  onCheckUser: (data: {
    cpf: string;
    name: string;
    matricula: string;
    dataNascimento: Date;
  }) => Promise<boolean>; // Retorna true se o usuário for encontrado
  onSubmit: (data: {
    email: string;
    senha: string;
    confirmarSenha: string;
  }) => Promise<void>;
  onBack: () => void;
}

export function FirstAccessForm({
  onSubmit,
  onBack,
  onCheckUser,
}: FirstAccessFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Dados dos steps
  const [name, setName] = useState(""); // Novo campo
  const [cpf, setCpf] = useState("");
  const [matricula, setMatricula] = useState("");
  const [dataNascimento, setDataNascimento] = useState<Date | null>(null);

  const [email, setEmail] = useState(""); // Novo campo
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

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      if (!name.trim()) {
        Alert.alert("Erro", "Por favor, digite seu nome completo");
        return;
      }
      const formattedCPF = cpf.replace(/\D/g, "");
      if (!validateCPF(formattedCPF)) {
        Alert.alert("Erro", "Por favor, digite um CPF válido");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (matricula.trim().length < 1) {
        Alert.alert("Erro", "Por favor, digite sua matrícula");
        return;
      }

      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!dataNascimento) {
        Alert.alert("Erro", "Por favor, selecione uma data de nascimento");
        return;
      }

      // AQUI: Executa a verificação na API antes de liberar a criação de senha
      setLoading(true);
      try {
        const isValid = await onCheckUser({
          cpf,
          name,
          matricula,
          dataNascimento,
        });

        if (isValid) {
          setCurrentStep(4);
        }
      } catch (e) {
        // Erro já tratado no pai ou alerta padrão
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const handleFinalSubmit = async () => {
    if (!validateEmail(email)) {
      Alert.alert("Erro", "Digite um e-mail válido");
      return;
    }
    if (senha.length < 8) {
      Alert.alert("Erro", "A senha deve ter no mínimo 8 caracteres");
      return;
    }
    if (!/[A-Z]/.test(senha)) {
      Alert.alert("Erro", "A senha deve conter pelo menos uma letra maiúscula");
      return;
    }

    if (!/[0-9]/.test(senha)) {
      Alert.alert("Erro", "A senha deve conter pelo menos um número");
      return;
    }

    if (!/[a-z]/.test(senha)) {
      Alert.alert("Erro", "A senha deve conter pelo menos uma letra minúscula");
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ email, senha, confirmarSenha });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StepIndicator currentStep={currentStep} totalSteps={4} />

      {currentStep === 1 && (
        <View style={styles.stepContent}>
          <ThemedText style={styles.stepTitle}>Identificação</ThemedText>
          <InputField
            label="Nome Completo"
            placeholder="Digite seu nome"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
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
          <ThemedText style={styles.stepTitle}>
            Vínculo com a Empresa
          </ThemedText>
          <InputField
            label="Matrícula"
            placeholder="Digite sua matrícula"
            value={matricula}
            onChangeText={setMatricula}
            // REMOVA ou MUDE o keyboardType para "default"
            // keyboardType="numeric" <--- REMOVER ISSO
            autoCapitalize="characters" // Sugestão: Forçar maiúsculas visualmente
          />
        </View>
      )}

      {currentStep === 3 && (
        <View style={styles.stepContent}>
          <ThemedText style={styles.stepTitle}>Data de Nascimento</ThemedText>
          <DatePickerInput
            label="Data de Nascimento"
            placeholder="DD/MM/AAAA"
            value={dataNascimento}
            onChange={setDataNascimento}
            maximumDate={new Date()}
          />
        </View>
      )}

      {currentStep === 4 && (
        <View style={styles.stepContent}>
          <ThemedText style={styles.stepTitle}>Finalizar Cadastro</ThemedText>
          <InputField
            label="Seu melhor E-mail"
            placeholder="exemplo@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <InputField
            label="Crie uma Senha"
            placeholder="Mínimo 6 caracteres"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />
          <InputField
            label="Confirme a Senha"
            placeholder="Repita a senha"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry
          />
        </View>
      )}

      <View style={styles.buttonContainer}>
        {currentStep < 4 ? (
          <>
            <LoginButton
              title={loading ? "Verificando..." : "Continuar"}
              onPress={handleNext}
              variant="primary"
              disabled={loading}
              loading={loading}
            />
            <LoginButton
              title="Voltar"
              onPress={handleBackStep}
              variant="secondary"
              disabled={loading}
            />
          </>
        ) : (
          <>
            <LoginButton
              title="Finalizar Cadastro"
              onPress={handleFinalSubmit}
              loading={loading}
              disabled={loading}
              variant="primary"
            />
            <LoginButton
              title="Voltar"
              onPress={handleBackStep}
              variant="secondary"
              disabled={loading}
            />
          </>
        )}
      </View>
    </View>
  );
}
// styles...
const styles = StyleSheet.create({
  container: { width: "100%" },
  stepContent: { marginBottom: 32 },
  stepTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  buttonContainer: { marginTop: 20 },
});
