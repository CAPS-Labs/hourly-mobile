import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type CardProps = {
  children: React.ReactNode;
};

export default function Card({ children }: CardProps) {
  return (

    <LinearGradient
      colors={["#a6d4e9", "#cdf0c3"]}
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