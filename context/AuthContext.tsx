import { useRouter, useSegments } from "expo-router";
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const segments = useSegments();

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

    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [user, isLoading, segments]);

  const signIn = async (matricula: string, senha: string) => {
    try {
      const response = await api.post("/auth/employee/login", {
        registration: matricula,
        password: senha,
      });

      const { acces_token, profile } = response.data;

      await SecureStore.setItemAsync("user_token", acces_token);
      await SecureStore.setItemAsync("user_profile", JSON.stringify(profile));

      setUser(profile);
    } catch (error) {
      console.error("Erro ao fazer login", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboardingSession = async (token: string) => {
    try {
      await SecureStore.setItemAsync("user_token", token);
      // OBS: Como o endpoint 'complete' não retorna o perfil completo (nome, departamento, etc),
      // idealmente aqui deveríamos chamar um endpoint do tipo /auth/me para pegar os dados.
      // Por enquanto, vamos apenas salvar o token e deixar o usuário como logado.

      // Se tivermos um endpoint para buscar perfil:
      // const profile = await api.get('/auth/me');
      // setUser(profile.data);
      // await SecureStore.setItemAsync('user_profile', JSON.stringify(profile.data));

      // Solução temporária para permitir o login imediato:
      // Criamos um perfil "parcial" ou buscamos depois
      setUser({
        employee_id: "",
        name: "Usuário",
        registration: "",
        department: "",
      });

      router.replace("/(tabs)");
    } catch (error) {
      console.error("Erro ao salvar sessão de onboarding", error);
    }
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync("user_token");
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
