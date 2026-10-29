import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  PROJECTS,
  PROJECT_MEMBERSHIPS,
  CURRENT_ORGANIZATION,
  CURRENT_USER_ID,
  CURRENT_USER_ROLE,
  MEMBERS,
  ORGANIZATION_TOTAL_HOURS,
  OPPORTUNITIES,
  STARTING_PERSONAL_HOURS,
} from "../data/mockData";
import {
  AccessStatus,
  Project,
  ProjectAccess,
  ProjectMembership,
  HourEntry,
  Member,
  Organization,
  OrganizationRole,
  Opportunity,
} from "../types/models";

type SubmitHoursInput = {
  hours: number;
  projectId: number;
  notes: string;
};

type ProjectInput = {
  name: string;
  description: string;
  access: ProjectAccess;
};

type OpportunityInput = {
  projectId: number;
  title: string;
  when: string;
  where: string;
  spots: number;
};

type AppState = {
  organization: Organization;
  organizationTotalHours: number;
  personalHours: number;
  projects: Project[];
  opportunities: Opportunity[];
  opportunitiesInProject: (projectId: number) => Opportunity[];
  /** Admin action: add an opportunity to a project. */
  createOpportunity: (input: OpportunityInput) => void;
  signedUpOpportunityIds: number[];
  isSignedUp: (opportunityId: number) => boolean;
  toggleOpportunitySignUp: (opportunityId: number) => void;
  /** The current member's memberships, for the access rules in domain/access. */
  projectMemberships: ProjectMembership[];
  requestProjectAccess: (projectId: number) => void;
  /** A member withdrawing their own request before it is decided. */
  cancelProjectAccessRequest: (projectId: number) => void;

  // Admin surface. The screens gate these behind isAdmin; they are dumb writers.
  viewerRole: OrganizationRole;
  members: Member[];
  createProject: (input: ProjectInput) => void;
  updateProject: (projectId: number, input: Partial<ProjectInput>) => void;
  /** Everyone's membership in one project, not just the viewer's. */
  membershipsFor: (projectId: number) => ProjectMembership[];
  /** Approve, deny, add or remove a member. `null` removes the membership. */
  setProjectMembership: (
    projectId: number,
    userId: string,
    status: AccessStatus | null
  ) => void;
  submissions: HourEntry[];
  /** Total hours per project, biggest first. Projects with no hours are omitted. */
  hoursByProject: { project: Project; hours: number }[];
  submitHours: (input: SubmitHoursInput) => void;
};

const AppStateContext = createContext<AppState | null>(null);

/**
 * Holds the in-memory app state (projects, sign-ups, submitted hours) and hands
 * it to the screens. Everything here is session-local mock data for now.
 */
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(OPPORTUNITIES);
  const [signedUpOpportunityIds, setSignedUpOpportunityIds] = useState<number[]>([]);
  const [submissions, setSubmissions] = useState<HourEntry[]>([]);
  // Submission ids double as list keys, so they must never repeat. Date.now()
  // collides when two submissions land in the same millisecond; a counter does not.
  const nextSubmissionId = useRef(1);

  const toggleOpportunitySignUp = useCallback((opportunityId: number) => {
    setSignedUpOpportunityIds((current) =>
      current.includes(opportunityId)
        ? current.filter((id) => id !== opportunityId)
        : [...current, opportunityId]
    );
  }, []);

  const submitHours = useCallback(({ hours, projectId, notes }: SubmitHoursInput) => {
    setSubmissions((current) => [
      { id: nextSubmissionId.current++, hours, field, notes },
      ...current,
    ]);
  }, []);

  const isSignedUp = useCallback(
    (opportunityId: number) => signedUpOpportunityIds.includes(opportunityId),
    [signedUpOpportunityIds]
  );

  // A project request only ever moves the viewer from "no membership" (or a
  // previous denial) to "pending"; approving is an admin action for later.
  const requestProjectAccess = useCallback((projectId: number) => {
    setAllProjectMemberships((current) => {
      const existing = current.find(
        (entry) => entry.projectId === projectId && entry.userId === CURRENT_USER_ID
      );

      if (existing && existing.status !== "denied") {
        return current;
      }

      const requested: ProjectMembership = {
        projectId,
        userId: CURRENT_USER_ID,
        status: "pending",
      };

      return existing
        ? current.map((entry) => (entry === existing ? requested : entry))
        : [...current, requested];
    });
  }, []);

  // Only a request still waiting can be recalled. An approval or a denial is a
  // decision someone already made, so this never clears one by accident.
  const cancelProjectAccessRequest = useCallback((projectId: number) => {
    setAllProjectMemberships((current) =>
      current.filter(
        (entry) =>
          !(
            entry.projectId === projectId &&
            entry.userId === CURRENT_USER_ID &&
            entry.status === "pending"
          )
      )
    );
  }, []);

  const projectMemberships = useMemo(
    () => allProjectMemberships.filter((entry) => entry.userId === CURRENT_USER_ID),
    [allProjectMemberships]
  );

  const membershipsFor = useCallback(
    (projectId: number) =>
      allProjectMemberships.filter((entry) => entry.projectId === projectId),
    [allProjectMemberships]
  );

  const setProjectMembership = useCallback(
    (projectId: number, userId: string, status: AccessStatus | null) => {
      setAllProjectMemberships((current) => {
        const withoutEntry = current.filter(
          (entry) => !(entry.projectId === projectId && entry.userId === userId)
        );

        return status === null
          ? withoutEntry
          : [...withoutEntry, { projectId, userId, status }];
      });
    },
    []
  );

  const createProject = useCallback((input: ProjectInput) => {
    setProjects((current) => {
      const nextId = current.reduce((max, project) => Math.max(max, project.id), 0) + 1;
      return [...current, { id: nextId, ...input }];
    });
  }, []);

  const updateProject = useCallback((projectId: number, input: Partial<ProjectInput>) => {
    setProjects((current) =>
      current.map((project) =>
        project.id === projectId ? { ...project, ...input } : project
      )
    );
  }, []);

  const createOpportunity = useCallback((input: OpportunityInput) => {
    setOpportunities((current) => {
      const nextId = current.reduce((max, opportunity) => Math.max(max, opportunity.id), 0) + 1;
      return [...current, { id: nextId, ...input }];
    });
  }, []);

  const opportunitiesInProject = useCallback(
    (projectId: number) => opportunities.filter((opportunity) => opportunity.projectId === projectId),
    [opportunities]
  );

  const personalHours = useMemo(
    () => STARTING_PERSONAL_HOURS + submissions.reduce((sum, entry) => sum + entry.hours, 0),
    [submissions]
  );

  const hoursByProject = useMemo(
    () =>
      projects
        .map((project) => ({
          project,
          hours: submissions
            .filter((entry) => entry.projectId === project.id)
            .reduce((sum, entry) => sum + entry.hours, 0),
        }))
        .filter((row) => row.hours > 0)
        .sort((a, b) => b.hours - a.hours),
    [projects, submissions]
  );

  const value: AppState = useMemo(
    () => ({
      organization: CURRENT_ORGANIZATION,
      organizationTotalHours: ORGANIZATION_TOTAL_HOURS,
      personalHours,
      projects,
      opportunities,
      opportunitiesInProject,
      createOpportunity,
      signedUpOpportunityIds,
      isSignedUp,
      toggleOpportunitySignUp,
      projectMemberships,
      requestProjectAccess,
      cancelProjectAccessRequest,
      viewerRole: CURRENT_USER_ROLE,
      members: MEMBERS,
      createProject,
      updateProject,
      membershipsFor,
      setProjectMembership,
      submissions,
      hoursByProject,
      submitHours,
    }),
    [
      projects,
      hoursByProject,
      personalHours,
      signedUpOpportunityIds,
      isSignedUp,
      opportunities,
      opportunitiesInProject,
      createOpportunity,
      toggleOpportunitySignUp,
      projectMemberships,
      requestProjectAccess,
      cancelProjectAccessRequest,
      createProject,
      updateProject,
      membershipsFor,
      setProjectMembership,
      submissions,
      submitHours,
    ]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

/**
 * Reads the app state from context. Throws when rendered outside
 * `AppStateProvider` so a missing provider fails loudly instead of silently
 * rendering empty screens.
 */
export function useAppState() {
  const state = useContext(AppStateContext);

  if (!state) {
    throw new Error("useAppState must be used inside an AppStateProvider.");
  }

  return state;
}
