import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { OnboardingStackParamList } from "@/navigation/types";
import { familyService } from "../../services";
import { authService } from "../../services";
import { useAuthStore } from "../../store";
import { useFamilyStore } from "../../store";
import { FamilyWithMember } from "../../types";
import { Button,LoadingSpinner, EmptyState,Badge } from "../../components/common";
import { colors } from "../../constants";

type Props = NativeStackScreenProps<OnboardingStackParamList, "FamilySelector">;

export default function FamilySelectorScreen({ navigation }: Props) {
  const [families, setFamilies] = useState<FamilyWithMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selecting, setSelecting] = useState<string | null>(null);
  const { logout } = useAuthStore();
  const { setCurrentFamily, setFamilies: storeFamilies } = useFamilyStore();

  const fetchFamilies = async () => {
    try {
      const res = await familyService.listFamilies();
      setFamilies(res.families);
      storeFamilies(res.families);
    } catch (err) {
      setFamilies([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFamilies();
  }, []);

  const onSelectFamily = async (family: FamilyWithMember) => {
    try {
      setSelecting(family.family_id);
      const res = await authService.selectFamily(family.family_id);
      await setCurrentFamily({
        ...family,
        member_id: res.member_id ?? family.member_id,
        is_admin: res.is_admin ?? family.is_admin,
        member_type: res.member_type ?? family.member_type,
      });
    } catch (err) {
      setSelecting(null);
    }
  };

  if (loading) return <LoadingSpinner fullScreen message="Loading families..." />;

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchFamilies();
            }}
            tintColor={colors.primary.DEFAULT}
          />
        }
      >
        <View className="px-6 pt-16 pb-8">

          {/* header */}
          <View className="mb-8">
            <Text className="text-text-primary text-3xl font-medium mb-2">
              Your families
            </Text>
            <Text className="text-text-secondary text-base">
              Select a family to continue
            </Text>
          </View>

          {/* families list */}
          {families.length === 0 ? (
            <EmptyState
              title="No families yet"
              message="Create a new family or join one using an invite link"
            />
          ) : (
            <View className="gap-3 mb-6">
              {families.map((family) => (
                <TouchableOpacity
                  key={family.family_id}
                  onPress={() => onSelectFamily(family)}
                  disabled={selecting === family.family_id}
                  className="bg-background-card border border-border rounded-2xl p-4 flex-row items-center gap-4"
                >
                  {/* family avatar */}
                  <View className="w-12 h-12 rounded-xl bg-primary items-center justify-center">
                    <Text className="text-white text-lg font-medium">
                      {family.family_name[0]}
                    </Text>
                  </View>

                  {/* family info */}
                  <View className="flex-1">
                    <Text className="text-text-primary text-base font-medium mb-1">
                      {family.family_name}
                    </Text>
                    <View className="flex-row items-center gap-2">
                      <Badge
                        variant={
                          family.is_admin
                            ? "admin"
                            : family.member_type === "adult"
                            ? "adult"
                            : "child"
                        }
                      />
                    </View>
                  </View>

                  {/* arrow */}
                  {selecting === family.family_id ? (
                    <Text className="text-text-muted text-sm">Loading...</Text>
                  ) : (
                    <Text className="text-text-muted text-lg">→</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* actions */}
          <View className="gap-3 mt-4">
            <Button
              title="Create a new family"
              onPress={() => navigation.navigate("CreateFamily")}
            />
            <Button
              title="Join with invite link"
              onPress={() => navigation.navigate("JoinFamily", {})}
              variant="outline"
            />
          </View>

          {/* logout */}
          <TouchableOpacity
            className="mt-8 items-center"
            onPress={logout}
          >
            <Text className="text-text-muted text-sm">Sign out</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
}