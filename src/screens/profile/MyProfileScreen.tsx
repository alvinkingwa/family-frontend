import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useAuthStore } from "@/store/auth.store";
import { useFamilyStore } from "@/store/family.store";
import { Avatar, Badge, Card } from "@/components/common";
import { formatDate } from "@/utils/date";

export default function MyProfileScreen() {
  const { profile, logout } = useAuthStore();
  const { currentFamily, isAdmin } = useFamilyStore();

  const roleVariant = isAdmin
    ? "admin"
    : currentFamily?.member_type === "adult"
    ? "adult"
    : "child";

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {/* header */}
        <View className="bg-primary px-6 pt-14 pb-8 items-center">
          <Avatar
            firstName={profile?.first_name}
            lastName={profile?.last_name}
            photoUrl={profile?.photo_url}
            isAdmin={isAdmin}
            size="xl"
          />
          <Text className="text-white text-xl font-medium mt-4">
            {profile?.first_name} {profile?.last_name}
          </Text>
          {profile?.middle_name && (
            <Text className="text-primary-lighter text-sm mt-0.5">
              {profile.middle_name}
            </Text>
          )}
          <View className="mt-3">
            <Badge variant={roleVariant} />
          </View>
        </View>

        <View className="px-6 pt-6 pb-8 gap-4">

          {/* personal info */}
          <Card>
            <Text className="text-text-primary text-sm font-medium mb-4">
              Personal information
            </Text>
            <View className="gap-3">
              <InfoRow label="Date of birth" value={
                profile?.date_of_birth
                  ? formatDate(profile.date_of_birth)
                  : "—"
              } />
              <InfoRow label="Gender" value={profile?.gender ?? "—"} />
              <InfoRow label="Phone" value={profile?.phone ?? "—"} />
              <InfoRow label="City" value={profile?.city ?? "—"} />
              <InfoRow label="Nationality" value={profile?.nationality ?? "—"} />
              <InfoRow label="Occupation" value={profile?.occupation ?? "—"} />
            </View>
          </Card>

          {/* bio */}
          {profile?.bio && (
            <Card>
              <Text className="text-text-primary text-sm font-medium mb-2">
                Bio
              </Text>
              <Text className="text-text-secondary text-sm leading-5">
                {profile.bio}
              </Text>
            </Card>
          )}

          {/* family info */}
          <Card>
            <Text className="text-text-primary text-sm font-medium mb-4">
              Family
            </Text>
            <View className="gap-3">
              <InfoRow
                label="Family"
                value={currentFamily?.family_name ?? "—"}
              />
              <InfoRow
                label="Role"
                value={
                  isAdmin
                    ? "Admin"
                    : currentFamily?.member_type === "adult"
                    ? "Adult member"
                    : "Child member"
                }
              />
            </View>
          </Card>

          {/* edit profile */}
          <TouchableOpacity
            className="bg-background-card border border-border rounded-xl p-4 flex-row items-center justify-between"
            onPress={() => {}}
          >
            <Text className="text-text-primary text-sm font-medium">
              Edit profile
            </Text>
            <Text className="text-text-muted">→</Text>
          </TouchableOpacity>

          {/* sign out */}
          <TouchableOpacity
            className="bg-red-50 border border-red-100 rounded-xl p-4 items-center mt-2"
            onPress={logout}
          >
            <Text className="text-error text-sm font-medium">Sign out</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-text-muted text-sm">{label}</Text>
      <Text className="text-text-primary text-sm font-medium capitalize">
        {value}
      </Text>
    </View>
  );
}