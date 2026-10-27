import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Modal, Pressable } from "react-native";

import Card from "../components/Card"
import { Colors } from "../constants/colors";
import { Organization } from "../types/models";

export default function OrganizationsScreen() {
  // STATE
  const [mode, setMode] = useState("list");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalHours, setModalHours] = useState(false);
  const [fieldModalVisible, setFieldModalVisible] = useState(false);

  const [hoursInput, setHoursInput] = useState("");
  const [noteInput, setNoteInput] = useState("");
  const [selectedField, setSelectedField] = useState("");

  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [signedUpProjects, setSignedUpProjects] = useState<number[]>([]);

  const [createName, setCreateName] = useState("");
  const [createSlogan, setCreateSlogan] = useState("");
  const [joinCode, setJoinCode] = useState("");

  // MOCK DATA
  const organizations = [
    { id: 1, name: "The Oaks Ambassadors", slogan: "Lending a hand to those in need since 2025." },
    { id: 2, name: "Food Bank", slogan: "Providing meals to those in need" },
  ];

  const serviceFields = [
    "Coffee Bar",
    "Concessions",
    "Year Book",
    "Newspaper",
    "Event Services",
    "Hourly Development",
    ];

  const organizationStats = [
    { label: "Your Hours", value: "42" },
    { label: "Organization Total", value: "1,240" },
  ];

  const projects = [
    {
      id: 1,
      title: "Concession Stand",
      when: "Fri, Oct 30 · 5:00 – 9:00 PM",
      where: "Home Stadium · Concession A",
      spots: 4,
    },
    {
      id: 2,
      title: "Coffee Bar",
      when: "Sat, Oct 31 · 7:00 – 10:00 AM",
      where: "Community Center Lobby",
      spots: 2,
    },
    {
      id: 3,
      title: "Park Cleanup",
      when: "Sun, Nov 1 · 9:00 AM – 12:00 PM",
      where: "Riverside Park · North Entrance",
      spots: 8,
    },
    {
      id: 4,
      title: "Event Setup & Teardown",
      when: "Wed, Nov 4 · 3:30 – 7:30 PM",
      where: "Gymnasium",
      spots: 3,
    },
    {
      id: 5,
      title: "Yearbook Photos",
      when: "Thu, Nov 5 · 4:00 – 6:00 PM",
      where: "Media Room",
      spots: 1,
    },
  ];

    return (
        
        <View style={styles.Screen}>

            {/* Top Bar */}
            <View style={{ paddingTop: 100 }}></View>

            {/* CONDITIONAL RENDERING */}
            {mode === "list" && (
                <ScrollView 
                    style={{ flex: 1 }}
                    contentContainerStyle={{
                    backgroundColor: Colors.background,
                    paddingBottom: 20,
                    }}
                >
                    {organizations.map((org) => (
                        <TouchableOpacity
                            key={org.id}
                            activeOpacity={0.85}
                            onPress={() => {
                                setSelectedOrg(org);
                                setModalVisible(true);
                                if (selectedOrg) {
                                    console.log("Selected Organization:", selectedOrg.name);
                                }
                            }}
                        >
                            <Card>
                            <Text
                                style={{
                                color: "white",
                                fontSize: 18,
                                fontWeight: "600",
                                }}
                            >
                                {org.name}
                            </Text>

                            {org.slogan && (
                                <Text
                                style={{
                                    color: "#aaa",
                                    marginTop: 6,
                                }}
                                >
                                {org.slogan}
                                </Text>
                            )}
                            </Card>
                        </TouchableOpacity>
                    ))}

                    {/* BUTTONS */}
                    <View style={styles.OrgActions}>
                        <Pressable
                            onPress={() => setMode("create")}
                            style={({ pressed }) => [
                                styles.OrgActionButton,
                                styles.OrgActionButtonPrimary,
                                pressed && styles.OrgActionButtonPressed,
                            ]}
                        >
                            <Text style={styles.OrgActionTextPrimary}>Create</Text>
                        </Pressable>

                        <Pressable
                            onPress={() => setMode("join")}
                            style={({ pressed }) => [
                                styles.OrgActionButton,
                                styles.OrgActionButtonSecondary,
                                pressed && styles.OrgActionButtonPressed,
                            ]}
                        >
                            <Text style={styles.OrgActionTextSecondary}>Join</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            )}
            
            {/* MODAL */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={false}
            >
                <View style={styles.OrgModal}>
                    {/* CLOSE BUTTON */}
                    <Pressable
                        onPress={() => setModalVisible(false)}
                        style={styles.CloseButton}
                    >
                        <Text style={{ color: Colors.secondaryText }}>Close</Text>
                    </Pressable>

                    {selectedOrg && (
                        <>
                        {/* HEADER */}
                        <View style={styles.OrgHeader}>
                            <Text style={styles.OrgName}>{selectedOrg.name}</Text>

                            {!!selectedOrg.slogan && (
                                <Text style={styles.OrgSlogan}>{selectedOrg.slogan}</Text>
                            )}
                        </View>

                        <ScrollView
                            style={{ flex: 1 }}
                            contentContainerStyle={styles.OrgModalContent}
                            showsVerticalScrollIndicator={false}
                        >
                            {/* STATS */}
                            <View style={styles.StatsRow}>
                                {organizationStats.map((stat) => (
                                    <View key={stat.label} style={styles.StatTile}>
                                        <Text style={styles.StatValue}>{stat.value}</Text>
                                        <Text style={styles.StatLabel}>{stat.label}</Text>
                                    </View>
                                ))}
                            </View>

                            {/* SUBMIT HOURS */}
                            <Pressable
                                onPress={() => {
                                    setModalVisible(false);
                                    setModalHours(true);
                                }}
                                style={({ pressed }) => [
                                    styles.SubmitHoursButton,
                                    pressed && { opacity: 0.85 },
                                ]}
                            >
                                <Text style={styles.SubmitHoursText}>Submit Hours</Text>
                            </Pressable>

                            {/* UPCOMING PROJECTS */}
                            <Text style={styles.SectionTitle}>Upcoming Projects</Text>
                            <Text style={styles.SectionSubtitle}>
                                Sign up for a shift and it will count toward your hours.
                            </Text>

                            {projects.map((project) => {
                                const signedUp = signedUpProjects.includes(project.id);
                                const spotsLeft = project.spots - (signedUp ? 1 : 0);

                                return (
                                    <View key={project.id} style={styles.ProjectCard}>
                                        <View style={{ flex: 1, paddingRight: 12 }}>
                                            <Text style={styles.ProjectTitle}>{project.title}</Text>
                                            <Text style={styles.ProjectMeta}>{project.when}</Text>
                                            <Text style={styles.ProjectMeta}>{project.where}</Text>
                                            <Text style={styles.ProjectSpots}>
                                                {spotsLeft} {spotsLeft === 1 ? "spot" : "spots"} left
                                            </Text>
                                        </View>

                                        <Pressable
                                            onPress={() =>
                                                setSignedUpProjects((current) =>
                                                    current.includes(project.id)
                                                        ? current.filter((id) => id !== project.id)
                                                        : [...current, project.id]
                                                )
                                            }
                                            style={({ pressed }) => [
                                                styles.SignUpButton,
                                                signedUp && styles.SignUpButtonActive,
                                                pressed && { opacity: 0.8 },
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.SignUpText,
                                                    signedUp && styles.SignUpTextActive,
                                                ]}
                                            >
                                                {signedUp ? "Signed Up ✓" : "Sign Up"}
                                            </Text>
                                        </Pressable>
                                    </View>
                                );
                            })}
                        </ScrollView>
                        </>
                    )}
                </View>
            </Modal>
            <Modal
                visible={modalHours}
                animationType="slide"
                transparent={true}
            >
                <View style={{ flex: 1, backgroundColor: Colors.background, padding: 20 , minHeight: "100%", paddingTop: 60}}>
                    <Text style={{ color: "white", fontSize: 22, fontWeight: "600", marginBottom: 20 }}>
                        Submit Hours for {selectedOrg?.name}
                    </Text>
                    <Text style={{ color: "white", marginBottom: 8,}}>Hours Served</Text>
                    <TextInput
                        value={hoursInput}
                        onChangeText={setHoursInput}
                        placeholder="Number of hours"
                        placeholderTextColor="#555"
                        keyboardType="numeric"
                        style={{
                            backgroundColor: Colors.card,
                            color: "white",
                            padding: 10,
                            borderRadius: 5,
                            marginBottom: 10
                        }}
                    />
                    <Text style={{ color: "white", marginBottom: 8,}}>Service Field</Text>
                    <Pressable
                        onPress={() => {
                            console.log("Opening field selector");
                            setFieldModalVisible(!fieldModalVisible);
                        }}

                        style={{
                            backgroundColor: "#2A2A2A",
                            padding: 12,
                            borderRadius: 10,
                            marginBottom: 12,
                        }}
                        >
                        <Text
                            style={{
                            color: selectedField ? "white" : "#777",
                            }}
                        >
                            {selectedField || "Choose a service field"}
                        </Text>
                    </Pressable>
                    {fieldModalVisible && (
                        <View
                            style={{
                            backgroundColor: "#2A2A2A",
                            borderRadius: 10,
                            marginTop: 8,
                            overflow: "hidden",
                            }}
                        >
                            {serviceFields.map((field) => (
                            <Pressable
                                key={field}
                                onPress={() => {
                                setSelectedField(field);
                                setFieldModalVisible(false);
                                }}
                                style={({ pressed }) => ({
                                padding: 14,
                                opacity: pressed ? 0.7 : 1,
                                borderBottomWidth: 1,
                                borderBottomColor: "#333",
                                })}
                            >
                                <Text
                                style={{
                                    color:
                                    selectedField === field
                                        ? "#4A90E2"
                                        : "white",
                                }}
                                >
                                {field}
                                </Text>
                            </Pressable>
                            ))}
                        </View>
                    )}
                    <Text style={{ color: "white", marginBottom: 8,}}>Notes</Text>
                    <TextInput
                        value={noteInput}
                        onChangeText={setNoteInput}
                        placeholder="Notes"
                        placeholderTextColor="#777"
                        style={{
                            backgroundColor: "#2A2A2A",
                            color: "white",
                            padding: 12,
                            borderRadius: 10,
                            marginBottom: 20,
                        }}
                    />
                    <Pressable
                        onPress={() => {
                            console.log(hoursInput, "hours submitted for", selectedOrg?.name);
                            console.log("Selected Field:", selectedField);
                            console.log("Notes:", noteInput);

                            setHoursInput("");
                            setSelectedField("");
                            setNoteInput("");

                            setFieldModalVisible(false);
                            setModalHours(false);
                        }}
                        style={({ pressed }) => ({
                            backgroundColor: "#4A90E2",
                            padding: 14,
                            borderRadius: 10,
                            opacity: pressed ? 0.7 : 1,
                            transform: [
                                {
                                    scale: pressed ? 0.98 : 1,
                                },
                            ],
                        })}
                        >
                        <Text style={{ color: "white", textAlign: "center", fontWeight: "600"}}>Submit Hours</Text>
                    </Pressable>
                    <Pressable 
                        style={({ pressed }) => ({
                            backgroundColor: "#3b3b3b",
                            padding: 14,
                            borderRadius: 10,
                            marginTop: 12,
                            opacity: pressed ? 0.7 : 1,

                             transform: [
                                {
                                    scale: pressed ? 0.98 : 1,
                                },
                            ],
                          })}
                        onPress={() => {
                            setModalHours(false);
                            console.log("Cancelled Hour Submission");
                        }}
                    >
                        <Text style={{ color: "white", textAlign: "center", fontWeight: "600"}}>Cancel</Text>
                    </Pressable>
                </View>
            </Modal>
            <Modal
                visible={fieldModalVisible}
                transparent={true}
                animationType="slide"
            >
                <View
                    style={{
                    flex: 1,
                    justifyContent: "flex-end",
                    backgroundColor: "rgba(0,0,0,0.6)",
                    }}
                >
                    <View
                    style={{
                        backgroundColor: "#1F1F1F",
                        padding: 20,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                    }}
                    >
                    <Text
                        style={{
                        color: "white",
                        fontSize: 20,
                        fontWeight: "600",
                        marginBottom: 20,
                        }}
                    >
                        Select Service Field
                    </Text>

                    {serviceFields.map((field) => (
                        <Pressable
                            key={field}
                            onPress={() => {
                                setSelectedField(field);
                                setFieldModalVisible(false);
                            }}
                            style={({ pressed }) => ({
                                paddingVertical: 14,
                                opacity: pressed ? 0.7 : 1,
                            })}
                            >
                            <Text
                                style={{
                                    color:
                                    selectedField === field
                                        ? "#4A90E2"
                                        : "white",
                                    fontSize: 16,
                                }}
                            >
                                {field}
                            </Text>
                        </Pressable>
                    ))}

                    <Pressable
                        onPress={() => setFieldModalVisible(false)}
                        style={{
                        marginTop: 10,
                        padding: 12,
                        borderRadius: 10,
                        backgroundColor: "#333",
                        }}
                    >
                        <Text
                        style={{
                            color: "white",
                            textAlign: "center",
                        }}
                        >
                        Cancel
                        </Text>
                    </Pressable>
                    </View>
                </View>
            </Modal>
            {mode === "create" && (
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
                            console.log("Created organization:", createName, createSlogan);
                            setCreateName("");
                            setCreateSlogan("");
                            setMode("list");
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
                            setMode("list");
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

            {mode === "join" && (
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
                            console.log("Joining organization with code:", joinCode);
                            setJoinCode("");
                            setMode("list");
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
                            setMode("list");
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
    OrganizationName: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        fontSize: 24,
    },
    Screen: {
        backgroundColor: Colors.background,
        flex: 1,
    },
    OrgModal: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingTop: 60,
    },
    CloseButton: {
        alignSelf: "flex-end",
        paddingHorizontal: 20,
        paddingVertical: 8,
    },
    OrgHeader: {
        alignItems: "center",
        paddingHorizontal: 24,
        marginTop: 4,
    },
    OrgName: {
        color: Colors.text,
        fontSize: 28,
        fontWeight: "700",
        textAlign: "center",
    },
    OrgSlogan: {
        color: Colors.secondaryText,
        fontSize: 15,
        lineHeight: 21,
        textAlign: "center",
        marginTop: 8,
    },
    OrgModalContent: {
        padding: 20,
        paddingBottom: 48,
    },
    StatsRow: {
        flexDirection: "row",
        gap: 12,
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
    SubmitHoursButton: {
        backgroundColor: "#4A90E2",
        padding: 14,
        borderRadius: 10,
        marginTop: 16,
    },
    SubmitHoursText: {
        color: "white",
        textAlign: "center",
        fontWeight: "600",
    },
    SectionTitle: {
        color: Colors.text,
        fontSize: 18,
        fontWeight: "600",
        marginTop: 30,
    },
    SectionSubtitle: {
        color: Colors.secondaryText,
        fontSize: 13,
        marginTop: 4,
        marginBottom: 14,
    },
    ProjectCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.card,
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
    },
    ProjectTitle: {
        color: Colors.text,
        fontSize: 16,
        fontWeight: "600",
    },
    ProjectMeta: {
        color: Colors.secondaryText,
        fontSize: 13,
        marginTop: 4,
    },
    ProjectSpots: {
        color: "#4A90E2",
        fontSize: 12,
        marginTop: 6,
    },
    SignUpButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 999,
    },
    SignUpButtonActive: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    SignUpText: {
        color: "white",
        fontSize: 13,
        fontWeight: "600",
    },
    SignUpTextActive: {
        color: Colors.secondaryText,
    },
    OrgActions: {
        flexDirection: "row",
        gap: 12,
        paddingHorizontal: 12,
        marginTop: 8,
    },
    OrgActionButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
    },
    OrgActionButtonPrimary: {
        backgroundColor: Colors.primary,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    OrgActionButtonSecondary: {
        backgroundColor: Colors.card,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.14)",
    },
    OrgActionButtonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.97 }],
    },
    OrgActionTextPrimary: {
        color: Colors.text,
        fontSize: 16,
        fontWeight: "600",
        letterSpacing: 0.3,
    },
    OrgActionTextSecondary: {
        color: Colors.text,
        fontSize: 16,
        fontWeight: "600",
        letterSpacing: 0.3,
    },
    FormContent: {
        padding: 20,
        paddingTop: 8,
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