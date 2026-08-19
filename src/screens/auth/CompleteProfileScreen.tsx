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
import { CompleteProfileFormData,completeProfileSchema } from "../../utils";
import { authService } from "../../services";
import { useAuthStore } from "../../store";
import { Button,Input,ErrorMessage } from "../../components/common";

type Props = NativeStackScreenProps<AuthStackParamList, "CompleteProfile">;

const GENDERS = ["male", "female", "other"];

export default function CompleteProfileScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setProfile } = useAuthStore();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CompleteProfileFormData>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      first_name: "",
      middle_name: "",
      last_name: "",
      date_of_birth: "",
      gender: undefined,
    },
  });

  const selectedGender = watch("gender");

  const onSubmit = async (data: CompleteProfileFormData) => {
    try {
      setLoading(true);
      setError("");
      await authService.completeProfile(data);
      // profile complete — navigation will redirect to onboarding
    } catch (err: any) {
      setError(err.message ?? "Failed to save profile. Please try again.");
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
          <View className="mb-8">
            <Text className="text-text-primary text-3xl font-medium mb-2">
              Complete your profile
            </Text>
            <Text className="text-text-secondary text-base">
              This helps your family identify you in the tree
            </Text>
          </View>

          {/* error */}
          <ErrorMessage message={error} />

          {/* form */}
          <Controller
            control={control}
            name="first_name"
            render={({ field: { onChange, value } }) => (
              <Input
                label="First name"
                placeholder="Enter your first name"
                value={value}
                onChangeText={onChange}
                error={errors.first_name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="middle_name"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Middle name (optional)"
                placeholder="Enter your middle name"
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="last_name"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Last name"
                placeholder="Enter your last name"
                value={value}
                onChangeText={onChange}
                error={errors.last_name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="date_of_birth"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Date of birth"
                placeholder="YYYY-MM-DD"
                value={value}
                onChangeText={onChange}
                error={errors.date_of_birth?.message}
                hint="Format: 1995-06-15"
              />
            )}
          />

          {/* gender selector */}
          <View className="mb-4">
            <Text className="text-text-primary text-sm font-medium mb-2">
              Gender
            </Text>
            <View className="flex-row gap-3">
              {GENDERS.map((g) => (
                <TouchableOpacity
                  key={g}
                  onPress={() => setValue("gender", g as any)}
                  className={`flex-1 py-3 rounded-xl border items-center ${
                    selectedGender === g
                      ? "bg-primary border-primary"
                      : "bg-background-card border-border"
                  }`}
                >
                  <Text
                    className={`text-sm font-medium capitalize ${
                      selectedGender === g ? "text-white" : "text-text-secondary"
                    }`}
                  >
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.gender ? (
              <Text className="text-error text-xs mt-1">
                {errors.gender.message}
              </Text>
            ) : null}
          </View>

          {/* submit */}
          <View className="mt-4">
            <Button
              title="Save profile"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
            />
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}