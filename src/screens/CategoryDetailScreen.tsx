import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Colors } from "../constants/colors";
import { useAppState } from "../context/AppStateContext";
import { canSignUpInCategory, canViewCategory, isAdmin, statusInCategory } from "../domain/access";
import type { ProjectsStackParamList } from "../navigation/ProjectsStack";

type Props = NativeStackScreenProps<ProjectsStackParamList, "CategoryDetail">;

export default function CategoryDetailScreen({ navigation, route }: Props) {
  const {
    categories,
    projectsInCategory,
    isSignedUp,
    toggleProjectSignUp,
    categoryMemberships,
    viewerRole,
  } = useAppState();

  const category = categories.find((entry) => entry.id === route.params.categoryId);

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

  // Reached if the category was removed, or if an invite-only category is no
  // longer visible to this member.
  if (!category || !canViewCategory(category, categoryMemberships, viewerRole)) {
    return (
      <View style={styles.Screen}>
        <View style={styles.Content}>
          {back}
          <Text style={styles.Title}>Category unavailable</Text>
          <Text style={styles.Subtitle}>
            This category is either no longer available or limited to members an admin has added.
          </Text>
        </View>
      </View>
    );
  }

  const opportunities = projectsInCategory(category.id);
  const canSignUp = canSignUpInCategory(category, categoryMemberships, viewerRole);
  const pending = statusInCategory(category.id, categoryMemberships) === "pending";
  const admin = isAdmin(viewerRole);

  return (
    <View style={styles.Screen}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.Content}
        showsVerticalScrollIndicator={false}
      >
        {back}

        <Text style={styles.Title}>{category.name}</Text>
        <Text style={styles.Subtitle}>{category.description}</Text>

        {admin && (
          <View style={styles.AdminActions}>
            <Pressable
              onPress={() =>
                navigation.navigate("OpportunityEditor", { categoryId: category.id })
              }
              accessibilityRole="button"
              accessibilityLabel={`Add an opportunity to ${category.name}`}
              style={({ pressed }) => [styles.NewOpportunityButton, pressed && { opacity: 0.8 }]}
            >
              <Text style={styles.NewOpportunityText}>＋ New opportunity</Text>
            </Pressable>

            <Pressable
              onPress={() => navigation.navigate("CategoryMembers", { categoryId: category.id })}
              accessibilityRole="button"
              accessibilityLabel={`Manage members of ${category.name}`}
              style={({ pressed }) => [styles.MembersButton, pressed && { opacity: 0.75 }]}
            >
              <Text style={styles.MembersButtonText}>Members</Text>
            </Pressable>
          </View>
        )}

        {!canSignUp && (
          <View style={styles.AccessCard}>
            <Text style={styles.AccessTitle}>
              {pending ? "Request pending" : "Members only"}
            </Text>
            <Text style={styles.AccessBody}>
              {pending
                ? `Your request to join ${category.name} is waiting for an admin to approve it. You can sign up once you are approved.`
                : "This category is limited to its members. Request access and an admin will approve or deny it."}
            </Text>

            <Pressable
              onPress={() => navigation.navigate("JoinCategories")}
              accessibilityRole="button"
              accessibilityLabel="Browse categories to join"
              style={({ pressed }) => [styles.AccessButton, pressed && { opacity: 0.75 }]}
            >
              <Text style={styles.AccessButtonText}>Browse categories to join</Text>
            </Pressable>
          </View>
        )}

        {opportunities.length === 0 ? (
          <Text style={styles.Empty}>
            {admin
              ? "No opportunities in this category yet. Tap New opportunity to add the first shift."
              : "No opportunities in this category yet. Check back soon."}
          </Text>
        ) : (
          opportunities.map((project) => {
            const signedUp = isSignedUp(project.id);
            const spotsLeft = project.spots - (signedUp ? 1 : 0);

            return (
              <View key={project.id} style={styles.ProjectCard}>
                <View style={styles.ProjectInfo}>
                  <Text style={styles.ProjectTitle}>{project.title}</Text>
                  {!!project.when && <Text style={styles.ProjectMeta}>{project.when}</Text>}
                  {!!project.where && <Text style={styles.ProjectMeta}>{project.where}</Text>}
                  <Text style={styles.ProjectSpots}>
                    {spotsLeft} {spotsLeft === 1 ? "spot" : "spots"} left
                  </Text>
                </View>

                {canSignUp ? (
                  <Pressable
                    onPress={() => toggleProjectSignUp(project.id)}
                    style={({ pressed }) => [
                      styles.SignUpButton,
                      signedUp && styles.SignUpButtonActive,
                      pressed && { opacity: 0.8 },
                    ]}
                  >
                    <Text style={[styles.SignUpText, signedUp && styles.SignUpTextActive]}>
                      {signedUp ? "Signed Up ✓" : "Sign Up"}
                    </Text>
                  </Pressable>
                ) : (
                  <View style={styles.LockedChip}>
                    <Text style={styles.LockedChipText}>🔒 Locked</Text>
                  </View>
                )}
              </View>
            );
          })
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
  AdminActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  NewOpportunityButton: {
    backgroundColor: Colors.primary,
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: 16,
  },
  NewOpportunityText: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: "600",
  },
  MembersButton: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.24)",
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: 16,
  },
  MembersButtonText: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: "600",
  },
  AccessCard: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: "rgba(176, 176, 176, 0.35)",
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  AccessTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "600",
  },
  AccessBody: {
    color: Colors.secondaryText,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },
  AccessButton: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: 16,
    marginTop: 14,
  },
  AccessButtonText: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: "600",
  },
  ProjectCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  ProjectInfo: {
    flex: 1,
    paddingRight: 12,
  },
  ProjectTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  ProjectMeta: {
    color: Colors.secondaryText,
    fontSize: 13,
    marginTop: 4,
  },
  ProjectSpots: {
    color: "#4A90E2",
    fontSize: 12,
    marginTop: 6,
  },
  SignUpButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  SignUpButtonActive: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  SignUpText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
  },
  SignUpTextActive: {
    color: Colors.secondaryText,
  },
  LockedChip: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  LockedChipText: {
    color: Colors.secondaryText,
    fontSize: 12,
    fontWeight: "600",
  },
});
