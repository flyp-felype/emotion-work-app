import axios from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

const api = axios.create({
  baseURL: "https://emotion-api-production-40d4.up.railway.app",
  timeout: 10000,
});

api.interceptors.request.use(
  async (config: { headers: { Authorization: string } }) => {
    try {
      const token = await SecureStore.getItemAsync("user_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Erro ao fazer requisição:", error);
      router.push("/(auth)/login");
    }

    return config;
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync("user_token");
      await SecureStore.deleteItemAsync("user_profile");

      router.replace("/(auth)/login");
    }
    return Promise.reject(error);
  }
);

export const onboardingService = {
  checkUser: async (data: {
    document: string;
    name: string;
    birth_date: string;
    registration: string;
  }) => {
    const response = await api.post("/onboarding/check", data);
    return response.data;
  },

  completeRegistration: async (data: {
    user_uuid: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => {
    const response = await api.post("/onboarding/complete", data);
    return response.data;
  },
};

export default api;
