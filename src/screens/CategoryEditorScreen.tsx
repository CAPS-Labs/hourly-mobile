import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Colors } from "../constants/colors";
import { useAppState } from "../context/AppStateContext";
import { isAdmin } from "../domain/access";
import type { ProjectsStackParamList } from "../navigation/ProjectsStack";
import { CategoryAccess } from "../types/models";

type Props = NativeStackScreenProps<ProjectsStackParamList, "CategoryEditor">;

const ACCESS_OPTIONS: { value: CategoryAccess; label: string; detail: string }[] = [
  {
    value: "open",
    label: "Everyone",
    detail: "Any member can see this category and sign up.",
  },
  {
    value: "request",
    label: "Request to join",
    detail: "Members can see it and ask; you approve each person.",
  },
  {
    value: "invite",
    label: "Invite only",
    detail: "Only people you add can see it.",
  },
];

export default function CategoryEditorScreen({ navigation, route }: Props) {
  const { categories, createCategory, updateCategory, viewerRole, membershipsFor } = useAppState();

  const categoryId = route.params?.categoryId;
  const category = categories.find((entry) => entry.id === categoryId);

  const [name, setName] = useState(category ? category.name : "");
  const [description, setDescription] = useState(category ? category.description : "");
  const [access, setAccess] = useState<CategoryAccess>(category ? category.access : "open");

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
            Only organization admins can create categories or change who sees them.
          </Text>
        </View>
      </View>
    );
  }

  if (categoryId !== undefined && !category) {
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

  const approvedCount = category
    ? membershipsFor(category.id).filter((entry) => entry.status === "approved").length
    : 0;

  const trimmedName = name.trim();
  const canSave = trimmedName.length > 0;

  const save = () => {
    if (!canSave) {
      return;
    }

    const input = { name: trimmedName, description: description.trim(), access };

    if (category) {
      updateCategory(category.id, input);
    } else {
      createCategory(input);
    }

    navigation.goBack();
  };

  return (
    <View style={styles.Screen}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.Content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {back}

        <Text style={styles.Title}>{category ? "Edit category" : "New category"}</Text>
        <Text style={styles.Subtitle}>
          {category
            ? "Rename the category and change who can see it."
            : "Name the category and choose who can see it. Opportunities and members come next."}
        </Text>

        <Text style={styles.FieldLabel}>Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Sports Events"
          placeholderTextColor="#777"
          autoCorrect={false}
          style={styles.FieldInput}
        />

        <Text style={styles.FieldLabel}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="What members do in this category"
          placeholderTextColor="#777"
          multiline
          style={[styles.FieldInput, styles.DescriptionInput]}
        />

        <Text style={styles.FieldLabel}>Who can see this category?</Text>

        {ACCESS_OPTIONS.map((option) => {
          const selected = option.value === access;

          return (
            <Pressable
              key={option.value}
              onPress={() => setAccess(option.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={option.label}
              style={({ pressed }) => [
                styles.AccessOption,
                selected && styles.AccessOptionSelected,
                pressed && { opacity: 0.85 },
              ]}
            >
              <View style={styles.AccessOptionHeader}>
                <Text style={[styles.AccessOptionLabel, selected && styles.AccessOptionLabelOn]}>
                  {option.label}
                </Text>
                {selected && <Text style={styles.AccessCheck}>✓</Text>}
              </View>
              <Text style={styles.AccessOptionDetail}>{option.detail}</Text>
            </Pressable>
          );
        })}

        {category ? (
          <View style={styles.ModeCard}>
            <Text style={styles.ModeCardTitle}>
              {access === "open" ? "Everyone has access" : `${approvedCount} with access`}
            </Text>

            <Text style={styles.ModeCardBody}>
              {access === "open"
                ? `Every member can see ${category.name} and sign up, so there is nobody to approve.`
                : access === "request"
                ? `Members can ask to join. Requests land in the Requests inbox and you approve each person. ${
                    approvedCount === 0
                      ? "Nobody has been approved yet."
                      : `${approvedCount} ${approvedCount === 1 ? "person has" : "people have"} access.`
                  }`
                : approvedCount === 0
                ? "Nobody has access yet. Invite the people who should see this category, or it stays invisible to every member."
                : `Only ${
                    approvedCount === 1 ? "the one person" : `these ${approvedCount} people`
                  } you added can see this category.`}
            </Text>

            <Pressable
              onPress={() => navigation.navigate("CategoryMembers", { categoryId: category.id })}
              accessibilityRole="button"
              accessibilityLabel={`Manage members of ${category.name}`}
              style={({ pressed }) => [styles.ManageButton, pressed && { opacity: 0.75 }]}
            >
              <Text style={styles.ManageButtonText}>Manage members</Text>
            </Pressable>
          </View>
        ) : (
          access !== "open" && (
            <Text style={styles.Hint}>
              You can add members once the category is saved — until then there is nobody to invite
              or approve.
            </Text>
          )
        )}

        <Pressable
          disabled={!canSave}
          onPress={save}
          accessibilityRole="button"
          accessibilityLabel={category ? "Save changes" : "Create category"}
          style={({ pressed }) => [
            styles.SaveButton,
            !canSave && styles.SaveButtonDisabled,
            pressed && { opacity: 0.85 },
          ]}
        >
          <Text style={styles.SaveButtonText}>
            {category ? "Save changes" : "Create category"}
          </Text>
        </Pressable>

        {!canSave && <Text style={styles.Hint}>Give the category a name to save it.</Text>}
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
  DescriptionInput: {
    minHeight: 84,
    textAlignVertical: "top",
  },
  AccessOption: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    padding: 14,
    marginBottom: 10,
  },
  AccessOptionSelected: {
    borderColor: Colors.primary,
  },
  AccessOptionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  AccessOptionLabel: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "600",
  },
  AccessOptionLabelOn: {
    color: "#9BD89B",
  },
  AccessOptionDetail: {
    color: Colors.secondaryText,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  AccessCheck: {
    color: "#9BD89B",
    fontSize: 15,
    fontWeight: "700",
  },
  ModeCard: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    padding: 16,
    marginTop: 14,
  },
  ModeCardTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "600",
  },
  ModeCardBody: {
    color: Colors.secondaryText,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },
  ManageButton: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginTop: 14,
  },
  ManageButtonText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: "600",
  },
  Hint: {
    color: Colors.secondaryText,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 10,
  },
  SaveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
  },
  SaveButtonDisabled: {
    opacity: 0.4,
  },
  SaveButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});
