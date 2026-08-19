import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { OnboardingStackParamList } from "@/navigation/types";
import { familyService } from "../../services";
import { authService } from "../../services";
import { useFamilyStore } from "../../store";
import { Button,Input,ErrorMessage } from "../../components/common";

type Props = NativeStackScreenProps<OnboardingStackParamList, "JoinFamily">;

export default function JoinFamilyScreen({ navigation, route }: Props) {
  // invite_token may come from deep link
  const [token, setToken] = useState(route.params?.invite_token ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setCurrentFamily } = useFamilyStore();

  const onJoin = async () => {
    if (!token.trim()) {
      setError("Please enter an invite token");
      return;
    }
    try {
      setLoading(true);
      setError("");

      // join the family
      const res = await familyService.joinFamily({ invite_token: token.trim() });

      // select the family to get full JWT
      const selectRes = await authService.selectFamily(res.family_id);

      await setCurrentFamily({
        family_id: res.family_id,
        family_name: selectRes.family_name ?? "Family",
        member_id: res.member_id,
        member_type: res.member_type,
        is_admin: false,
        household_id: res.household_id,
      });
    } catch (err: any) {
      setError(err.message ?? "Invalid invite token. Please check and try again.");
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
              <Text className="text-3xl">🔗</Text>
            </View>
            <Text className="text-text-primary text-3xl font-medium mb-2">
              Join a family
            </Text>
            <Text className="text-text-secondary text-base leading-6">
              Paste the invite token from the email you received
            </Text>
          </View>

          <ErrorMessage message={error} />

          <Input
            label="Invite token"
            placeholder="Paste your invite token here"
            value={token}
            onChangeText={setToken}
            autoCapitalize="none"
            autoCorrect={false}
            hint="The token is the UUID at the end of the invite link"
          />

          {/* example */}
          <View className="bg-background-surface rounded-xl p-3 mb-8">
            <Text className="text-text-muted text-xs font-medium mb-1">
              Example invite link
            </Text>
            <Text className="text-text-secondary text-xs leading-5">
              http://localhost:3000/invite/
              <Text className="text-primary font-medium">
                bc1af134-52b7-4aa4-88c1-5126693fa52c
              </Text>
            </Text>
            <Text className="text-text-muted text-xs mt-2">
              Copy the UUID part and paste it above
            </Text>
          </View>

          <Button
            title="Join family"
            onPress={onJoin}
            loading={loading}
          />

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}