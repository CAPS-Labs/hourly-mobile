import React, { useState } from "react";
import { View, Text, Button, TextInput, ScrollView, TouchableOpacity, StyleSheet, Modal, Pressable } from "react-native";

import Card from "../components/Card"
import { Colors } from "../constants/colors";
import { Organization } from "../types/models";

export default function OrganizationsScreen() {
  // STATE
  const [mode, setMode] = useState("list");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

  // MOCK DATA
  const organizations = [
    { id: 1, name: "Helping Hands", slogan: "Lending a hand to those in need" },
    { id: 2, name: "Food Bank", slogan: "Providing meals to those in need" },
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
                        <Text style={{ color: "#888", marginBottom: 10 }}>
                        Close
                        </Text>
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
                            >
                            <Text style={{ color: "white", textAlign: "center" }}>
                                Submit Hours
                            </Text>
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

            {mode === "detail" && (
                <View>
                <Text>Organization Detail View</Text>
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