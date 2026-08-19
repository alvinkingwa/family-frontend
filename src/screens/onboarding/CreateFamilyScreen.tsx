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

import { OnboardingStackParamList } from "@/navigation/types";
import { CreateFamilyFormData,createFamilySchema } from "../../utils";
import { familyService } from "../../services";
import { authService } from "../../services";
import { useFamilyStore } from "../../store";
import { Button,Input,ErrorMessage } from "../../components/common";

type Props = NativeStackScreenProps<OnboardingStackParamList, "CreateFamily">;

export default function CreateFamilyScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setCurrentFamily } = useFamilyStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateFamilyFormData>({
    resolver: zodResolver(createFamilySchema),
    defaultValues: { name: "" },
  });

  const onSubmit = async (data: CreateFamilyFormData) => {
    try {
      setLoading(true);
      setError("");

      // create the family
      const res = await familyService.createFamily(data);
      const familyId = res.family.id;

      // select the family to get full JWT
      const selectRes = await authService.selectFamily(familyId);

      // update store
      await setCurrentFamily({
        family_id: familyId,
        family_name: data.name,
        member_id: selectRes.member_id,
        member_type: "adult",
        is_admin: true,
        household_id: res.household?.id,
      });
    } catch (err: any) {
      setError(err.message ?? "Failed to create family. Please try again.");
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
            <View className="w-14 h-14 rounded-2xl bg-primary items-center justify-center mb-6">
              <Text className="text-3xl">🌳</Text>
            </View>
            <Text className="text-text-primary text-3xl font-medium mb-2">
              Create a family
            </Text>
            <Text className="text-text-secondary text-base leading-6">
              You'll be the admin and can invite family members
            </Text>
          </View>

          <ErrorMessage message={error} />

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Family name"
                placeholder="e.g. The Kigwa Family"
                value={value}
                onChangeText={onChange}
                error={errors.name?.message}
                hint="This is how your family will appear in the app"
              />
            )}
          />

          {/* what happens next */}
          <View className="bg-background-surface rounded-2xl p-4 mb-8 gap-3">
            <Text className="text-text-primary text-sm font-medium">
              What happens next
            </Text>
            {[
              "A root household is created automatically",
              "You become the family admin",
              "You can invite family members via email",
              "Members can browse and join households",
            ].map((item, i) => (
              <View key={i} className="flex-row items-start gap-2">
                <Text className="text-primary text-sm mt-0.5">✓</Text>
                <Text className="text-text-secondary text-sm flex-1 leading-5">
                  {item}
                </Text>
              </View>
            ))}
          </View>

          <Button
            title="Create family"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
          />

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}