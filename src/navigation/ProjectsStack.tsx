import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Colors } from "../constants/colors";
import ProjectDetailScreen from "../screens/ProjectDetailScreen";
import ProjectEditorScreen from "../screens/ProjectEditorScreen";
import ProjectMembersScreen from "../screens/ProjectMembersScreen";
import JoinProjectsScreen from "../screens/JoinProjectsScreen";
import OpportunityEditorScreen from "../screens/OpportunityEditorScreen";
import RequestsScreen from "../screens/RequestsScreen";
import ProjectsScreen from "../screens/ProjectsScreen";

/** Screens reachable from the Projects tab. */
export type ProjectsStackParamList = {
  ProjectsHome: undefined;
  ProjectDetail: { projectId: number };
  /** Omit `projectId` to create a new project. */
  ProjectEditor: { projectId?: number };
  /** Who is waiting on, and already in, one project. */
  ProjectMembers: { projectId: number };
  /** Every pending request across all projects. */
  Requests: undefined;
  /** Add an opportunity to an existing project. */
  OpportunityEditor: { projectId: number };
  /** Projects a member can ask to join. */
  JoinProjects: undefined;
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
      <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} />
      <Stack.Screen name="ProjectEditor" component={ProjectEditorScreen} />
      <Stack.Screen name="ProjectMembers" component={ProjectMembersScreen} />
      <Stack.Screen name="Requests" component={RequestsScreen} />
      <Stack.Screen name="OpportunityEditor" component={OpportunityEditorScreen} />
      <Stack.Screen name="JoinProjects" component={JoinProjectsScreen} />
    </Stack.Navigator>
  );
}
