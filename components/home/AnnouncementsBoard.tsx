import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "../themed-text";

export function AnnouncementsBoard() {
  const announcements = [
    {
      id: "1",
      title: "Nova Política de Benefícios",
      date: "20/01/2025",
      content:
        "Conheça nossa nova política de benefícios com mais vantagens para você!",
    },
    {
      id: "2",
      title: "Evento de Integração",
      date: "18/01/2025",
      content: "Participe do nosso evento de integração no próximo sábado!",
    },
  ];

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Mural de Comunicados</ThemedText>
      <View style={styles.announcementsList}>
        {announcements.map((announcement) => (
          <View key={announcement.id} style={styles.announcementCard}>
            <View style={styles.announcementHeader}>
              <ThemedText style={styles.announcementTitle}>
                {announcement.title}
              </ThemedText>
              <ThemedText style={styles.announcementDate}>
                {announcement.date}
              </ThemedText>
            </View>
            <ThemedText style={styles.announcementContent}>
              {announcement.content}
            </ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#000000",
  },
  announcementsList: {
    gap: 12,
  },
  announcementCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  announcementHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    flex: 1,
  },
  announcementDate: {
    fontSize: 12,
    color: "#999999",
  },
  announcementContent: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
});
