import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Colors } from "../constants/colors";
import { useAppState } from "../context/AppStateContext";
import {
  canRequestAccess,
  isAdmin,
  joinableCategories,
  statusInCategory,
} from "../domain/access";
import type { ProjectsStackParamList } from "../navigation/ProjectsStack";

type Props = NativeStackScreenProps<ProjectsStackParamList, "JoinCategories">;

/**
 * The one place a member asks to join a category. The Projects list only shows
 * categories they are already in, so registering interest is a separate errand
 * rather than a button attached to every locked row.
 */
export default function JoinCategoriesScreen({ navigation }: Props) {
  const {
    categories,
    categoryMemberships,
    viewerRole,
    requestCategoryAccess,
    cancelCategoryAccessRequest,
  } = useAppState();

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

  // Admins already have access to everything, so there is nothing to request.
  if (isAdmin(viewerRole)) {
    return (
      <View style={styles.Screen}>
        <View style={styles.Content}>
          {back}
          <Text style={styles.Title}>Nothing to join</Text>
          <Text style={styles.Subtitle}>
            As an admin you already have access to every category. Use Projects to change a
            category's access, or add members from its Members screen.
          </Text>
        </View>
      </View>
    );
  }

  const candidates = joinableCategories(categories, categoryMemberships, viewerRole);
  const available = candidates.filter((category) =>
    canRequestAccess(category, categoryMemberships, viewerRole)
  );
  const waiting = candidates.filter(
    (category) => statusInCategory(category.id, categoryMemberships) === "pending"
  );

  return (
    <View style={styles.Screen}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.Content}
        showsVerticalScrollIndicator={false}
      >
        {back}

        <Text style={styles.Title}>Join a category</Text>
        <Text style={styles.Subtitle}>
          Ask to join a category here. An admin approves or denies each request, and you can sign
          up for its opportunities once you are in.
        </Text>

        {available.length === 0 && waiting.length === 0 && (
          <Text style={styles.Empty}>
            Nothing is open to join right now. An admin can add you to a category directly.
          </Text>
        )}

        {available.length > 0 && (
          <>
            <Text style={styles.SectionTitle}>Available to join</Text>

            {available.map((category) => {
              const denied = statusInCategory(category.id, categoryMemberships) === "denied";

              return (
                <View key={category.id} style={styles.Card}>
                  <View style={styles.CardInfo}>
                    <Text style={styles.CardName}>{category.name}</Text>
                    <Text style={styles.CardBody}>{category.description}</Text>
                    {denied && (
                      <Text style={styles.DeniedNote}>
                        Your last request was denied. You can ask again.
                      </Text>
                    )}
                  </View>

                  <Pressable
                    onPress={() => requestCategoryAccess(category.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`Request to join ${category.name}`}
                    style={({ pressed }) => [styles.RequestButton, pressed && { opacity: 0.75 }]}
                  >
                    <Text style={styles.RequestButtonText}>
                      {denied ? "Ask again" : "Request to join"}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </>
        )}

        {waiting.length > 0 && (
          <>
            <Text style={styles.SectionTitle}>Waiting for approval</Text>

            {waiting.map((category) => (
              <View key={category.id} style={styles.Card}>
                <View style={styles.CardInfo}>
                  <Text style={styles.CardName}>{category.name}</Text>
                  <Text style={styles.CardBody}>
                    Your request has been sent. We'll let you know if you are approved. Press cancel to withdraw your request.
                  </Text>
                </View>

                <View style={styles.PendingActions}>
                  <View style={styles.PendingChip}>
                    <Text style={styles.PendingChipText}>Pending</Text>
                  </View>

                  <Pressable
                    onPress={() => cancelCategoryAccessRequest(category.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`Cancel your request to join ${category.name}`}
                    hitSlop={8}
                    style={({ pressed }) => [styles.RecallButton, pressed && { opacity: 0.7 }]}
                  >
                    <Text style={styles.RecallText}>Cancel</Text>
                  </Pressable>
                </View>
              </View>
            ))}
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
  SectionTitle: {
    color: Colors.secondaryText,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 10,
    marginTop: 4,
  },
  Card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  CardInfo: {
    flex: 1,
    paddingRight: 12,
  },
  CardName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  CardBody: {
    color: Colors.secondaryText,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  DeniedNote: {
    color: Colors.secondaryText,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 8,
    fontStyle: "italic",
  },
  RequestButton: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: 14,
  },
  RequestButtonText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: "600",
  },
  PendingActions: {
    alignItems: "flex-end",
  },
  PendingChip: {
    backgroundColor: "rgba(74, 144, 226, 0.18)",
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  PendingChipText: {
    color: "#4A90E2",
    fontSize: 11,
    fontWeight: "600",
  },
  RecallButton: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.24)",
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  RecallText: {
    color: Colors.secondaryText,
    fontSize: 12,
    fontWeight: "600",
  },
});
