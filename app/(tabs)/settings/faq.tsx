import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "../../../components/themed-text";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export default function FAQScreen() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const faqItems: FAQItem[] = [
    {
      id: "1",
      question: "A empresa consegue saber minha resposta individual?",
      answer:
        "Não. Suas respostas são completamente anônimas e a empresa não tem acesso a informações individuais. A organização visualiza apenas dados agregados e estatísticos, sem qualquer identificação pessoal. Seu bem-estar e privacidade são nossa prioridade.",
    },
    {
      id: "2",
      question: "Como eu faço para solicitar meus dados pela LGPD?",
      answer:
        "Você pode solicitar seus dados através das configurações do app, na seção 'LGPD', ou entrando em contato com nosso suporte através do email privacidade@emotionwork.com. Responderemos sua solicitação em até 15 dias úteis, conforme estabelecido pela Lei Geral de Proteção de Dados.",
    },
    {
      id: "3",
      question: "O que são os pontos e como posso usá-los?",
      answer:
        "Os pontos são recompensas que você ganha ao realizar check-ins diários. Você pode acumular pontos e trocá-los por benefícios na seção 'Recompensas', como descontos em parceiros, vale-presente, entre outros. Cada check-in realizado vale 50 pontos.",
    },
    {
      id: "4",
      question: "Com que frequência devo fazer o check-in?",
      answer:
        "Recomendamos fazer o check-in diariamente, preferencialmente sempre no mesmo horário. Isso ajuda a criar um hábito saudável de autoconhecimento e permite que você acompanhe melhor sua jornada emocional ao longo do tempo.",
    },
    {
      id: "5",
      question: "Posso deletar minha conta?",
      answer:
        "Sim. Você pode deletar sua conta a qualquer momento através das Configurações. Ao deletar sua conta, todos os seus dados pessoais serão permanentemente removidos de nossos sistemas. Esta ação é irreversível.",
    },
    {
      id: "6",
      question: "Minhas respostas ficam salvas por quanto tempo?",
      answer:
        "Suas respostas ficam salvas enquanto sua conta estiver ativa. Você pode visualizar todo seu histórico na seção 'Extrato'. Se você deletar sua conta, todos os dados serão permanentemente removidos. Caso fique inativo, mantemos os dados por até 2 anos antes da exclusão automática.",
    },
    {
      id: "7",
      question: "Como funciona a criptografia dos meus dados?",
      answer:
        "Utilizamos criptografia de ponta a ponta (AES-256) para proteger todos os seus dados sensíveis. Isso significa que suas informações são transformadas em códigos complexos que só podem ser lidos por sistemas autorizados, garantindo máxima segurança.",
    },
    {
      id: "8",
      question: "Posso usar o app fora do horário de trabalho?",
      answer:
        "Sim! Você pode fazer check-ins a qualquer momento. Embora o app seja focado em bem-estar no trabalho, entendemos que suas emoções não seguem um horário comercial. Use o app sempre que sentir necessidade.",
    },
  ];

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <LinearGradient
        colors={["#8B5CF6", "#F87171"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <FontAwesome name="arrow-left" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Dúvidas Frequentes</ThemedText>
        <View style={styles.headerRight} />
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Intro */}
        <View style={styles.introCard}>
          <View style={styles.introIconContainer}>
            <FontAwesome name="question-circle" size={48} color="#8B5CF6" />
          </View>
          <ThemedText style={styles.introTitle}>
            Como podemos ajudar?
          </ThemedText>
          <ThemedText style={styles.introText}>
            Encontre respostas para as perguntas mais comuns sobre o app
          </ThemedText>
        </View>

        {/* FAQ Items */}
        <View style={styles.faqList}>
          {faqItems.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.faqItem,
                expandedId === item.id && styles.faqItemExpanded,
              ]}
            >
              <TouchableOpacity
                style={styles.faqQuestion}
                onPress={() => toggleExpand(item.id)}
                activeOpacity={0.7}
              >
                <View style={styles.questionLeft}>
                  <View style={styles.questionNumber}>
                    <ThemedText style={styles.questionNumberText}>
                      {index + 1}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.questionText}>
                    {item.question}
                  </ThemedText>
                </View>
                <FontAwesome
                  name={expandedId === item.id ? "chevron-up" : "chevron-down"}
                  size={16}
                  color="#8B5CF6"
                />
              </TouchableOpacity>

              {expandedId === item.id && (
                <View style={styles.faqAnswer}>
                  <ThemedText style={styles.answerText}>
                    {item.answer}
                  </ThemedText>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Contact Card */}
        <View style={styles.contactCard}>
          <ThemedText style={styles.contactTitle}>
            Não encontrou sua resposta?
          </ThemedText>
          <ThemedText style={styles.contactText}>
            Entre em contato com nosso suporte
          </ThemedText>
          <TouchableOpacity style={styles.contactButton} activeOpacity={0.8}>
            <LinearGradient
              colors={["#8B5CF6", "#F87171"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.contactButtonGradient}
            >
              <FontAwesome name="envelope" size={18} color="#FFFFFF" />
              <ThemedText style={styles.contactButtonText}>
                Enviar Mensagem
              </ThemedText>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  introCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  introIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F5F3FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 8,
  },
  introText: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
  },
  faqList: {
    marginHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },
  faqItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  faqItemExpanded: {
    borderWidth: 2,
    borderColor: "#8B5CF6",
  },
  faqQuestion: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  questionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  questionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F5F3FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  questionNumberText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#8B5CF6",
  },
  questionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#000000",
    lineHeight: 22,
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 4,
    backgroundColor: "#F8F9FA",
  },
  answerText: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 22,
    paddingLeft: 44, // Alinha com o texto da pergunta
  },
  contactCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 8,
    textAlign: "center",
  },
  contactText: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 20,
    textAlign: "center",
  },
  contactButton: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
  },
  contactButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 8,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
