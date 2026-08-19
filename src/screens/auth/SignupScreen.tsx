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
import { SignupFormData,signupSchema } from "../../utils";
import { authService } from "../../services";
import { useAuthStore } from "../../store";
import { Button,Input,ErrorMessage } from "../../components/common";

type Props = NativeStackScreenProps<AuthStackParamList, "Signup">;

export default function SignupScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setAuthResponse } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      setLoading(true);
      setError("");
      const response = await authService.signup(data);
      await setAuthResponse(response);
      // navigate to verify email
      navigation.navigate("VerifyEmail", {
        user_id: response.user_id,
        email: data.email,
      });
    } catch (err: any) {
      setError(err.message ?? "Signup failed. Please try again.");
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
            <TouchableOpacity
              className="mb-6 w-10 h-10 items-center justify-center rounded-full bg-background-surface"
              onPress={() => navigation.goBack()}
            >
              <Text className="text-text-primary text-lg">←</Text>
            </TouchableOpacity>
            <Text className="text-text-primary text-3xl font-medium mb-2">
              Create account
            </Text>
            <Text className="text-text-secondary text-base">
              Join your family on Family App
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
                  placeholder="At least 8 characters"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  error={errors.password?.message}
                />
              )}
            />
          </View>

          {/* terms */}
          <Text className="text-text-muted text-xs mb-6 leading-5">
            By creating an account you agree to our{" "}
            <Text className="text-primary">Terms of Service</Text> and{" "}
            <Text className="text-primary">Privacy Policy</Text>.
          </Text>

          {/* signup button */}
          <Button
            title="Create account"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
          />

          {/* login link */}
          <View className="flex-row items-center justify-center mt-8">
            <Text className="text-text-secondary text-sm">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text className="text-primary text-sm font-medium">Sign in</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}