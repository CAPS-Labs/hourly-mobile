import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Card from "./Card";
import { Colors } from "../constants/colors";
import { ORGANIZATIONS } from "../data/mockData";

/**
 * A registration request handed up to whichever container renders this template.
 * The container decides what happens next: send it to a backend, show a
 * pending-approval state, or move the member into the app.
 */
export type RegistrationRequest =
  | { kind: "joinOrganization"; organizationId: number; organizationName: string }
  | { kind: "joinByCode"; code: string }
  | { kind: "createOrganization"; name: string; slogan: string };

type RegistrationTemplateProps = {
  onRequest: (request: RegistrationRequest) => void;
};

type Step = "list" | "create" | "join";

/**
 * Registration UI: pick an organization, join with a code, or create one.
 * It renders content only — the container owns the screen background, safe
 * area, top spacing, and whatever is shown after a request.
 */
export default function RegistrationTemplate({ onRequest }: RegistrationTemplateProps) {
  const [step, setStep] = useState<Step>("list");

  const [createName, setCreateName] = useState("");
  const [createSlogan, setCreateSlogan] = useState("");
  const [joinCode, setJoinCode] = useState("");

  return (
    <View style={styles.Root}>
      {step === "list" && (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.ListContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.Title}>Register for an Organization</Text>
          <Text style={styles.Subtitle}>
            Pick your organization from the list, enter a join code, or start a new one.
          </Text>

          {ORGANIZATIONS.map((org) => (
            <TouchableOpacity
              key={org.id}
              activeOpacity={0.85}
              onPress={() =>
                onRequest({
                  kind: "joinOrganization",
                  organizationId: org.id,
                  organizationName: org.name,
                })
              }
            >
              <Card>
                <Text style={styles.OrgCardName}>{org.name}</Text>

                {!!org.slogan && <Text style={styles.OrgCardSlogan}>{org.slogan}</Text>}
              </Card>
            </TouchableOpacity>
          ))}

          <View style={styles.Actions}>
            <Pressable
              onPress={() => setStep("create")}
              style={({ pressed }) => [
                styles.ActionButton,
                styles.ActionButtonPrimary,
                pressed && styles.ActionButtonPressed,
              ]}
            >
              <Text style={styles.ActionText}>Create</Text>
            </Pressable>

            <Pressable
              onPress={() => setStep("join")}
              style={({ pressed }) => [
                styles.ActionButton,
                styles.ActionButtonSecondary,
                pressed && styles.ActionButtonPressed,
              ]}
            >
              <Text style={styles.ActionText}>Join</Text>
            </Pressable>
          </View>
        </ScrollView>
      )}

      {step === "create" && (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.FormContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.FormTitle}>Create Organization</Text>
          <Text style={styles.FormSubtitle}>
            Start an organization, then invite members to join.
          </Text>

          <Text style={styles.FieldLabel}>Name</Text>
          <TextInput
            value={createName}
            onChangeText={setCreateName}
            placeholder="e.g. Servants of Spokane"
            placeholderTextColor="#777"
            autoCapitalize="words"
            style={styles.FieldInput}
          />

          <Text style={styles.FieldLabel}>Slogan</Text>
          <TextInput
            value={createSlogan}
            onChangeText={setCreateSlogan}
            placeholder="A short line about your organization"
            placeholderTextColor="#777"
            style={styles.FieldInput}
          />

          <Pressable
            disabled={!createName.trim()}
            onPress={() => {
              onRequest({
                kind: "createOrganization",
                name: createName.trim(),
                slogan: createSlogan.trim(),
              });

              setCreateName("");
              setCreateSlogan("");
              setStep("list");
            }}
            style={({ pressed }) => [
              styles.FormButton,
              styles.FormButtonPrimary,
              !createName.trim() && styles.FormButtonDisabled,
              pressed && { opacity: 0.8 },
            ]}
          >
            <Text style={styles.FormButtonText}>Create Organization</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setCreateName("");
              setCreateSlogan("");
              setStep("list");
            }}
            style={({ pressed }) => [
              styles.FormButton,
              styles.FormButtonGhost,
              pressed && { opacity: 0.8 },
            ]}
          >
            <Text style={styles.FormButtonGhostText}>Cancel</Text>
          </Pressable>
        </ScrollView>
      )}

      {step === "join" && (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.FormContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.FormTitle}>Join Organization</Text>
          <Text style={styles.FormSubtitle}>
            Enter the join code shared by an organization leader to become a member.
          </Text>

          <Text style={styles.FieldLabel}>Join code</Text>
          <TextInput
            value={joinCode}
            onChangeText={setJoinCode}
            placeholder="e.g. OAKS-2026"
            placeholderTextColor="#777"
            autoCapitalize="characters"
            autoCorrect={false}
            style={styles.FieldInput}
          />

          <Pressable
            disabled={!joinCode.trim()}
            onPress={() => {
              onRequest({ kind: "joinByCode", code: joinCode.trim() });

              setJoinCode("");
              setStep("list");
            }}
            style={({ pressed }) => [
              styles.FormButton,
              styles.FormButtonPrimary,
              !joinCode.trim() && styles.FormButtonDisabled,
              pressed && { opacity: 0.8 },
            ]}
          >
            <Text style={styles.FormButtonText}>Join Organization</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setJoinCode("");
              setStep("list");
            }}
            style={({ pressed }) => [
              styles.FormButton,
              styles.FormButtonGhost,
              pressed && { opacity: 0.8 },
            ]}
          >
            <Text style={styles.FormButtonGhostText}>Cancel</Text>
          </Pressable>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  Root: {
    flex: 1,
  },
  ListContent: {
    paddingTop: 24,
    paddingBottom: 32,
  },
  Title: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.5,
    marginHorizontal: 12,
  },
  Subtitle: {
    color: Colors.secondaryText,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 12,
    marginHorizontal: 12,
  },
  OrgCardName: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "600",
  },
  OrgCardSlogan: {
    color: Colors.secondaryText,
    fontSize: 14,
    marginTop: 6,
  },
  Actions: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  ActionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  ActionButtonPrimary: {
    backgroundColor: Colors.primary,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  ActionButtonSecondary: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.14)",
  },
  ActionButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  ActionText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  FormContent: {
    padding: 20,
    paddingBottom: 48,
  },
  FormTitle: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  FormSubtitle: {
    color: Colors.secondaryText,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 26,
  },
  FieldLabel: {
    color: Colors.secondaryText,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  FieldInput: {
    backgroundColor: Colors.card,
    color: Colors.text,
    fontSize: 15,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    marginBottom: 20,
  },
  FormButton: {
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  FormButtonPrimary: {
    backgroundColor: Colors.primary,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  FormButtonDisabled: {
    opacity: 0.4,
    shadowOpacity: 0,
    elevation: 0,
  },
  FormButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  FormButtonGhost: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.14)",
  },
  FormButtonGhostText: {
    color: Colors.secondaryText,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});
