import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";

import HomeScreen from "../screens/HomeScreen";
import OrganizationsScreen from "../screens/OrganizationsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { Colors } from "../constants/colors";

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <NavigationContainer>
      <View style={{ flex: 1, backgroundColor: Colors.background }}>
        <Tab.Navigator
          screenOptions={{

            // Bottom Tab Bar
            tabBarStyle: {
              backgroundColor: Colors.background,
              borderTopWidth: 0,
            },
            tabBarActiveTintColor: "#ffffff",
            tabBarInactiveTintColor: "#686868",

            // Header
            headerShown: false
            
          }}
        >

          <Tab.Screen
            name="Organizations"
            component={OrganizationsScreen}
          />

          <Tab.Screen
            name="Home"
            component={HomeScreen}
          />

          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
          />

        </Tab.Navigator>
      </View>
    </NavigationContainer>
  );
}