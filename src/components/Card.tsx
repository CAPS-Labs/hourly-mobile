import React from "react";
import { View, StyleSheet } from "react-native";

type CardProps = {
  children: React.ReactNode;
};

export default function Card({ children }: CardProps) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },

    elevation: 3,
  },
});