import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useState, useRef } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@/navigation/types";
import { authService } from "../../services";
import { useAuthStore } from "../../store";
import { Button,ErrorMessage,Input } from "../../components/common";

type Props = NativeStackScreenProps<AuthStackParamList, "VerifyEmail">;

export default function VerifyEmailScreen({ navigation, route }: Props) {
  const { user_id, email } = route.params;
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setEmailVerified } = useAuthStore();

  const onVerify = async () => {
    if (code.length !== 6) {
      setError("Please enter the 6-digit code");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await authService.verifyEmail({ user_id, code });
      setEmailVerified(true);
      navigation.navigate("CompleteProfile");
    } catch (err: any) {
      setError(err.message ?? "Invalid code. Please try again.");
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
            <View className="w-14 h-14 rounded-2xl bg-primary-lighter items-center justify-center mb-6">
              <Text className="text-3xl">📧</Text>
            </View>
            <Text className="text-text-primary text-3xl font-medium mb-2">
              Check your email
            </Text>
            <Text className="text-text-secondary text-base leading-6">
              We sent a 6-digit code to{" "}
              <Text className="text-text-primary font-medium">{email}</Text>
            </Text>
          </View>

          {/* error */}
          <ErrorMessage message={error} />

          {/* code input */}
          <Input
            label="Verification code"
            placeholder="Enter 6-digit code"
            keyboardType="number-pad"
            maxLength={6}
            value={code}
            onChangeText={setCode}
          />

          {/* verify button */}
          <Button
            title="Verify email"
            onPress={onVerify}
            loading={loading}
          />

          {/* resend */}
          <View className="flex-row items-center justify-center mt-6">
            <Text className="text-text-secondary text-sm">
              Didn't receive it?{" "}
            </Text>
            <TouchableOpacity onPress={() => {}}>
              <Text className="text-primary text-sm font-medium">
                Resend code
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}