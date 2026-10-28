import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Colors } from "../constants/colors";
import CategoryDetailScreen from "../screens/CategoryDetailScreen";
import CategoryEditorScreen from "../screens/CategoryEditorScreen";
import CategoryMembersScreen from "../screens/CategoryMembersScreen";
import JoinCategoriesScreen from "../screens/JoinCategoriesScreen";
import OpportunityEditorScreen from "../screens/OpportunityEditorScreen";
import RequestsScreen from "../screens/RequestsScreen";
import ProjectsScreen from "../screens/ProjectsScreen";

/** Screens reachable from the Projects tab. */
export type ProjectsStackParamList = {
  ProjectsHome: undefined;
  CategoryDetail: { categoryId: number };
  /** Omit `categoryId` to create a new category. */
  CategoryEditor: { categoryId?: number };
  /** Who is waiting on, and already in, one category. */
  CategoryMembers: { categoryId: number };
  /** Every pending request across all categories. */
  Requests: undefined;
  /** Add an opportunity to an existing category. */
  OpportunityEditor: { categoryId: number };
  /** Categories a member can ask to join. */
  JoinCategories: undefined;
};

const Stack = createNativeStackNavigator<ProjectsStackParamList>();

export default function ProjectsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="ProjectsHome" component={ProjectsScreen} />
      <Stack.Screen name="CategoryDetail" component={CategoryDetailScreen} />
      <Stack.Screen name="CategoryEditor" component={CategoryEditorScreen} />
      <Stack.Screen name="CategoryMembers" component={CategoryMembersScreen} />
      <Stack.Screen name="Requests" component={RequestsScreen} />
      <Stack.Screen name="OpportunityEditor" component={OpportunityEditorScreen} />
      <Stack.Screen name="JoinCategories" component={JoinCategoriesScreen} />
    </Stack.Navigator>
  );
}
