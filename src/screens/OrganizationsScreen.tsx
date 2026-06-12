import React, { useState } from "react";
import { View, Text, Button, TextInput, ScrollView, TouchableOpacity, StyleSheet, Modal, Pressable } from "react-native";

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
                    <View style={{ flexDirection: "row", justifyContent: "space-between"}}>
                        <Button title="Create" onPress={() => setMode("create")} />
                        <Button title="Join" onPress={() => setMode("join")} />
                    </View>
                </ScrollView>
            )}
            
            {/* MODAL */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
            >
                <View
                    style={{
                    flex: 1,
                    backgroundColor: "rgba(0,0,0,0.6)",
                    justifyContent: "flex-end",
                    }}
                >
                    <View
                    style={{
                        backgroundColor: "#1F1F1F",
                        padding: 20,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        minHeight: "60%",
                    }}
                    >
                    {/* CLOSE BUTTON */}
                    <Pressable onPress={() => setModalVisible(false)}>
                        <Text style={{ color: "#888", marginBottom: 10 }}>Close</Text>
                    </Pressable>

                    {/* CONTENT */}
                    {selectedOrg && (
                        <>
                        <Text style={{ color: "white", fontSize: 22, fontWeight: "600" }}>
                            {selectedOrg.name}
                        </Text>

                        <Text style={{ color: "#aaa", marginTop: 6 }}>
                            {selectedOrg.slogan}
                        </Text>

                        <View style={{ marginTop: 20 }}>
                            <Text style={{ color: "white" }}>Your Hours: 42</Text>
                            <Text style={{ color: "white", marginTop: 8 }}>Organization Total: 1240</Text>
                        </View>

                        <View style={{ marginTop: 30 }}>
                            <Pressable
                                style={{
                                    backgroundColor: "#4A90E2",
                                    padding: 12,
                                    borderRadius: 10,
                                    marginBottom: 10,
                                }}
                                onPress={() => {
                                     setModalVisible(false);
                                    setModalHours(true);
                                }}
                            >
                                <Text style={{ color: "white", textAlign: "center" }}>Submit Hours</Text>
                            </Pressable>

                            <Pressable
                                style={{
                                    backgroundColor: "#333",
                                    padding: 12,
                                    borderRadius: 10,
                                }}
                            >
                                <Text style={{ color: "white", textAlign: "center" }}>View Projects</Text>
                            </Pressable>
                        </View>
                        </>
                    )}
                    </View>
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
                <View>
                <Text>Create Organization</Text>
                <TextInput placeholder="Name" />
                <TextInput placeholder="Slogan" />
                <Button title="Submit" onPress={() => setMode("list")} />
                </View>
            )}

            {mode === "join" && (
                <View>
                <Text>Join Organization</Text>
                <TextInput placeholder="Enter code" />
                <Button title="Join" onPress={() => setMode("list")} />
                </View>
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
    } 
});