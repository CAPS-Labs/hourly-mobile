import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

import {
  CURRENT_ORGANIZATION,
  ORGANIZATION_TOTAL_HOURS,
  PROJECTS,
  SERVICE_FIELDS,
  STARTING_PERSONAL_HOURS,
} from "../data/mockData";
import { HourEntry, Organization, Project } from "../types/models";

type SubmitHoursInput = {
  hours: number;
  field: string;
  notes: string;
};

type AppState = {
  organization: Organization;
  organizationTotalHours: number;
  personalHours: number;
  serviceFields: string[];
  projects: Project[];
  signedUpProjectIds: number[];
  isSignedUp: (projectId: number) => boolean;
  toggleProjectSignUp: (projectId: number) => void;
  submissions: HourEntry[];
  submitHours: (input: SubmitHoursInput) => void;
};

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [signedUpProjectIds, setSignedUpProjectIds] = useState<number[]>([]);
  const [submissions, setSubmissions] = useState<HourEntry[]>([]);

  const toggleProjectSignUp = useCallback((projectId: number) => {
    setSignedUpProjectIds((current) =>
      current.includes(projectId)
        ? current.filter((id) => id !== projectId)
        : [...current, projectId]
    );
  }, []);

  const submitHours = useCallback(({ hours, field, notes }: SubmitHoursInput) => {
    setSubmissions((current) => [
      { id: Date.now(), hours, field, notes },
      ...current,
    ]);
  }, []);

  const isSignedUp = useCallback(
    (projectId: number) => signedUpProjectIds.includes(projectId),
    [signedUpProjectIds]
  );

  const personalHours = useMemo(
    () => STARTING_PERSONAL_HOURS + submissions.reduce((sum, entry) => sum + entry.hours, 0),
    [submissions]
  );

  const value: AppState = useMemo(
    () => ({
      organization: CURRENT_ORGANIZATION,
      organizationTotalHours: ORGANIZATION_TOTAL_HOURS,
      personalHours,
      serviceFields: SERVICE_FIELDS,
      projects: PROJECTS,
      signedUpProjectIds,
      isSignedUp,
      toggleProjectSignUp,
      submissions,
      submitHours,
    }),
    [personalHours, signedUpProjectIds, isSignedUp, toggleProjectSignUp, submissions, submitHours]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const state = useContext(AppStateContext);

  if (!state) {
    throw new Error("useAppState must be used inside an AppStateProvider.");
  }

  return state;
}
