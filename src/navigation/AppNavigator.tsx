import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { AppTabParamList } from "./types";
import { colors } from "../constants";
import HomeScreen from "../screens/home/HomeScreen";
import FamilyTreeScreen from "../screens/tree/FamilyTreeScreen";
import MembersListScreen from "../screens/members/MembersListScreen";
import MyProfileScreen from "../screens/profile/MyProfileScreen";
import { Ionicons } from "expo/vector-icons";


const Tab = createBottomTabNavigator<AppTabParamList>();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary.DEFAULT,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: {
          backgroundColor: colors.background.card,
          borderTopColor: colors.border.DEFAULT,
          borderTopWidth: 0.5,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const icons: Record<string, string> = {
            Home: focused ? "home" : "home-outline",
            Tree: focused ? "git-network" : "git-network-outline",
            Members: focused ? "people" : "people-outline",
            Profile: focused ? "person" : "person-outline",
          };
          return (
            <Ionicons
              name={icons[route.name] as any}
              size={22}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Tree" component={FamilyTreeScreen} />
      <Tab.Screen name="Members" component={MembersListScreen} />
      <Tab.Screen name="Profile" component={MyProfileScreen} />
    </Tab.Navigator>
  );
}