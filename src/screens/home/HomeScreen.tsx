import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "@/store/auth.store";
import { useFamilyStore } from "@/store/family.store";
import { useTreeStore } from "@/store/tree.store";
import { treeService } from "@/services/tree.service";
import { Avatar, Badge, Card, LoadingSpinner } from "@/components/common";
import { TreeMember, GhostMember } from "@/types";
import { colors } from "@/constants";

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const { profile } = useAuthStore();
  const { currentFamily, isAdmin } = useFamilyStore();
  const { tree, setTree, isLoading, setLoading } = useTreeStore();

  const fetchTree = async () => {
    try {
      setLoading(true);
      const res = await treeService.getFamilyTree();
      setTree(res.tree);
    } catch (err) {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTree();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTree();
  };

  const totalMembers = (tree?.members.length ?? 0) + (tree?.ghosts.length ?? 0);
  const totalHouseholds = tree?.households.length ?? 0;
  const generations = tree?.households.length
    ? Math.max(...tree.households.map((h) => h.generation))
    : 0;

  const recentMembers = tree?.members.slice(0, 5) ?? [];

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary.DEFAULT}
          />
        }
      >
        {/* header */}
        <View className="bg-primary px-6 pt-14 pb-8">
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-1">
              <Text className="text-primary-lighter text-sm mb-1">
                Welcome back
              </Text>
              <Text className="text-white text-xl font-medium">
                {profile?.first_name
                  ? `${profile.first_name} ${profile.last_name}`
                  : "Family Member"}
              </Text>
            </View>
            <View className="w-11 h-11 rounded-full bg-primary-light items-center justify-center">
              <Text className="text-white font-medium">
                {profile?.first_name?.[0] ?? "?"}
                {profile?.last_name?.[0] ?? ""}
              </Text>
            </View>
          </View>

          {/* family name */}
          <View className="flex-row items-center gap-2 mb-6">
            <Text className="text-white text-2xl font-medium">
              {currentFamily?.family_name}
            </Text>
            {isAdmin && (
              <View className="bg-amber px-2 py-0.5 rounded-full">
                <Text className="text-xs font-medium text-amber-900">
                  Admin
                </Text>
              </View>
            )}
          </View>

          {/* stats */}
          <View className="flex-row gap-3">
            <StatCard label="Members" value={totalMembers} />
            <StatCard label="Households" value={totalHouseholds} />
            <StatCard label="Generations" value={generations} />
          </View>
        </View>

        <View className="px-6 pt-6 pb-8 gap-6">

          {/* quick actions */}
          <View>
            <Text className="text-text-primary text-base font-medium mb-3">
              Quick actions
            </Text>
            <View className="flex-row gap-3">
              {isAdmin && (
                <QuickAction
                  label="Invite member"
                  emoji="✉️"
                  onPress={() => {}}
                  primary
                />
              )}
              <QuickAction
                label="View tree"
                emoji="🌳"
                onPress={() => {}}
              />
              {!isAdmin && (
                <QuickAction
                  label="Join household"
                  emoji="🏠"
                  onPress={() => {}}
                />
              )}
            </View>
          </View>

          {/* recent members */}
          <View>
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-text-primary text-base font-medium">
                Members
              </Text>
              <TouchableOpacity>
                <Text className="text-primary text-sm">See all</Text>
              </TouchableOpacity>
            </View>

            {isLoading ? (
              <LoadingSpinner message="Loading members..." />
            ) : recentMembers.length === 0 ? (
              <Card>
                <Text className="text-text-secondary text-sm text-center py-4">
                  No members yet
                </Text>
              </Card>
            ) : (
              <Card padding="sm">
                {recentMembers.map((member, index) => (
                  <View key={member.id}>
                    <MemberRow member={member} />
                    {index < recentMembers.length - 1 && (
                      <View className="h-px bg-border mx-2" />
                    )}
                  </View>
                ))}
              </Card>
            )}
          </View>

          {/* admin panel */}
          {isAdmin && (
            <View>
              <Text className="text-text-primary text-base font-medium mb-3">
                Admin
              </Text>
              <View className="gap-2">
                <AdminAction
                  label="Manage join requests"
                  description="Review household join requests"
                  emoji="📋"
                  onPress={() => {}}
                />
                <AdminAction
                  label="Ghost members"
                  description="Add historical ancestors to the tree"
                  emoji="👻"
                  onPress={() => {}}
                />
                <AdminAction
                  label="Family settings"
                  description="Age threshold, feature flags"
                  emoji="⚙️"
                  onPress={() => {}}
                />
              </View>
            </View>
          )}

        </View>
      </ScrollView>
    </View>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <View className="flex-1 bg-white/10 rounded-xl p-3 items-center">
      <Text className="text-white text-xl font-medium">{value}</Text>
      <Text className="text-primary-lighter text-xs mt-0.5">{label}</Text>
    </View>
  );
}

function QuickAction({
  label,
  emoji,
  onPress,
  primary = false,
}: {
  label: string;
  emoji: string;
  onPress: () => void;
  primary?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-1 rounded-xl p-3.5 flex-row items-center gap-2 ${
        primary
          ? "bg-primary border border-primary-light"
          : "bg-background-card border border-border"
      }`}
    >
      <Text className="text-lg">{emoji}</Text>
      <Text
        className={`text-xs font-medium flex-1 ${
          primary ? "text-white" : "text-text-primary"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function MemberRow({ member }: { member: TreeMember }) {
  const roleVariant = member.is_admin
    ? "admin"
    : member.member_type === "adult"
    ? "adult"
    : "child";

  return (
    <View className="flex-row items-center gap-3 px-2 py-3">
      <Avatar
        firstName={member.first_name}
        lastName={member.last_name}
        photoUrl={member.photo_url}
        isAdmin={member.is_admin}
        isDeceased={member.is_deceased}
        size="md"
      />
      <View className="flex-1">
        <Text className="text-text-primary text-sm font-medium">
          {member.first_name} {member.last_name}
        </Text>
        {member.relationship_type ? (
          <Text className="text-text-muted text-xs">
            {member.relationship_type}
          </Text>
        ) : null}
      </View>
      <Badge variant={roleVariant} />
    </View>
  );
}

function AdminAction({
  label,
  description,
  emoji,
  onPress,
}: {
  label: string;
  description: string;
  emoji: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-background-card border border-border rounded-xl p-4 flex-row items-center gap-3"
    >
      <View className="w-10 h-10 rounded-xl bg-background-surface items-center justify-center">
        <Text className="text-lg">{emoji}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-text-primary text-sm font-medium">{label}</Text>
        <Text className="text-text-muted text-xs mt-0.5">{description}</Text>
      </View>
      <Text className="text-text-muted">→</Text>
    </TouchableOpacity>
  );
}