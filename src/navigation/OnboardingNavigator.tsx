import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { OnboardingStackParamList } from "./types";
import FamilySelectorScreen from "../screens/onboarding/FamilySelectorScreen";
import CreateFamilyScreen from "../screens/onboarding/CreateFamilyScreen";
import JoinFamilyScreen from "../screens/onboarding/JoinFamilyScreen";

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FamilySelector" component={FamilySelectorScreen} />
      <Stack.Screen name="CreateFamily" component={CreateFamilyScreen} />
      <Stack.Screen name="JoinFamily" component={JoinFamilyScreen} />
    </Stack.Navigator>
  );
}