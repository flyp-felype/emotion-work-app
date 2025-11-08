import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "../../../components/themed-text";

export default function LGPDScreen() {
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
        <ThemedText style={styles.headerTitle}>
          Privacidade e Proteção de Dados
        </ThemedText>
        <View style={styles.headerRight} />
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Intro Card */}
        <View style={styles.introCard}>
          <View style={styles.iconContainer}>
            <FontAwesome name="shield" size={48} color="#8B5CF6" />
          </View>
          <ThemedText style={styles.introTitle}>
            Seu bem-estar é nossa prioridade
          </ThemedText>
          <ThemedText style={styles.introText}>
            Valorizamos sua privacidade e estamos comprometidos em proteger seus
            dados pessoais conforme a Lei Geral de Proteção de Dados (LGPD).
          </ThemedText>
        </View>

        {/* Seção: Anonimização */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <FontAwesome name="eye-slash" size={24} color="#8B5CF6" />
            </View>
            <ThemedText style={styles.sectionTitle}>
              Respostas Anônimas
            </ThemedText>
          </View>
          <ThemedText style={styles.sectionText}>
            Suas respostas nos check-ins diários{" "}
            <ThemedText style={styles.bold}>
              não são compartilhadas diretamente com sua empresa
            </ThemedText>
            . Garantimos que a organização não tem acesso individual às suas
            emoções e sentimentos compartilhados.
          </ThemedText>
        </View>

        {/* Seção: Visão Macro */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <FontAwesome name="bar-chart" size={24} color="#8B5CF6" />
            </View>
            <ThemedText style={styles.sectionTitle}>
              Apenas Dados Agregados
            </ThemedText>
          </View>
          <ThemedText style={styles.sectionText}>
            A empresa tem acesso apenas a{" "}
            <ThemedText style={styles.bold}>
              dados consolidados e estatísticos
            </ThemedText>
            , como tendências gerais de bem-estar da equipe, sem qualquer
            identificação individual. Isso permite que a organização melhore o
            ambiente de trabalho sem comprometer sua privacidade.
          </ThemedText>
        </View>

        {/* Seção: Separação de Dados */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <FontAwesome name="database" size={24} color="#8B5CF6" />
            </View>
            <ThemedText style={styles.sectionTitle}>
              Armazenamento Seguro
            </ThemedText>
          </View>
          <ThemedText style={styles.sectionText}>
            Seus dados pessoais são armazenados{" "}
            <ThemedText style={styles.bold}>
              separadamente das suas respostas individuais
            </ThemedText>
            . Utilizamos técnicas avançadas de isolamento de dados para garantir
            que não seja possível vincular suas informações pessoais às suas
            respostas emocionais.
          </ThemedText>
        </View>

        {/* Seção: Criptografia */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <FontAwesome name="lock" size={24} color="#8B5CF6" />
            </View>
            <ThemedText style={styles.sectionTitle}>
              Criptografia de Ponta
            </ThemedText>
          </View>
          <ThemedText style={styles.sectionText}>
            Todos os seus dados sensíveis são{" "}
            <ThemedText style={styles.bold}>
              criptografados utilizando tecnologia de última geração
            </ThemedText>
            . Isso significa que suas informações são transformadas em códigos
            que só podem ser lidos por sistemas autorizados, protegendo-as
            contra acessos não autorizados.
          </ThemedText>
        </View>

        {/* Seção: Seus Direitos */}
        <View style={styles.rightsCard}>
          <ThemedText style={styles.rightsTitle}>Seus Direitos</ThemedText>
          <ThemedText style={styles.rightsIntro}>
            De acordo com a LGPD, você tem direito a:
          </ThemedText>

          <View style={styles.rightsList}>
            <View style={styles.rightItem}>
              <FontAwesome name="check-circle" size={16} color="#10B981" />
              <ThemedText style={styles.rightText}>
                Acessar seus dados pessoais
              </ThemedText>
            </View>

            <View style={styles.rightItem}>
              <FontAwesome name="check-circle" size={16} color="#10B981" />
              <ThemedText style={styles.rightText}>
                Corrigir dados incompletos ou desatualizados
              </ThemedText>
            </View>

            <View style={styles.rightItem}>
              <FontAwesome name="check-circle" size={16} color="#10B981" />
              <ThemedText style={styles.rightText}>
                Solicitar a exclusão de seus dados
              </ThemedText>
            </View>

            <View style={styles.rightItem}>
              <FontAwesome name="check-circle" size={16} color="#10B981" />
              <ThemedText style={styles.rightText}>
                Revogar consentimentos a qualquer momento
              </ThemedText>
            </View>

            <View style={styles.rightItem}>
              <FontAwesome name="check-circle" size={16} color="#10B981" />
              <ThemedText style={styles.rightText}>
                Solicitar a portabilidade de seus dados
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <FontAwesome name="info-circle" size={16} color="#666666" />
          <ThemedText style={styles.footerText}>
            Última atualização: 08 de Fevereiro de 2025
          </ThemedText>
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
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    flex: 1,
    textAlign: "center",
    paddingHorizontal: 8,
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
  iconContainer: {
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
    marginBottom: 12,
    textAlign: "center",
  },
  introText: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    lineHeight: 22,
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F5F3FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
    flex: 1,
  },
  sectionText: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 22,
  },
  bold: {
    fontWeight: "600",
    color: "#000000",
  },
  rightsCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rightsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 12,
  },
  rightsIntro: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 16,
  },
  rightsList: {
    gap: 12,
  },
  rightItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  rightText: {
    flex: 1,
    fontSize: 14,
    color: "#333333",
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    gap: 8,
  },
  footerText: {
    fontSize: 12,
    color: "#666666",
  },
});
