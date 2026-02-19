import { FontAwesome, FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "../../components/themed-text";
import { postCheckin } from "../../services/api";

type EmotionType = "very-happy" | "happy" | "neutral" | "sad" | "very-sad";
type ImageType = "1" | "2" | "3" | "4";

interface CheckInData {
  emotion?: EmotionType;
  selectedImages?: ImageType[];
  selfie?: string;
}

export default function CheckInScreen() {
  const [step, setStep] = useState<1 | 2 | 3 | "success">(1);
  const [checkInData, setCheckInData] = useState<CheckInData>({});
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraType, setCameraType] = useState<CameraType>("front");
  const cameraRef = useRef<CameraView>(null);
  const [loading, setLoading] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");

  const handleEmotionSelect = (emotion: EmotionType) => {
    setCheckInData({ ...checkInData, emotion });
  };

  const handleImageToggle = (image: ImageType) => {
    const currentImages = checkInData.selectedImages || [];
    const newImages = currentImages.includes(image)
      ? currentImages.filter((img) => img !== image)
      : [...currentImages, image];
    setCheckInData({ ...checkInData, selectedImages: newImages });
  };

  const handleStartCamera = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert(
          "Permissão necessária",
          "Precisamos de acesso à câmera para tirar a selfie."
        );
        return;
      }
    }
    setIsCameraOpen(true);
  };

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7,
          base64: true,
        });

        if (photo?.base64) {
          setCheckInData({
            ...checkInData,
            selfie: `data:image/jpg;base64,${photo.base64}`,
          });
          setIsCameraOpen(false);
        }
      } catch (error) {
        Alert.alert("Erro", "Não foi possível capturar a foto.");
      }
    }
  };

  const handleRetake = () => {
    setCheckInData({ ...checkInData, selfie: undefined });
    handleStartCamera();
  };

  const getEmotionScore = (emotion: EmotionType): number => {
    switch (emotion) {
      case "very-happy":
        return 5;
      case "happy":
        return 4;
      case "neutral":
        return 3;
      case "sad":
        return 2;
      case "very-sad":
        return 1;
      default:
        return 3;
    }
  };

  const getImageScore = (images: ImageType[]): number => {
    if (!images || images.length === 0) return 3;

    const sum = images.reduce((acc, img) => acc + parseInt(img), 0);
    const average = sum / images.length;
    return Math.round(average);
  };

  const handleNext = async () => {
    if (step === 1 && !checkInData.emotion) {
      Alert.alert(
        "Atenção",
        "Por favor, selecione como você está se sentindo."
      );
      return;
    }
    if (
      step === 2 &&
      (!checkInData.selectedImages || checkInData.selectedImages.length === 0)
    ) {
      Alert.alert("Atenção", "Por favor, selecione pelo menos uma imagem.");
      return;
    }
    if (step === 3 && !checkInData.selfie) {
      Alert.alert("Atenção", "Por favor, tire uma selfie para continuar.");
      return;
    }

    if (step === 3) {
      await submitCheckIn();
    } else {
      setStep(((step as number) + 1) as 1 | 2 | 3);
    }
  };

  const submitCheckIn = async () => {
    if (
      !checkInData.emotion ||
      !checkInData.selectedImages ||
      !checkInData.selfie
    )
      return;

    setLoading(true);
    try {
      const emotionScore = getEmotionScore(checkInData.emotion);
      const imageScore = getImageScore(checkInData.selectedImages);

      // Remove prefixo do base64 se existir, pois alguns backends preferem sem
      const base64Data = checkInData.selfie.includes("base64,")
        ? checkInData.selfie.split("base64,")[1]
        : checkInData.selfie;

      const response = await postCheckin({
        emotion_score: emotionScore,
        image_score: imageScore,
        selfie_base64: base64Data,
      });

      setPointsEarned(response.points_earned);
      setSuccessMessage(response.message || "Check-in realizado com sucesso");
      setStep("success");
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.response?.data?.message ||
        "Ocorreu um erro ao enviar seu check-in. Tente novamente."
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 1) {
      router.back();
    } else if (step !== "success") {
      setStep(((step as number) - 1) as 1 | 2 | 3);
    }
  };

  const handleGoHome = () => {
    setStep(1);
    setCheckInData({});
    setPointsEarned(0);
    setSuccessMessage("");
    router.push("/(tabs)");
  };

  const emotions = [
    {
      type: "very-happy" as EmotionType,
      icon: "face-grin",
      label: "Muito Feliz",
      color: "#10B981",
    },
    {
      type: "happy" as EmotionType,
      icon: "face-smile",
      label: "Feliz",
      color: "#8B5CF6",
    },
    {
      type: "neutral" as EmotionType,
      icon: "face-meh",
      label: "Neutro",
      color: "#F59E0B",
    },
    {
      type: "sad" as EmotionType,
      icon: "face-frown",
      label: "Triste",
      color: "#F97316",
    },
    {
      type: "very-sad" as EmotionType,
      icon: "face-frown-open",
      label: "Muito Triste",
      color: "#EF4444",
    },
  ];

  const images = [
    {
      type: "1" as ImageType,
      source: require("../../assets/images/psy/1.png"),
    },
    {
      type: "2" as ImageType,
      source: require("../../assets/images/psy/2.png"),
    },
    {
      type: "3" as ImageType,
      source: require("../../assets/images/psy/3.png"),
    },
    {
      type: "4" as ImageType,
      source: require("../../assets/images/psy/4.png"),
    },
  ];

  if (step === "success") {
    return (
      <View style={styles.successContainer}>
        <LinearGradient
          colors={["#8B5CF6", "#F87171"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.successGradient}
        >
          <View style={styles.successContent}>
            <View style={styles.successIconContainer}>
              <FontAwesome name="check-circle" size={80} color="#FFFFFF" />
            </View>

            <Text style={styles.successTitle}>Parabéns!</Text>
            <Text style={styles.successSubtitle}>{successMessage}</Text>

            <Text style={styles.successMessage}>
              Obrigado por compartilhar seu dia conosco! Sua participação é
              muito importante para construirmos um ambiente de trabalho cada
              vez melhor.
            </Text>

            <View style={styles.pointsEarnedContainer}>
              <FontAwesome name="gift" size={24} color="#FFFFFF" />
              <Text style={styles.pointsEarnedText}>+{pointsEarned} emotions</Text>
            </View>

            <TouchableOpacity
              style={styles.homeButton}
              onPress={handleGoHome}
              activeOpacity={0.8}
            >
              <Text style={styles.homeButtonText}>Voltar para Home</Text>
              <FontAwesome5 name="arrow-right" size={16} color="#8B5CF6" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  }

  // Se a câmera estiver aberta, mostre a tela da câmera
  if (isCameraOpen) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing={cameraType}
          ref={cameraRef}
        >
          <View style={styles.cameraControls}>
            <TouchableOpacity
              style={styles.cameraButtonClose}
              onPress={() => setIsCameraOpen(false)}
            >
              <FontAwesome name="close" size={24} color="#FFF" />
            </TouchableOpacity>

            <View style={styles.cameraBottomBar}>
              <TouchableOpacity
                style={styles.captureButton}
                onPress={handleTakePicture}
              >
                <View style={styles.captureInner} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.flipButton}
                onPress={() =>
                  setCameraType((current) =>
                    current === "back" ? "front" : "back"
                  )
                }
              >
                <FontAwesome name="refresh" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#8B5CF6", "#F87171"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Check-in Diário</ThemedText>
        <View style={styles.headerRight} />
      </LinearGradient>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <LinearGradient
            colors={["#8B5CF6", "#F87171"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.progressFill, { width: `${(step / 3) * 100}%` }]}
          />
        </View>
        <ThemedText style={styles.progressText}>Etapa {step} de 3</ThemedText>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Step 1: Emoções */}
        {step === 1 && (
          <View style={styles.stepContainer}>
            <ThemedText style={styles.stepTitle}>
              Como você está se sentindo hoje?
            </ThemedText>
            <ThemedText style={styles.stepDescription}>
              Selecione a emoção que melhor representa seu estado atual
            </ThemedText>

            <View style={styles.emotionsContainer}>
              {emotions.map((emotion) => (
                <TouchableOpacity
                  key={emotion.type}
                  style={[
                    styles.emotionCard,
                    checkInData.emotion === emotion.type &&
                    styles.emotionCardSelected,
                  ]}
                  onPress={() => handleEmotionSelect(emotion.type)}
                  activeOpacity={0.7}
                >
                  <FontAwesome6
                    name={emotion.icon as any}
                    size={48}
                    color={emotion.color}
                  />
                  {checkInData.emotion === emotion.type && (
                    <View style={styles.selectedBadgeEmotion}>
                      <FontAwesome name="check" size={10} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 2: Imagens */}
        {step === 2 && (
          <View style={styles.stepContainer}>
            <ThemedText style={styles.stepTitle}>
              O que descreve melhor seu dia?
            </ThemedText>

            <View style={styles.imagesGrid}>
              {images.map((image) => {
                const isSelected = checkInData.selectedImages?.includes(
                  image.type
                );
                return (
                  <TouchableOpacity
                    key={image.type}
                    style={[
                      styles.imageCard,
                      isSelected && styles.imageCardSelected,
                    ]}
                    onPress={() => handleImageToggle(image.type)}
                    activeOpacity={0.7}
                  >
                    <Image
                      source={image.source}
                      style={styles.psyImage}
                      resizeMode="cover"
                    />
                    {isSelected && (
                      <View style={styles.selectedBadge}>
                        <FontAwesome name="check" size={12} color="#FFFFFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Step 3: Selfie */}
        {step === 3 && (
          <View style={styles.stepContainer}>
            <ThemedText style={styles.stepTitle}>Tire uma selfie!</ThemedText>
            <ThemedText style={styles.stepDescription}>
              Registre este momento especial
            </ThemedText>

            <View style={styles.selfieContainer}>
              {!checkInData.selfie ? (
                <TouchableOpacity
                  style={styles.selfieButton}
                  onPress={handleStartCamera}
                  activeOpacity={0.8}
                >
                  <FontAwesome name="camera" size={60} color="#8B5CF6" />
                  <ThemedText style={styles.selfieButtonText}>
                    Tirar Selfie
                  </ThemedText>
                </TouchableOpacity>
              ) : (
                <View style={styles.selfiePreview}>
                  <Image
                    source={{ uri: checkInData.selfie }}
                    style={styles.selfieImagePreview}
                  />
                  <View style={styles.selfieSuccessBadge}>
                    <FontAwesome name="check-circle" size={24} color="#10B981" />
                    <ThemedText style={styles.selfieSuccessText}>
                      Selfie capturada!
                    </ThemedText>
                  </View>

                  <TouchableOpacity onPress={handleRetake}>
                    <ThemedText style={styles.retakeText}>
                      Tirar novamente
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, loading && styles.nextButtonDisabled]}
          onPress={handleNext}
          activeOpacity={0.8}
          disabled={loading}
        >
          <LinearGradient
            colors={
              loading ? ["#ccc", "#ccc"] : ["#8B5CF6", "#F87171"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.nextButtonGradient}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <ThemedText style={styles.nextButtonText}>
                  {step === 3 ? "Finalizar Check-in" : "Próxima Etapa"}
                </ThemedText>
                <FontAwesome5 name="arrow-right" size={16} color="#FFFFFF" />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
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
    paddingTop: 60,
    paddingBottom: 20,
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
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#666666",
    textAlign: "center",
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 8,
    textAlign: "center",
  },
  stepDescription: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    marginBottom: 32,
  },
  emotionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  emotionCard: {
    width: "30%",
    height: 100,
    aspectRatio: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    position: "relative",
  },
  emotionCardSelected: {
    borderColor: "#8B5CF6",
    backgroundColor: "#F5F3FF",
  },
  emotionIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  emotionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  selectedBadgeEmotion: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
  },
  imagesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  imageCard: {
    width: "47%",
    aspectRatio: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    position: "relative",
  },
  imageCardSelected: {
    borderColor: "#8B5CF6",
    borderWidth: 3,
  },
  psyImage: {
    width: "100%",
    height: "100%",
  },
  imageLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666666",
    marginTop: 12,
  },
  imageLabelSelected: {
    color: "#8B5CF6",
  },
  selfieContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  selfieButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#FFFFFF",
    borderWidth: 3,
    borderColor: "#8B5CF6",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  selfieButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8B5CF6",
  },
  selfiePreview: {
    alignItems: "center",
    gap: 16,
  },
  selfieImagePreview: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: "#8B5CF6",
  },
  selfieSuccessBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selfieSuccessText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#10B981",
  },
  retakeText: {
    fontSize: 14,
    color: "#8B5CF6",
    textDecorationLine: "underline",
  },
  footer: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  nextButton: {
    borderRadius: 12,
    marginBottom: 20,
    overflow: "hidden",
  },
  nextButtonDisabled: {
    opacity: 0.7,
  },
  nextButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  successContainer: {
    flex: 1,
  },
  successGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  successContent: {
    alignItems: "center",
    maxWidth: 400,
  },
  successIconContainer: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  successSubtitle: {
    fontSize: 20,
    color: "#FFFFFF",
    marginBottom: 24,
    textAlign: "center",
    opacity: 0.9,
  },
  successMessage: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
    opacity: 0.9,
  },
  pointsEarnedContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 50,
    marginBottom: 40,
    gap: 12,
  },
  pointsEarnedText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  homeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 50,
    gap: 12,
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8B5CF6",
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 20,
  },
  cameraButtonClose: {
    alignSelf: 'flex-end',
    padding: 10,
    marginTop: 40,
  },
  cameraBottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  flipButton: {
    padding: 10,
  }
});
