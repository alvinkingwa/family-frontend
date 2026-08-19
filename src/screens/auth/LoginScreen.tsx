import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { AuthStackParamList } from "@/navigation/types";
import { loginSchema,LoginFormData } from "../../utils";
import { authService } from "../../services";
import { useAuthStore } from "../../store";
import { Button,Input,ErrorMessage } from "../../components/common";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setAuthResponse } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      setError("");
      const response = await authService.login(data);
      await setAuthResponse(response);
    } catch (err: any) {
      setError(err.message ?? "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6 pt-16 pb-8">

          {/* header */}
          <View className="mb-10">
            <View className="w-14 h-14 rounded-2xl bg-primary items-center justify-center mb-6">
              <Text className="text-white text-2xl">🌳</Text>
            </View>
            <Text className="text-text-primary text-3xl font-medium mb-2">
              Welcome back
            </Text>
            <Text className="text-text-secondary text-base">
              Sign in to your family account
            </Text>
          </View>

          {/* error */}
          <ErrorMessage message={error} />

          {/* form */}
          <View className="gap-1">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Email"
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  value={value}
                  onChangeText={onChange}
                  error={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Password"
                  placeholder="Enter your password"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  error={errors.password?.message}
                />
              )}
            />
          </View>

          {/* forgot password */}
          <TouchableOpacity
            className="mb-6"
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text className="text-primary text-sm font-medium">
              Forgot password?
            </Text>
          </TouchableOpacity>

          {/* login button */}
          <Button
            title="Sign in"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
          />

          {/* divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-border" />
            <Text className="text-text-muted text-sm mx-4">or</Text>
            <View className="flex-1 h-px bg-border" />
          </View>

          {/* google sign in */}
          <Button
            title="Continue with Google"
            onPress={() => {}}
            variant="outline"
          />

          {/* signup link */}
          <View className="flex-row items-center justify-center mt-8">
            <Text className="text-text-secondary text-sm">
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text className="text-primary text-sm font-medium">
                Sign up
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}