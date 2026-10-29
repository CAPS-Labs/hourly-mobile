import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import SubmitHoursModal from "../components/SubmitHoursModal";
import { Colors } from "../constants/colors";
import { useAppState } from "../context/AppStateContext";

/**
 * Landing tab: organization identity, the hours totals, and a shortcut to log
 * new hours.
 */
export default function HomeScreen() {
  const { organization, organizationTotalHours, personalHours } = useAppState();
  const [submitVisible, setSubmitVisible] = useState(false);

  return (
    <View style={styles.Screen}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.Content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.OrganizationName}>{organization.name}</Text>
        <Text style={styles.OrganizationSlogan}>{organization.slogan}</Text>

        <View style={styles.StatsRow}>
          <View style={styles.StatTile}>
            <Text style={styles.StatValue}>{organizationTotalHours.toLocaleString()}</Text>
            <Text style={styles.StatLabel}>Organization Total</Text>
          </View>

          <View style={styles.StatTile}>
            <Text style={styles.StatValue}>{personalHours}</Text>
            <Text style={styles.StatLabel}>Your Hours</Text>
          </View>
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
  OrganizationName: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  OrganizationSlogan: {
    color: Colors.secondaryText,
    fontSize: 15,
    lineHeight: 21,
    marginTop: 8,
  },
  StatsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 26,
  },
  StatTile: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 14,
    alignItems: "center",
  },
  StatValue: {
    color: Colors.text,
    fontSize: 26,
    fontWeight: "700",
  },
  StatLabel: {
    color: Colors.secondaryText,
    fontSize: 12,
    marginTop: 6,
    textAlign: "center",
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
});
