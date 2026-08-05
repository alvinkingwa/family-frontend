import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

// auth stack screens
export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  VerifyEmail: { user_id: string; email: string };
  CompleteProfile: undefined;
  ForgotPassword: undefined;
  ResetPassword: { email: string };
};

// onboarding stack screens
export type OnboardingStackParamList = {
  FamilySelector: undefined;
  CreateFamily: undefined;
  JoinFamily: { invite_token?: string };
};

// main app bottom tabs
export type AppTabParamList = {
  Home: undefined;
  Tree: undefined;
  Members: undefined;
  Profile: undefined;
};

// nested screens inside tabs
export type AppStackParamList = {
  AppTabs: undefined;
  MemberProfile: { user_id: string };
  HouseholdDetail: { household_id: string };
  InviteMember: undefined;
  ManageMembers: undefined;
  GhostMembers: undefined;
  JoinRequests: undefined;
  TransferAdmin: undefined;
  FamilySettings: undefined;
  EditProfile: undefined;
};

export type AuthScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type OnboardingScreenProps<T extends keyof OnboardingStackParamList> =
  NativeStackScreenProps<OnboardingStackParamList, T>;

export type AppTabScreenProps<T extends keyof AppTabParamList> =
  BottomTabScreenProps<AppTabParamList, T>;