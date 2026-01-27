import { useRootNavigationState, useRouter, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

type UserProfile = {
  employee_id: string;
  name: string;
  registration: string;
  department: string;
};

interface AuthContextType {
  signIn: (matricula: string, senha: string) => Promise<void>;
  signOut: () => Promise<void>;
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  completeOnboardingSession: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Correção 1: Iniciar como true
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const segments = useSegments();
  const rootNavigationState = useRootNavigationState(); // Correção 2: Hook para verificar estado da navegação

  // Verificar se existe usuário logado ao iniciar o app
  useEffect(() => {
    async function loadStorageData() {
      try {
        const storedUser = await SecureStore.getItemAsync("user_profile");
        const token = await SecureStore.getItemAsync("user_token");

        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error("Falha ao carregar sessão", e);
      } finally {
        setIsLoading(false);
      }
    }

    loadStorageData();
  }, []);

  // Proteção de rotas: redirecionar se não estiver autenticado
  useEffect(() => {
    if (isLoading) return;

    // Correção 2: Só navega se o sistema de navegação estiver pronto
    if (!rootNavigationState?.key) return;

    const inAuthGroup = segments[0] === "(auth)";
    if (!user && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      console.log("Entrou no else if");
      router.replace("/(tabs)");
    }
  }, [user, isLoading, segments, rootNavigationState]);

  const signIn = async (matricula: string, senha: string) => {
    try {
      setIsLoading(true);
  
      const response = await api.post("/auth/employee/login", {
        registration: matricula,
        password: senha,
      });
  
      // backend deve retornar também 'refresh_token'
      const { access_token, refresh_token, profile } = response.data;
  
      await SecureStore.setItemAsync("user_token", access_token);
      await SecureStore.setItemAsync("refresh_token", refresh_token);
      await SecureStore.setItemAsync("user_profile", JSON.stringify(profile));
  
      setUser(profile);
    } catch (error) {
      console.error("Erro ao fazer login", error);
      throw error;
    } finally {
      setUser(null)
      setIsLoading(false);
    }
  };

  const completeOnboardingSession = async (token: string) => {
    try {
      await SecureStore.setItemAsync("user_token", token);

      setUser({
        employee_id: "",
        name: "Usuário",
        registration: "",
        department: "",
      });

      // O useEffect de proteção fará o redirecionamento automaticamente
      // mas podemos forçar aqui se necessário
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Erro ao salvar sessão de onboarding", error);
    }
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync("user_token");
    await SecureStore.deleteItemAsync("refresh_token"); // novo
    await SecureStore.deleteItemAsync("user_profile");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        user,
        isLoading,
        completeOnboardingSession,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
