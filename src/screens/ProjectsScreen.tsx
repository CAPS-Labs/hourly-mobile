import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Colors } from "../constants/colors";
import { useAppState } from "../context/AppStateContext";
import {
  accessLabel,
  isAdmin,
  joinedProjects,
  joinableProjects,
} from "../domain/access";
import type { ProjectsStackParamList } from "../navigation/ProjectsStack";

type Props = NativeStackScreenProps<ProjectsStackParamList, "ProjectsHome">;

export default function ProjectsScreen({ navigation }: Props) {
  const {
    organization,
    projects,
    opportunitiesInProject,
    isSignedUp,
    projectMemberships,
    viewerRole,
    membershipsFor,
  } = useAppState();

  const admin = isAdmin(viewerRole);

  // The list holds what the viewer can use today. Projects that still need an
  // approval live on the join screen, reached from the card at the bottom, so no
  // row here has to explain why it is locked.
  const listed = joinedProjects(projects, projectMemberships, viewerRole);
  const joinable = joinableProjects(projects, projectMemberships, viewerRole);

  return (
    <View style={styles.Screen}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.Content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.Header}>
          <Text style={styles.Title}>Projects</Text>

          {admin && (
            <Pressable
              onPress={() => navigation.navigate("ProjectEditor", {})}
              accessibilityRole="button"
              accessibilityLabel="Create a project"
              style={({ pressed }) => [styles.NewButton, pressed && { opacity: 0.75 }]}
            >
              <Text style={styles.NewButtonText}>＋ New</Text>
            </Pressable>
          )}
        </View>

        <Text style={styles.Subtitle}>
          Browse opportunities with {organization.name} by project. Open a project to see its
          shifts and sign up.
        </Text>

        {listed.length === 0 && (
          <Text style={styles.Empty}>You are not in any projects yet.</Text>
        )}

        {listed.map((project) => {
          const opportunities = opportunitiesInProject(project.id);
          const signedUpCount = opportunities.filter((opportunity) => isSignedUp(opportunity.id)).length;
          const pendingCount = admin
            ? membershipsFor(project.id).filter((entry) => entry.status === "pending").length
            : 0;

          return (
            <View key={project.id} style={styles.ProjectCard}>
              <Pressable
                onPress={() => navigation.navigate("ProjectDetail", { projectId: project.id })}
                accessibilityRole="button"
                accessibilityLabel={`Open ${project.name}`}
                style={({ pressed }) => [styles.ProjectMain, pressed && styles.CardPressed]}
              >
                <View style={styles.ProjectInfo}>
                  <Text style={styles.ProjectName}>{project.name}</Text>
                  <Text style={styles.ProjectDescription}>{project.description}</Text>
                  <Text style={styles.ProjectMeta}>
                    {opportunities.length === 0
                      ? "No opportunities yet"
                      : `${opportunities.length} ${
                          opportunities.length === 1 ? "opportunity" : "opportunities"
                        }`}
                    {signedUpCount > 0 ? ` · ${signedUpCount} signed up` : ""}
                  </Text>
                </View>

                <Text style={styles.Chevron}>›</Text>
              </Pressable>

              {admin && (
                <View style={styles.AccessRow}>
                  <View style={styles.LockChip}>
                    <Text style={styles.LockChipText}>{accessLabel(project.access)}</Text>
                  </View>

                  <View style={styles.AdminActions}>
                    {pendingCount > 0 && (
                      <Pressable
                        onPress={() => navigation.navigate("Requests")}
                        accessibilityRole="button"
                        accessibilityLabel={`${pendingCount} pending requests for ${project.name}`}
                        style={({ pressed }) => [styles.PendingChip, pressed && { opacity: 0.75 }]}
                      >
                        <Text style={styles.PendingChipText}>{pendingCount} pending</Text>
                      </Pressable>
                    )}

                    <Pressable
                      onPress={() => navigation.navigate("ProjectMembers", { projectId: project.id })}
                      accessibilityRole="button"
                      accessibilityLabel={`Manage members of ${project.name}`}
                      style={({ pressed }) => [styles.EditButton, pressed && { opacity: 0.75 }]}
                    >
                      <Text style={styles.EditButtonText}>Members</Text>
                    </Pressable>

                    <Pressable
                      onPress={() =>
                        navigation.navigate("ProjectEditor", { projectId: project.id })
                      }
                      accessibilityRole="button"
                      accessibilityLabel={`Edit ${project.name}`}
                      style={({ pressed }) => [styles.EditButton, pressed && { opacity: 0.75 }]}
                    >
                      <Text style={styles.EditButtonText}>Edit</Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </View>
          );
        })}

        {!admin && joinable.length > 0 && (
          <Pressable
            onPress={() => navigation.navigate("JoinProjects")}
            accessibilityRole="button"
            accessibilityLabel="Browse projects to join"
            style={({ pressed }) => [styles.JoinCard, pressed && styles.CardPressed]}
          >
            <View style={styles.ProjectInfo}>
              <Text style={styles.JoinTitle}>Explore other projects</Text>
              <Text style={styles.JoinBody}>
                {joinable.length === 1
                  ? "1 project open to requests"
                  : `${joinable.length} projects open to requests`}
              </Text>
            </View>

            <Text style={styles.Chevron}>›</Text>
          </Pressable>
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
    paddingTop: 100,
    paddingBottom: 40,
  },
  Header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  Title: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  NewButton: {
    backgroundColor: Colors.primary,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  NewButtonText: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: "600",
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
  ProjectCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  ProjectMain: {
    flexDirection: "row",
    alignItems: "center",
  },
  CardPressed: {
    opacity: 0.8,
  },
  ProjectInfo: {
    flex: 1,
    paddingRight: 12,
  },
  ProjectName: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: "600",
  },
  ProjectDescription: {
    color: Colors.secondaryText,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  ProjectMeta: {
    color: "#4A90E2",
    fontSize: 12,
    marginTop: 8,
  },
  Chevron: {
    color: Colors.secondaryText,
    fontSize: 24,
    fontWeight: "300",
    paddingBottom: 2,
  },
  AccessRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
  },
  LockChip: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  LockChipText: {
    color: Colors.secondaryText,
    fontSize: 11,
    fontWeight: "600",
  },
  AdminActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  PendingChip: {
    backgroundColor: "rgba(74, 144, 226, 0.18)",
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  PendingChipText: {
    color: "#4A90E2",
    fontSize: 11,
    fontWeight: "600",
  },
  EditButton: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.24)",
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginLeft: 8,
  },
  EditButtonText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: "600",
  },
  JoinCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.14)",
    borderRadius: 14,
    padding: 16,
    marginTop: 4,
  },
  JoinTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "600",
  },
  JoinBody: {
    color: Colors.secondaryText,
    fontSize: 13,
    marginTop: 4,
  },
});
