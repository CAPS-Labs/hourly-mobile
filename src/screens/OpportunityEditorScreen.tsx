import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Colors } from "../constants/colors";
import { useAppState } from "../context/AppStateContext";
import { isAdmin } from "../domain/access";
import type { ProjectsStackParamList } from "../navigation/ProjectsStack";

type Props = NativeStackScreenProps<ProjectsStackParamList, "OpportunityEditor">;

export default function OpportunityEditorScreen({ navigation, route }: Props) {
  const { categories, createProject, viewerRole } = useAppState();

  const { categoryId } = route.params;
  const category = categories.find((entry) => entry.id === categoryId);

  const [title, setTitle] = useState("");
  const [when, setWhen] = useState("");
  const [where, setWhere] = useState("");
  const [spotsInput, setSpotsInput] = useState("");

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
            Only organization admins can add service opportunities.
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

  const trimmedTitle = title.trim();
  const spots = Number(spotsInput);
  const canCreate = trimmedTitle.length > 0 && Number.isInteger(spots) && spots > 0;

  const create = () => {
    if (!canCreate) {
      return;
    }

    createProject({
      categoryId: category.id,
      title: trimmedTitle,
      when: when.trim(),
      where: where.trim(),
      spots,
    });

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

        <Text style={styles.Title}>New opportunity</Text>
        <Text style={styles.Subtitle}>
          Members of {category.name} will see this shift and can sign up for it.
        </Text>

        <Text style={styles.FieldLabel}>Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Saturday Morning Shift"
          placeholderTextColor="#777"
          autoCorrect={false}
          style={styles.FieldInput}
        />

        <Text style={styles.FieldLabel}>When</Text>
        <TextInput
          value={when}
          onChangeText={setWhen}
          placeholder="Sat, Nov 14 · 7:00 – 10:00 AM"
          placeholderTextColor="#777"
          style={styles.FieldInput}
        />

        <Text style={styles.FieldLabel}>Where</Text>
        <TextInput
          value={where}
          onChangeText={setWhere}
          placeholder="Community Center Lobby"
          placeholderTextColor="#777"
          style={styles.FieldInput}
        />

        <Text style={styles.FieldLabel}>Spots</Text>
        <TextInput
          value={spotsInput}
          onChangeText={setSpotsInput}
          placeholder="Number of members needed"
          placeholderTextColor="#777"
          keyboardType="numeric"
          style={styles.FieldInput}
        />

        <Pressable
          disabled={!canCreate}
          onPress={create}
          accessibilityRole="button"
          accessibilityLabel="Create opportunity"
          style={({ pressed }) => [
            styles.SaveButton,
            !canCreate && styles.SaveButtonDisabled,
            pressed && { opacity: 0.85 },
          ]}
        >
          <Text style={styles.SaveButtonText}>Create opportunity</Text>
        </Pressable>

        {!canCreate && (
          <Text style={styles.Hint}>
            A title and a whole number of spots are required. When and where are optional, but a
            shift with no time is hard to sign up for.
          </Text>
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
  SaveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
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
  Hint: {
    color: Colors.secondaryText,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 10,
  },
});
