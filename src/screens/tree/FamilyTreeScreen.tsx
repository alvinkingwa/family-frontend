import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useEffect, useState } from "react";
import { useTreeStore } from "@/store/tree.store";
import { useFamilyStore } from "@/store/family.store";
import { treeService } from "@/services/tree.service";
import { LoadingSpinner, EmptyState, Avatar, Badge } from "@/components/common";
import { Household, TreeMember } from "@/types";
import { colors } from "@/constants";

const { width } = Dimensions.get("window");

export default function FamilyTreeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const { tree, setTree, isLoading, setLoading } = useTreeStore();
  const { isAdmin } = useFamilyStore();

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

  // group households by generation
  const householdsByGeneration = tree?.households.reduce(
    (acc, h) => {
      const gen = h.generation;
      if (!acc[gen]) acc[gen] = [];
      acc[gen].push(h);
      return acc;
    },
    {} as Record<number, Household[]>
  ) ?? {};

  const generations = Object.keys(householdsByGeneration)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <View className="flex-1 bg-background">

      {/* header */}
      <View className="bg-primary px-6 pt-14 pb-6">
        <View className="flex-row items-center justify-between">
          <Text className="text-white text-2xl font-medium">Family Tree</Text>
          {isAdmin && (
            <TouchableOpacity
              className="bg-white/15 px-3 py-1.5 rounded-full"
              onPress={() => {}}
            >
              <Text className="text-white text-sm">+ Household</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isLoading ? (
        <LoadingSpinner fullScreen message="Loading family tree..." />
      ) : !tree || tree.households.length === 0 ? (
        <EmptyState
          title="No households yet"
          message={
            isAdmin
              ? "Create the first household to start building the family tree"
              : "The admin hasn't set up the family tree yet"
          }
          actionLabel={isAdmin ? "Create household" : undefined}
          onAction={isAdmin ? () => {} : undefined}
        />
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchTree();
              }}
              tintColor={colors.primary.DEFAULT}
            />
          }
        >
          <View className="px-4 pt-6 pb-8 gap-6">
            {generations.map((gen) => (
              <GenerationRow
                key={gen}
                generation={gen}
                households={householdsByGeneration[gen]}
                members={tree?.members ?? []}
                isAdmin={isAdmin}
              />
            ))}

            {/* ghost members */}
            {tree?.ghosts && tree.ghosts.length > 0 && (
              <View>
                <Text className="text-text-muted text-xs font-medium uppercase tracking-wider mb-3 px-2">
                  Historical ancestors
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-3 px-2">
                    {tree.ghosts.map((ghost) => (
                      <View
                        key={ghost.id}
                        className="bg-background-card border border-border rounded-xl p-3 w-32 items-center gap-2"
                        style={{ borderStyle: "dashed" }}
                      >
                        <Avatar
                          firstName={ghost.first_name}
                          lastName={ghost.last_name}
                          isGhost={!ghost.linked_user_id}
                          isDeceased={ghost.is_deceased}
                          size="md"
                        />
                        <Text
                          className="text-text-secondary text-xs text-center font-medium"
                          numberOfLines={1}
                        >
                          {ghost.first_name} {ghost.last_name}
                        </Text>
                        <Badge variant="ghost" />
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}

          </View>
        </ScrollView>
      )}
    </View>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function GenerationRow({
  generation,
  households,
  members,
  isAdmin,
}: {
  generation: number;
  households: Household[];
  members: TreeMember[];
  isAdmin: boolean;
}) {
  return (
    <View>
      {/* generation label */}
      <View className="flex-row items-center gap-3 mb-3">
        <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
          <Text className="text-white text-xs font-medium">{generation}</Text>
        </View>
        <Text className="text-text-muted text-xs font-medium uppercase tracking-wider">
          Generation {generation}
        </Text>
        <View className="flex-1 h-px bg-border" />
      </View>

      {/* households in this generation */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-3 px-1">
          {households.map((household) => (
            <HouseholdCard
              key={household.id}
              household={household}
              members={members.filter(
                (m) => m.household_id === household.id
              )}
              isAdmin={isAdmin}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function HouseholdCard({
  household,
  members,
  isAdmin,
}: {
  household: Household;
  members: TreeMember[];
  isAdmin: boolean;
}) {
  return (
    <TouchableOpacity
      className="bg-background-card border border-border rounded-2xl p-4"
      style={{ width: width * 0.65 }}
      onPress={() => {}}
    >
      {/* household name */}
      <View className="flex-row items-center justify-between mb-3">
        <Text
          className="text-text-primary text-sm font-medium flex-1"
          numberOfLines={1}
        >
          {household.name}
        </Text>
        <View className="bg-background-surface px-2 py-0.5 rounded-full ml-2">
          <Text className="text-text-muted text-xs">
            {members.length} {members.length === 1 ? "member" : "members"}
          </Text>
        </View>
      </View>

      {/* members */}
      {members.length === 0 ? (
        <Text className="text-text-muted text-xs italic">No members yet</Text>
      ) : (
        <View className="gap-2">
          {members.slice(0, 4).map((member) => (
            <View key={member.id} className="flex-row items-center gap-2">
              <Avatar
                firstName={member.first_name}
                lastName={member.last_name}
                photoUrl={member.photo_url}
                isAdmin={member.is_admin}
                isDeceased={member.is_deceased}
                size="sm"
              />
              <View className="flex-1">
                <Text
                  className="text-text-primary text-xs font-medium"
                  numberOfLines={1}
                >
                  {member.first_name} {member.last_name}
                </Text>
                {member.relationship_type && (
                  <Text className="text-text-muted text-xs" numberOfLines={1}>
                    {member.relationship_type}
                  </Text>
                )}
              </View>
              {member.is_admin && (
                <View className="w-4 h-4 rounded-full bg-amber items-center justify-center">
                  <Text style={{ fontSize: 8 }}>★</Text>
                </View>
              )}
            </View>
          ))}
          {members.length > 4 && (
            <Text className="text-text-muted text-xs">
              +{members.length - 4} more
            </Text>
          )}
        </View>
      )}

      {/* join request button for non-admin */}
      {!isAdmin && (
        <TouchableOpacity
          className="mt-3 border border-primary rounded-lg py-2 items-center"
          onPress={() => {}}
        >
          <Text className="text-primary text-xs font-medium">
            Request to join
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}