import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Colors } from "../constants/colors";
import { useAppState } from "../context/AppStateContext";

/**
 * Upcoming opportunities with the organization, each with a sign-up toggle and
 * the number of spots still open.
 */
export default function ProjectsScreen() {
  const { organization, projects, isSignedUp, toggleProjectSignUp } = useAppState();

  return (
    <View style={styles.Screen}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.Content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.Title}>Projects</Text>
        <Text style={styles.Subtitle}>
          Upcoming opportunities with {organization.name}. Sign up for a shift and it will count
          toward your hours.
        </Text>

        {projects.map((project) => {
          const signedUp = isSignedUp(project.id);
          const spotsLeft = project.spots - (signedUp ? 1 : 0);

          return (
            <View key={project.id} style={styles.ProjectCard}>
              <View style={styles.ProjectInfo}>
                <Text style={styles.ProjectTitle}>{project.title}</Text>
                <Text style={styles.ProjectMeta}>{project.when}</Text>
                <Text style={styles.ProjectMeta}>{project.where}</Text>
                <Text style={styles.ProjectSpots}>
                  {spotsLeft} {spotsLeft === 1 ? "spot" : "spots"} left
                </Text>
              </View>

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
            </View>
          );
        })}
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
});
