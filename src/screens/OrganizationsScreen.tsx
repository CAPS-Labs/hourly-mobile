import React, { useState } from "react";
import { View, Text, Button, TextInput, ScrollView } from "react-native";

export default function OrganizationsScreen() {
  // STATE (top of component)
  const [mode, setMode] = useState("list");

  // MOCK DATA
  const organizations = [
    { id: 1, name: "Helping Hands" },
    { id: 2, name: "Food Bank" },
  ];

    return (
        
        <View style={{ flex: 1, padding: 16 }}>

            {/* TOP BUTTONS */}
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Button title="Create" onPress={() => setMode("create")} />
                <Button title="Join" onPress={() => setMode("join")} />
            </View>

            // CONDITIONAL RENDERING

            {mode === "list" && (
                <ScrollView>
                {organizations.map((org) => (
                    <View key={org.id} style={{ padding: 12, marginVertical: 8, backgroundColor: "#eee" }}>
                        <Text>{org.name}</Text>
                    </View>
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