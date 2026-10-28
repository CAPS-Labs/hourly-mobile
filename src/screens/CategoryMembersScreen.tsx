import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Colors } from "../constants/colors";
import { useAppState } from "../context/AppStateContext";
import { accessLabel, isAdmin } from "../domain/access";
import type { ProjectsStackParamList } from "../navigation/ProjectsStack";

type Props = NativeStackScreenProps<ProjectsStackParamList, "CategoryMembers">;

/**
 * One category's roster: who is waiting, who is in, and who can be added.
 * Kept separate from the category form so approvals commit immediately instead
 * of waiting on a Save button that the form's text fields need.
 */
export default function CategoryMembersScreen({ navigation, route }: Props) {
  const { categories, viewerRole, members, membershipsFor, setCategoryMembership } = useAppState();

  const category = categories.find((entry) => entry.id === route.params.categoryId);

  const back = (
    <Pressable
      onPress={() => navigation.goBack()}
      accessibilityRole="button"
      accessibilityLabel="Back"
      hitSlop={12}
      style={({ pressed }) => [styles.BackRow, pressed && { opacity: 0.7 }]}
    >
      <Text style={styles.BackText}>‹ Back</Text>
    </Pressable>
  );

  if (!isAdmin(viewerRole)) {
    return (
      <View style={styles.Screen}>
        <View style={styles.Content}>
          {back}
          <Text style={styles.Title}>Admins only</Text>
          <Text style={styles.Subtitle}>
            Only organization admins can manage who is in a category.
          </Text>
        </View>
      </View>
    );
  }

  if (!category) {
    return (
      <View style={styles.Screen}>
        <View style={styles.Content}>
          {back}
          <Text style={styles.Title}>Category unavailable</Text>
          <Text style={styles.Subtitle}>This category no longer exists.</Text>
        </View>
      </View>
    );
  }

  const memberName = (userId: string) => {
    const member = members.find((entry) => entry.id === userId);
    return member ? member.name : userId;
  };

  const memberships = membershipsFor(category.id);
  const pendingRequests = memberships.filter((entry) => entry.status === "pending");
  const approvedMembers = memberships.filter((entry) => entry.status === "approved");

  // People with no standing, or a previous denial, can be added directly.
  const addableMembers = members.filter(
    (member) =>
      !memberships.some(
        (entry) =>
          entry.userId === member.id &&
          (entry.status === "approved" || entry.status === "pending")
      )
  );

  return (
    <View style={styles.Screen}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.Content}
        showsVerticalScrollIndicator={false}
      >
        {back}

        <Text style={styles.Title}>Members</Text>
        <Text style={styles.Subtitle}>
          {category.name} · {accessLabel(category.access)}
        </Text>

        {category.access === "open" ? (
          <View style={styles.Notice}>
            <Text style={styles.NoticeTitle}>Everyone already has access</Text>
            <Text style={styles.NoticeBody}>
              {category.name} is open to every member, so there is nobody to approve and nothing to
              grant. Switch it to Requests or Invite only to limit who can take part.
            </Text>

            <Pressable
              onPress={() => navigation.navigate("CategoryEditor", { categoryId: category.id })}
              accessibilityRole="button"
              accessibilityLabel={`Change access for ${category.name}`}
              style={({ pressed }) => [styles.NoticeButton, pressed && { opacity: 0.75 }]}
            >
              <Text style={styles.NoticeButtonText}>Change access</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {category.access === "request" && (
              <>
                <Text style={styles.SectionLabel}>
                  Pending requests{pendingRequests.length > 0 ? ` (${pendingRequests.length})` : ""}
                </Text>

                {pendingRequests.length === 0 ? (
                  <Text style={styles.Hint}>No pending requests.</Text>
                ) : (
                  pendingRequests.map((entry) => (
                    <View key={entry.userId} style={styles.MemberRow}>
                      <Text style={styles.MemberName}>{memberName(entry.userId)}</Text>

                      <View style={styles.MemberActions}>
                        <Pressable
                          onPress={() =>
                            setCategoryMembership(category.id, entry.userId, "approved")
                          }
                          accessibilityRole="button"
                          accessibilityLabel={`Approve ${memberName(entry.userId)}`}
                          style={({ pressed }) => [
                            styles.ApproveButton,
                            pressed && { opacity: 0.75 },
                          ]}
                        >
                          <Text style={styles.ApproveText}>Approve</Text>
                        </Pressable>

                        <Pressable
                          onPress={() => setCategoryMembership(category.id, entry.userId, "denied")}
                          accessibilityRole="button"
                          accessibilityLabel={`Deny ${memberName(entry.userId)}`}
                          style={({ pressed }) => [styles.DenyButton, pressed && { opacity: 0.75 }]}
                        >
                          <Text style={styles.DenyText}>Deny</Text>
                        </Pressable>
                      </View>
                    </View>
                  ))
                )}
              </>
            )}

            <Text style={styles.SectionLabel}>
              People with access{approvedMembers.length > 0 ? ` (${approvedMembers.length})` : ""}
            </Text>

            {approvedMembers.length === 0 ? (
              <Text style={styles.Hint}>
                {category.access === "invite"
                  ? "Nobody yet. Add someone below and only they will see this category."
                  : "Nobody has been approved yet."}
              </Text>
            ) : (
              approvedMembers.map((entry) => (
                <View key={entry.userId} style={styles.MemberRow}>
                  <Text style={styles.MemberName}>{memberName(entry.userId)}</Text>

                  <Pressable
                    onPress={() => setCategoryMembership(category.id, entry.userId, null)}
                    accessibilityRole="button"
                    accessibilityLabel={`Remove ${memberName(entry.userId)}`}
                    style={({ pressed }) => [styles.DenyButton, pressed && { opacity: 0.75 }]}
                  >
                    <Text style={styles.DenyText}>Remove</Text>
                  </Pressable>
                </View>
              ))
            )}

            {addableMembers.length > 0 && (
              <>
                <Text style={styles.SectionLabel}>Add someone</Text>

                {addableMembers.map((member) => (
                  <View key={member.id} style={styles.MemberRow}>
                    <Text style={styles.MemberName}>{member.name}</Text>

                    <Pressable
                      onPress={() => setCategoryMembership(category.id, member.id, "approved")}
                      accessibilityRole="button"
                      accessibilityLabel={`Add ${member.name}`}
                      style={({ pressed }) => [styles.AddButton, pressed && { opacity: 0.75 }]}
                    >
                      <Text style={styles.AddText}>Add</Text>
                    </Pressable>
                  </View>
                ))}
              </>
            )}
          </>
        )}
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
    paddingBottom: 48,
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
  Notice: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
  },
  NoticeTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "600",
  },
  NoticeBody: {
    color: Colors.secondaryText,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },
  NoticeButton: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginTop: 14,
  },
  NoticeButtonText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: "600",
  },
  SectionLabel: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "600",
    marginTop: 18,
    marginBottom: 10,
  },
  Hint: {
    color: Colors.secondaryText,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 2,
  },
  MemberRow: {
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
  MemberActions: {
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
  AddButton: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  AddText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: "600",
  },
});
