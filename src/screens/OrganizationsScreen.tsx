import React, { useState } from "react";
import { View, Text, Button, TextInput, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import Card from "../components/Card"
import { COLORS } from "../constants/colors";

export default function OrganizationsScreen() {
  // STATE (top of component)
  const [mode, setMode] = useState("list");

  // MOCK DATA
  const organizations = [
    { id: 1, name: "Helping Hands" },
    { id: 2, name: "Food Bank" },
  ];

    return (
        
        <View style={styles.Screen}>

            {/* TOP BUTTONS */}
            <View style={{ flexDirection: "row", justifyContent: "space-between"}}>
                <Button title="Create" onPress={() => setMode("create")} />
                <Button title="Join" onPress={() => setMode("join")} />
            </View>

            // CONDITIONAL RENDERING

            {mode === "list" && (
                <ScrollView>
                    {organizations.map((org) => (
                        <TouchableOpacity
                            key={org.id}
                            activeOpacity={0.8}
                            onPress={() => {
                            console.log("Clicked:", org.name);
                            }}
                            >
                            <Card>
                            <Text>{org.name}</Text>
                            </Card>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}

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
        backgroundColor: "rgb(22, 22, 22)",
    } 
});