import { NavigationContainer } from "@react-navigation/native";
import { View, ActivityIndicator } from "react-native";
import { useAuthStore, useFamilyStore } from "../store";
import AuthNavigator from "./AuthNavigator";
import OnboardingNavigator from "./OnboardingNavigator";
import AppNavigator from "./AppNavigator";
import { colors } from "../constants";

export default function Navigation() {
  const { isLoggedIn, isLoading, hasProfile, emailVerified } = useAuthStore();
  const { currentFamily } = useFamilyStore();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color={colors.primary.DEFAULT} size="large" />
      </View>
    );
  }

  // not logged in, email not verified, or no profile yet → stay in auth screens
  const showAuth = !isLoggedIn || !emailVerified || !hasProfile;

  return (
    <NavigationContainer>
      {showAuth ? (
        <AuthNavigator />
      ) : !currentFamily ? (
        <OnboardingNavigator />
      ) : (
        <AppNavigator />
      )}
    </NavigationContainer>
  );
}