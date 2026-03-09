import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "../../../components/themed-text";
import {
    createVoucher,
    getPromotionDetail,
    PromotionDetail,
} from "../../../services/api";

export default function PromotionDetailScreen() {
    const params = useLocalSearchParams();
    const { promotionId, userPoints } = params;

    const [promotion, setPromotion] = useState<PromotionDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    const currentUserPoints = Number(userPoints ?? 0);

    useEffect(() => {
        loadPromotion();
    }, [promotionId]);

    const loadPromotion = async () => {
        if (!promotionId || typeof promotionId !== "string") return;
        try {
            setLoading(true);
            const data = await getPromotionDetail(promotionId);
            setPromotion(data);
        } catch (error) {
            console.error("Erro ao carregar promoção:", error);
            Alert.alert("Erro", "Não foi possível carregar os detalhes da promoção.", [
                { text: "Voltar", onPress: () => router.back() },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateVoucher = async () => {
        if (!promotion) return;
        try {
            setGenerating(true);
            const voucher = await createVoucher(promotion.uuid);
            router.replace({
                pathname: "/(tabs)/stores/redeem",
                params: {
                    voucherUuid: voucher.uuid,
                    promotionTitle: voucher.promotion_title,
                    promotionIcon: voucher.promotion_icon,
                    promotionPoints: voucher.promotion_points,
                    promotionDescription: voucher.promotion_description,
                    expiresAt: voucher.expires_at,
                    status: voucher.status,
                    storeName: promotion.partner_company.name,
                },
            });
        } catch (error: any) {
            const message =
                error?.response?.data?.detail ||
                "Não foi possível gerar o voucher. Tente novamente.";
            Alert.alert("Erro", message);
        } finally {
            setGenerating(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#8B5CF6" />
                <ThemedText style={styles.loadingText}>
                    Carregando promoção...
                </ThemedText>
            </SafeAreaView>
        );
    }

    if (!promotion) {
        return (
            <SafeAreaView style={[styles.container, styles.centerContent]}>
                <ThemedText>Promoção não encontrada</ThemedText>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButtonSimple}>
                    <ThemedText style={styles.backButtonText}>Voltar</ThemedText>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const canRedeem = currentUserPoints >= promotion.points_required;
    const pointsDiff = promotion.points_required - currentUserPoints;

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            {/* Header */}
            <LinearGradient
                colors={["#8B5CF6", "#F87171"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <ThemedText style={styles.headerTitle}>Detalhe da Promoção</ThemedText>
                <View style={styles.headerRight} />
            </LinearGradient>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Promotion Hero Card */}
                <View style={styles.heroCard}>
                    <View style={styles.iconContainer}>
                        <MaterialIcons
                            name={(promotion.icon as any) || "local-offer"}
                            size={56}
                            color="#8B5CF6"
                        />
                    </View>

                    <ThemedText style={styles.promotionTitle}>{promotion.title}</ThemedText>
                    <ThemedText style={styles.storeName}>
                        {promotion.partner_company.name}
                    </ThemedText>

                    <View style={styles.pointsBadge}>
                        <MaterialIcons name="card-giftcard" size={18} color="#8B5CF6" />
                        <ThemedText style={styles.pointsBadgeText}>
                            {promotion.points_required} emotions
                        </ThemedText>
                    </View>
                </View>

                {/* Description Card */}
                <View style={styles.card}>
                    <ThemedText style={styles.cardTitle}>Descrição</ThemedText>
                    <ThemedText style={styles.descriptionText}>
                        {promotion.description}
                    </ThemedText>
                </View>

                {/* Details Card */}
                <View style={styles.card}>
                    <ThemedText style={styles.cardTitle}>Detalhes</ThemedText>

                    <View style={styles.detailRow}>
                        <MaterialIcons name="access-time" size={18} color="#8B5CF6" />
                        <ThemedText style={styles.detailText}>
                            Válido por {promotion.expires_in_days} dias após geração
                        </ThemedText>
                    </View>

                    <View style={styles.detailRow}>
                        <MaterialIcons name="confirmation-number" size={18} color="#8B5CF6" />
                        <ThemedText style={styles.detailText}>
                            Máximo de {promotion.max_vouchers} vouchers disponíveis
                        </ThemedText>
                    </View>

                    <View style={styles.detailRow}>
                        <MaterialIcons name="business" size={18} color="#8B5CF6" />
                        <ThemedText style={styles.detailText}>
                            {promotion.partner_company.category.name}
                        </ThemedText>
                    </View>
                </View>

                {/* Points Status Card */}
                <LinearGradient
                    colors={canRedeem ? ["#8B5CF6", "#A78BFA"] : ["#9CA3AF", "#6B7280"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.pointsCard}
                >
                    <View style={styles.pointsRow}>
                        <View style={styles.pointsBlock}>
                            <ThemedText style={styles.pointsLabel}>Seus Emotions</ThemedText>
                            <ThemedText style={styles.pointsValue}>
                                {currentUserPoints}
                            </ThemedText>
                        </View>

                        <View style={styles.pointsDivider} />

                        <View style={styles.pointsBlock}>
                            <ThemedText style={styles.pointsLabel}>Necessário</ThemedText>
                            <ThemedText style={styles.pointsValue}>
                                {promotion.points_required}
                            </ThemedText>
                        </View>
                    </View>

                    {canRedeem ? (
                        <View style={styles.statusRow}>
                            <MaterialIcons name="check-circle" size={16} color="#FFFFFF" />
                            <ThemedText style={styles.statusText}>
                                Você tem pontos suficientes!
                            </ThemedText>
                        </View>
                    ) : (
                        <View style={styles.statusRow}>
                            <MaterialIcons name="info" size={16} color="#FFFFFF" />
                            <ThemedText style={styles.statusText}>
                                Faltam {pointsDiff} emotions para resgatar
                            </ThemedText>
                        </View>
                    )}
                </LinearGradient>

                {/* Action Button */}
                {canRedeem ? (
                    <TouchableOpacity
                        style={[styles.redeemButton, generating && styles.redeemButtonLoading]}
                        onPress={handleGenerateVoucher}
                        disabled={generating}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={["#8B5CF6", "#F87171"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.redeemButtonGradient}
                        >
                            {generating ? (
                                <>
                                    <ActivityIndicator size="small" color="#FFFFFF" />
                                    <ThemedText style={styles.redeemButtonText}>
                                        Gerando voucher...
                                    </ThemedText>
                                </>
                            ) : (
                                <>
                                    <MaterialIcons name="local-activity" size={20} color="#FFFFFF" />
                                    <ThemedText style={styles.redeemButtonText}>
                                        Gerar Voucher
                                    </ThemedText>
                                </>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.disabledButton}>
                        <MaterialIcons name="lock" size={20} color="#9CA3AF" />
                        <ThemedText style={styles.disabledButtonText}>
                            Pontos insuficientes
                        </ThemedText>
                    </View>
                )}

                {/* Info note */}
                <View style={styles.infoNote}>
                    <MaterialIcons name="info-outline" size={16} color="#6B7280" />
                    <ThemedText style={styles.infoNoteText}>
                        Ao gerar o voucher, os pontos serão debitados imediatamente.
                        O voucher será válido por {promotion.expires_in_days} dias.
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
    centerContent: {
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: "#666666",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
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
        paddingHorizontal: 20,
        paddingTop: 24,
        gap: 16,
    },
    heroCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 28,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    iconContainer: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: "#F5F3FF",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    promotionTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#111827",
        textAlign: "center",
        marginBottom: 6,
    },
    storeName: {
        fontSize: 15,
        color: "#6B7280",
        marginBottom: 16,
    },
    pointsBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F5F3FF",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    pointsBadgeText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#8B5CF6",
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        gap: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 4,
    },
    descriptionText: {
        fontSize: 14,
        color: "#4B5563",
        lineHeight: 22,
    },
    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    detailText: {
        fontSize: 14,
        color: "#4B5563",
        flex: 1,
    },
    pointsCard: {
        borderRadius: 16,
        padding: 20,
        gap: 12,
        shadowColor: "#8B5CF6",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    pointsRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
    },
    pointsBlock: {
        alignItems: "center",
        flex: 1,
    },
    pointsDivider: {
        width: 1,
        height: 40,
        backgroundColor: "rgba(255,255,255,0.4)",
    },
    pointsLabel: {
        fontSize: 12,
        color: "rgba(255,255,255,0.8)",
        marginBottom: 4,
    },
    pointsValue: {
        fontSize: 28,
        fontWeight: "800",
        color: "#FFFFFF",
    },
    statusRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
    },
    statusText: {
        fontSize: 13,
        color: "#FFFFFF",
        fontWeight: "500",
    },
    redeemButton: {
        borderRadius: 14,
        overflow: "hidden",
        shadowColor: "#8B5CF6",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
    },
    redeemButtonLoading: {
        opacity: 0.85,
    },
    redeemButtonGradient: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        gap: 10,
    },
    redeemButtonText: {
        fontSize: 17,
        fontWeight: "700",
        color: "#FFFFFF",
    },
    disabledButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F3F4F6",
        borderRadius: 14,
        paddingVertical: 16,
        gap: 10,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    disabledButtonText: {
        fontSize: 17,
        fontWeight: "600",
        color: "#9CA3AF",
    },
    infoNote: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 8,
        backgroundColor: "#F0FDF4",
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: "#BBF7D0",
    },
    infoNoteText: {
        flex: 1,
        fontSize: 13,
        color: "#166534",
        lineHeight: 19,
    },
    backButtonSimple: {
        marginTop: 20,
        padding: 10,
    },
    backButtonText: {
        color: "#8B5CF6",
        fontSize: 16,
    },
});
