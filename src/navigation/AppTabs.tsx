import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";

import HomeScreen from "../screens/HomeScreen";
import MyServiceScreen from "../screens/MyServiceScreen";
import ProjectsStack from "./ProjectsStack";
import { Colors } from "../constants/colors";

const Tab = createBottomTabNavigator();

/**
 * Bottom-tab shell of the signed-in app: My Service, Home, and Projects.
 */
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
            name="MyService"
            component={MyServiceScreen}
            options={{ tabBarLabel: "My Service" }}
          />

          <Tab.Screen
            name="Home"
            component={HomeScreen}
          />

          <Tab.Screen
            name="Projects"
            component={ProjectsStack}
          />

        </Tab.Navigator>
      </View>
    </NavigationContainer>
  );
}