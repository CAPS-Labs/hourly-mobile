import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../constants/colors";

type CardProps = {
  children: React.ReactNode;
};

/**
 * Rounded gradient panel used to group content, e.g. one tile per organization.
 */
export default function Card({ children }: CardProps) {
  return (

    <LinearGradient
      colors={[Colors.primary, "#292b30e8"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.card}
    >
      {children}
    </LinearGradient>

  );
}

const styles = StyleSheet.create({
  card: {
    padding: 35,
    minHeight: 200,
    borderRadius: 24,
    margin: 12,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 4, height: 4 },

    elevation: 3,
  },
});