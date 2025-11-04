import { Redirect } from "expo-router";

export default function Index() {
  // Aqui você verificaria se o usuário está autenticado
  // const { isAuthenticated, isLoading } = useAuth();

  const isAuthenticated = true; // Substitua pela sua lógica de auth

  // if (isLoading) {
  //   return <LoadingScreen />;
  // }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
