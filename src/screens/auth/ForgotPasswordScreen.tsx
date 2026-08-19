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
import { ForgotPasswordFormData,forgotPasswordSchema } from "../../utils";

import { authService } from "../../services";
import { Button,Input,ErrorMessage } from "../../components/common";

type Props = NativeStackScreenProps<AuthStackParamList, "ForgotPassword">;

export default function ForgotPasswordScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [email, setEmailValue] = useState("");

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setLoading(true);
      setError("");
      await authService.forgotPassword(data);
      setEmailValue(data.email);
      setSent(true);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <View className="flex-1 bg-background px-6 pt-16 pb-8">
        <View className="w-14 h-14 rounded-2xl bg-primary-lighter items-center justify-center mb-6">
          <Text className="text-3xl">✉️</Text>
        </View>
        <Text className="text-text-primary text-3xl font-medium mb-2">
          Check your email
        </Text>
        <Text className="text-text-secondary text-base leading-6 mb-8">
          We sent a reset code to{" "}
          <Text className="text-text-primary font-medium">{email}</Text>.
          Enter it below to reset your password.
        </Text>
        <Button
          title="Enter reset code"
          onPress={() => navigation.navigate("ResetPassword", { email })}
        />
        <TouchableOpacity
          className="mt-4 items-center"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-text-secondary text-sm">Back to login</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
              Forgot password?
            </Text>
            <Text className="text-text-secondary text-base">
              Enter your email and we'll send you a reset code
            </Text>
          </View>

          <ErrorMessage message={error} />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Email"
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
                error={errors.email?.message}
              />
            )}
          />

          <Button
            title="Send reset code"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
          />

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}