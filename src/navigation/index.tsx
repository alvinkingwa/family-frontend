import { NavigationContainer } from "@react-navigation/native";
import { useAuthStore, useFamilyStore } from "../store";
import AuthNavigator from "./AuthNavigator";
import OnboardingNavigator from "./OnboardingNavigator";
import AppNavigator from "./AppNavigator";
import { View, ActivityIndicator } from "react-native";
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

  return (
    <NavigationContainer>
      {/* not logged in → auth screens */}
      {!isLoggedIn && <AuthNavigator />}

      {/* logged in but no family selected → onboarding */}
      {isLoggedIn && !currentFamily && <OnboardingNavigator />}

      {/* logged in + family selected → main app */}
      {isLoggedIn && currentFamily && <AppNavigator />}
    </NavigationContainer>
  );
}