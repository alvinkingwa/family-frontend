import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  TextInput,
} from "react-native";
import { useState, useEffect } from "react";
import { useTreeStore } from "@/store/tree.store";
import { useFamilyStore } from "@/store/family.store";
import { treeService } from "@/services/tree.service";
import { Avatar, Badge, EmptyState, LoadingSpinner } from "@/components/common";
import { TreeMember } from "@/types";
import { colors } from "@/constants";

export default function MembersListScreen() {
  const [search, setSearch] = useState("");
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

  const members = tree?.members ?? [];

  const filtered = search.trim()
    ? members.filter((m) =>
        `${m.first_name} ${m.last_name}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    : members;

  return (
    <View className="flex-1 bg-background">

      {/* header */}
      <View className="bg-primary px-6 pt-14 pb-6">
        <Text className="text-white text-2xl font-medium mb-4">Members</Text>

        {/* search */}
        <View className="bg-white/15 rounded-xl flex-row items-center px-4 py-2.5">
          <Text className="text-white/60 mr-2">🔍</Text>
          <TextInput
            className="flex-1 text-white text-sm"
            placeholder="Search members..."
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {isLoading ? (
        <LoadingSpinner fullScreen message="Loading members..." />
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
          <View className="px-6 pt-4 pb-8">

            {/* count */}
            <Text className="text-text-muted text-sm mb-4">
              {filtered.length} member{filtered.length !== 1 ? "s" : ""}
            </Text>

            {filtered.length === 0 ? (
              <EmptyState
                title="No members found"
                message={
                  search
                    ? "Try a different search term"
                    : "No members in this family yet"
                }
              />
            ) : (
              <View className="bg-background-card border border-border rounded-2xl overflow-hidden">
                {filtered.map((member, index) => (
                  <View key={member.id}>
                    <MemberRow member={member} isAdmin={isAdmin} />
                    {index < filtered.length - 1 && (
                      <View className="h-px bg-border mx-4" />
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* ghost members */}
            {tree?.ghosts && tree.ghosts.length > 0 && (
              <View className="mt-6">
                <Text className="text-text-primary text-base font-medium mb-3">
                  Historical members
                </Text>
                <View className="bg-background-card border border-border rounded-2xl overflow-hidden">
                  {tree.ghosts.map((ghost, index) => (
                    <View key={ghost.id}>
                      <View className="flex-row items-center gap-3 px-4 py-3">
                        <Avatar
                          firstName={ghost.first_name}
                          lastName={ghost.last_name}
                          isGhost={!ghost.linked_user_id}
                          isDeceased={ghost.is_deceased}
                          size="md"
                        />
                        <View className="flex-1">
                          <Text className="text-text-primary text-sm font-medium">
                            {ghost.first_name} {ghost.last_name}
                          </Text>
                          {ghost.date_of_death && (
                            <Text className="text-text-muted text-xs">
                              Deceased
                            </Text>
                          )}
                        </View>
                        <Badge variant="ghost" />
                      </View>
                      {index < tree.ghosts.length - 1 && (
                        <View className="h-px bg-border mx-4" />
                      )}
                    </View>
                  ))}
                </View>
              </View>
            )}

          </View>
        </ScrollView>
      )}
    </View>
  );
}

function MemberRow({
  member,
  isAdmin,
}: {
  member: TreeMember;
  isAdmin: boolean;
}) {
  const roleVariant = member.is_admin
    ? "admin"
    : member.member_type === "adult"
    ? "adult"
    : "child";

  return (
    <TouchableOpacity
      className="flex-row items-center gap-3 px-4 py-3"
      onPress={() => {}}
    >
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
        {member.relationship_type && (
          <Text className="text-text-muted text-xs">
            {member.relationship_type}
          </Text>
        )}
      </View>
      <Badge variant={roleVariant} />
    </TouchableOpacity>
  );
}