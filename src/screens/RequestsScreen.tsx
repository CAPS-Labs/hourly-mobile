import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Colors } from "../constants/colors";
import { useAppState } from "../context/AppStateContext";
import { isAdmin } from "../domain/access";
import type { ProjectsStackParamList } from "../navigation/ProjectsStack";

type Props = NativeStackScreenProps<ProjectsStackParamList, "Requests">;

/**
 * Every pending category request in one place. Approving is a queue job that
 * spans categories, so it does not belong inside a single category's form.
 */
export default function RequestsScreen({ navigation }: Props) {
  const { categories, viewerRole, members, membershipsFor, setCategoryMembership } = useAppState();

  const back = (
    <Pressable
      onPress={() => navigation.goBack()}
      accessibilityRole="button"
      accessibilityLabel="Back to projects"
      hitSlop={12}
      style={({ pressed }) => [styles.BackRow, pressed && { opacity: 0.7 }]}
    >
      <Text style={styles.BackText}>‹ Projects</Text>
    </Pressable>
  );

  if (!isAdmin(viewerRole)) {
    return (
      <View style={styles.Screen}>
        <View style={styles.Content}>
          {back}
          <Text style={styles.Title}>Admins only</Text>
          <Text style={styles.Subtitle}>
            Only organization admins can approve requests to join a category.
          </Text>
        </View>
      </View>
    );
  }

  const memberName = (userId: string) => {
    const member = members.find((entry) => entry.id === userId);
    return member ? member.name : userId;
  };

  // Categories with nobody waiting are dropped entirely, so the queue is exactly
  // as long as the work left.
  const groups = categories
    .map((category) => ({
      category,
      pending: membershipsFor(category.id).filter((entry) => entry.status === "pending"),
    }))
    .filter((group) => group.pending.length > 0);

  const total = groups.reduce((sum, group) => sum + group.pending.length, 0);

  return (
    <View style={styles.Screen}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.Content}
        showsVerticalScrollIndicator={false}
      >
        {back}

        <Text style={styles.Title}>Requests</Text>
        <Text style={styles.Subtitle}>
          {total === 0
            ? "Members who ask to join a category will appear here for approval."
            : `${total} ${total === 1 ? "member is" : "members are"} waiting to join a category.`}
        </Text>

        {groups.length === 0 && (
          <Text style={styles.Empty}>
            No pending requests. Nothing needs your attention right now.
          </Text>
        )}

        {groups.map(({ category, pending }) => (
          <View key={category.id} style={styles.Group}>
            <View style={styles.GroupHeader}>
              <Text style={styles.GroupName}>{category.name}</Text>
              <View style={styles.GroupCount}>
                <Text style={styles.GroupCountText}>{pending.length}</Text>
              </View>
            </View>

            {pending.map((entry) => (
              <View key={entry.userId} style={styles.RequestRow}>
                <Text style={styles.MemberName}>{memberName(entry.userId)}</Text>

                <View style={styles.RowActions}>
                  <Pressable
                    onPress={() => setCategoryMembership(category.id, entry.userId, "approved")}
                    accessibilityRole="button"
                    accessibilityLabel={`Approve ${memberName(entry.userId)} for ${category.name}`}
                    style={({ pressed }) => [styles.ApproveButton, pressed && { opacity: 0.75 }]}
                  >
                    <Text style={styles.ApproveText}>Approve</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setCategoryMembership(category.id, entry.userId, "denied")}
                    accessibilityRole="button"
                    accessibilityLabel={`Deny ${memberName(entry.userId)} for ${category.name}`}
                    style={({ pressed }) => [styles.DenyButton, pressed && { opacity: 0.75 }]}
                  >
                    <Text style={styles.DenyText}>Deny</Text>
                  </Pressable>
                </View>
              </View>
            ))}

            <Pressable
              onPress={() => navigation.navigate("CategoryMembers", { categoryId: category.id })}
              accessibilityRole="button"
              accessibilityLabel={`Manage ${category.name} members`}
              style={({ pressed }) => [styles.ManageLink, pressed && { opacity: 0.7 }]}
            >
              <Text style={styles.ManageLinkText}>Manage {category.name} members ›</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  Screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  Content: {
    paddingHorizontal: 20,
    paddingTop: 64,
    paddingBottom: 40,
  },
  BackRow: {
    alignSelf: "flex-start",
    marginBottom: 18,
  },
  BackText: {
    color: Colors.secondaryText,
    fontSize: 15,
    fontWeight: "600",
  },
  Title: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  Subtitle: {
    color: Colors.secondaryText,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 22,
  },
  Empty: {
    color: Colors.secondaryText,
    fontSize: 14,
    lineHeight: 20,
  },
  Group: {
    marginBottom: 24,
  },
  GroupHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  GroupName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  GroupCount: {
    backgroundColor: "rgba(74, 144, 226, 0.18)",
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginLeft: 8,
  },
  GroupCountText: {
    color: "#4A90E2",
    fontSize: 11,
    fontWeight: "600",
  },
  RequestRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  MemberName: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "500",
    flexShrink: 1,
    paddingRight: 10,
  },
  RowActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  ApproveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  ApproveText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: "600",
  },
  DenyButton: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.24)",
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginLeft: 8,
  },
  DenyText: {
    color: Colors.secondaryText,
    fontSize: 12,
    fontWeight: "600",
  },
  ManageLink: {
    alignSelf: "flex-start",
    marginTop: 6,
  },
  ManageLinkText: {
    color: Colors.secondaryText,
    fontSize: 12,
    fontWeight: "600",
  },
});
