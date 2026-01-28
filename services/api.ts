import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

const api = axios.create({
  baseURL: "http://65.108.151.196:8000",
  timeout: 10000,
});

api.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    const token = await SecureStore.getItemAsync("user_token");

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await SecureStore.getItemAsync("refresh_token");
        if (!refreshToken) {
          throw new Error("Sem refresh token salvo");
        }

        const refreshResponse = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          { refresh_token: refreshToken }
        );

        const { access_token, refresh_token } = refreshResponse.data;

        await SecureStore.setItemAsync("user_token", access_token);
        if (refresh_token) {
          await SecureStore.setItemAsync("refresh_token", refresh_token);
        }

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        return api(originalRequest);
      } catch (refreshError) {
        await SecureStore.deleteItemAsync("user_token");
        await SecureStore.deleteItemAsync("refresh_token");
        await SecureStore.deleteItemAsync("user_profile");

        router.replace("/(auth)/login");
        return Promise.reject(refreshError);
      }
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

export type MeTransaction = {
  id: string;
  type: "earn" | "redeem";
  amount: number;
  description: string;
  created_at: string;
};

export type MeResponse = {
  user: {
    id: number;
    uuid: string;
    email: string;
    role: {
      id: number;
      name: string;
      description: string;
      is_active: boolean;
    };
    company_id: number;
    is_active: boolean;
    created_at: string;
  };
  employee: {
    id: number;
    uuid: string;
    company_id: number;
    user_id: number;
    name: string;
    registration: string;
    department: string;
    phone: string;
    is_active: boolean;
    termination_date: string | null;
    created_at: string;
    updated_at: string;
  };
  manager: {
    id: number;
    uuid: string;
    name: string;
    email: string;
  } | null;
  transactions: MeTransaction[];
  balance: number;
};

export const getMe = async (): Promise<MeResponse> => {
  const response = await api.get("/me");
  return response.data;
};

export default api;