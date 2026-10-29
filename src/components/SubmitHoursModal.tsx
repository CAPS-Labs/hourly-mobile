import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { Colors } from "../constants/colors";
import { useAppState } from "../context/AppStateContext";

type SubmitHoursModalProps = {
  visible: boolean;
  onClose: () => void;
};

/**
 * Full-screen form for logging hours against a service field. Resets its own
 * inputs on every dismissal so reopening always starts blank.
 */
export default function SubmitHoursModal({ visible, onClose }: SubmitHoursModalProps) {
  const { organization, serviceFields, submitHours } = useAppState();

  const [hoursInput, setHoursInput] = useState("");
  const [notesInput, setNotesInput] = useState("");
  const [selectedField, setSelectedField] = useState("");
  const [fieldPickerVisible, setFieldPickerVisible] = useState(false);

  const hours = Number(hoursInput);
  const canSubmit = Number.isFinite(hours) && hours > 0 && !!selectedField;

  const reset = () => {
    setHoursInput("");
    setNotesInput("");
    setSelectedField("");
    setFieldPickerVisible(false);
  };

  const close = () => {
    reset();
    onClose();
  };

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }

    submitHours({ hours, field: selectedField, notes: notesInput.trim() });
    close();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={close}
    >
      <View style={styles.Screen}>
        <Text style={styles.Title}>Submit Hours</Text>
        <Text style={styles.Subtitle}>
          Log time served with {organization.name}.
        </Text>

        <Text style={styles.FieldLabel}>Hours Served</Text>
        <TextInput
          value={hoursInput}
          onChangeText={setHoursInput}
          placeholder="Number of hours"
          placeholderTextColor="#777"
          keyboardType="numeric"
          style={styles.FieldInput}
        />

        <Text style={styles.FieldLabel}>Service Field</Text>
        <Pressable
          onPress={() => setFieldPickerVisible(true)}
          style={({ pressed }) => [styles.SelectInput, pressed && { opacity: 0.8 }]}
        >
          <Text style={selectedField ? styles.SelectValue : styles.SelectPlaceholder}>
            {selectedField || "Choose a service field"}
          </Text>
        </Pressable>

        <Text style={styles.FieldLabel}>Notes</Text>
        <TextInput
          value={notesInput}
          onChangeText={setNotesInput}
          placeholder="Anything worth recording (optional)"
          placeholderTextColor="#777"
          style={[styles.FieldInput, styles.NotesInput]}
        />

        <Pressable
          disabled={!canSubmit}
          onPress={handleSubmit}
          style={({ pressed }) => [
            styles.Button,
            styles.ButtonPrimary,
            !canSubmit && styles.ButtonDisabled,
            pressed && { opacity: 0.8 },
          ]}
        >
          <Text style={styles.ButtonText}>Submit Hours</Text>
        </Pressable>

        <Pressable
          onPress={close}
          style={({ pressed }) => [
            styles.Button,
            styles.ButtonGhost,
            pressed && { opacity: 0.8 },
          ]}
        >
          <Text style={styles.ButtonGhostText}>Cancel</Text>
        </Pressable>
      </View>

      <Modal
        visible={fieldPickerVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setFieldPickerVisible(false)}
      >
        <View style={styles.PickerBackdrop}>
          <View style={styles.PickerSheet}>
            <Text style={styles.PickerTitle}>Select Service Field</Text>

            {serviceFields.map((field) => (
              <Pressable
                key={field}
                onPress={() => {
                  setSelectedField(field);
                  setFieldPickerVisible(false);
                }}
                style={({ pressed }) => (pressed ? { opacity: 0.7 } : undefined)}
              >
                <Text
                  style={[
                    styles.PickerOption,
                    selectedField === field && styles.PickerOptionSelected,
                  ]}
                >
                  {field}
                </Text>
              </Pressable>
            ))}

            <Pressable
              onPress={() => setFieldPickerVisible(false)}
              style={({ pressed }) => [
                styles.PickerCancel,
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text style={styles.PickerCancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  Screen: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
    paddingTop: 60,
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
  NotesInput: {
    marginBottom: 26,
  },
  SelectInput: {
    backgroundColor: Colors.card,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    marginBottom: 20,
  },
  SelectValue: {
    color: Colors.text,
    fontSize: 15,
  },
  SelectPlaceholder: {
    color: "#777",
    fontSize: 15,
  },
  Button: {
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  ButtonPrimary: {
    backgroundColor: Colors.primary,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  ButtonDisabled: {
    opacity: 0.4,
    shadowOpacity: 0,
    elevation: 0,
  },
  ButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  ButtonGhost: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.14)",
  },
  ButtonGhostText: {
    color: Colors.secondaryText,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  PickerBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  PickerSheet: {
    backgroundColor: "#1F1F1F",
    padding: 20,
    paddingBottom: 32,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  PickerTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  PickerOption: {
    color: Colors.text,
    fontSize: 16,
    paddingVertical: 14,
  },
  PickerOptionSelected: {
    // Lighter tint of Colors.primary so the selected row stays readable on the dark sheet.
    color: "#8FD08A",
    fontWeight: "600",
  },
  PickerCancel: {
    marginTop: 12,
    padding: 14,
    borderRadius: 999,
    backgroundColor: "#333",
  },
  PickerCancelText: {
    color: Colors.text,
    textAlign: "center",
    fontWeight: "600",
  },
});
