import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import SubmitHoursModal from "../components/SubmitHoursModal";
import { Colors } from "../constants/colors";
import { useAppState } from "../context/AppStateContext";

export default function MyServiceScreen() {
  const { organization, personalHours, submissions, categories, hoursByCategory } = useAppState();
  const [submitVisible, setSubmitVisible] = useState(false);

  const categoryName = (categoryId: number) =>
    categories.find((category) => category.id === categoryId)?.name ?? "Uncategorized";

  return (
    <View style={styles.Screen}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.Content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.Title}>My Service</Text>
        <Text style={styles.Subtitle}>Your hours served with {organization.name}.</Text>

        <View style={styles.HoursTile}>
          <Text style={styles.HoursValue}>{personalHours}</Text>
          <Text style={styles.HoursLabel}>Your Hours</Text>
        </View>

        <Pressable
          onPress={() => setSubmitVisible(true)}
          style={({ pressed }) => [
            styles.SubmitButton,
            pressed && styles.ButtonPressed,
          ]}
        >
          <Text style={styles.SubmitButtonText}>Submit Hours</Text>
        </Pressable>

        {hoursByCategory.length > 0 && (
          <>
            <Text style={styles.SectionTitle}>By Category</Text>

            <View style={styles.BreakdownCard}>
              {hoursByCategory.map((row) => (
                <View key={row.category.id} style={styles.BreakdownRow}>
                  <Text style={styles.BreakdownName}>{row.category.name}</Text>
                  <Text style={styles.BreakdownHours}>{row.hours} hrs</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <Text style={styles.SectionTitle}>Your Submissions</Text>

        {submissions.length === 0 ? (
          <Text style={styles.EmptyText}>
            No hours submitted yet. Tap Submit Hours after a shift.
          </Text>
        ) : (
          submissions.map((entry) => (
            <View key={entry.id} style={styles.SubmissionCard}>
              <View style={styles.SubmissionRow}>
                <Text style={styles.SubmissionHours}>{entry.hours} hrs</Text>
                <Text style={styles.SubmissionField}>{categoryName(entry.categoryId)}</Text>
              </View>

              {!!entry.notes && <Text style={styles.SubmissionNotes}>{entry.notes}</Text>}
            </View>
          ))
        )}
      </ScrollView>

      <SubmitHoursModal visible={submitVisible} onClose={() => setSubmitVisible(false)} />
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
  },
  HoursTile: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    paddingVertical: 28,
    alignItems: "center",
    marginTop: 22,
  },
  HoursValue: {
    color: Colors.text,
    fontSize: 44,
    fontWeight: "700",
  },
  HoursLabel: {
    color: Colors.secondaryText,
    fontSize: 13,
    marginTop: 6,
  },
  SubmitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  SubmitButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  ButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  SectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "600",
    marginTop: 32,
    marginBottom: 14,
  },
  EmptyText: {
    color: Colors.secondaryText,
    fontSize: 14,
    lineHeight: 20,
  },
  BreakdownCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  BreakdownRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  BreakdownName: {
    color: Colors.text,
    fontSize: 14,
    flexShrink: 1,
    paddingRight: 12,
  },
  BreakdownHours: {
    color: Colors.secondaryText,
    fontSize: 13,
    fontWeight: "600",
  },
  SubmissionCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  SubmissionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  SubmissionHours: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  SubmissionField: {
    color: Colors.secondaryText,
    fontSize: 13,
  },
  SubmissionNotes: {
    color: Colors.secondaryText,
    fontSize: 13,
    marginTop: 6,
  },
});
