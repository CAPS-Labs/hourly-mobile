import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

import {
  CATEGORIES,
  CATEGORY_MEMBERSHIPS,
  CURRENT_ORGANIZATION,
  CURRENT_USER_ID,
  CURRENT_USER_ROLE,
  MEMBERS,
  ORGANIZATION_TOTAL_HOURS,
  PROJECTS,
  STARTING_PERSONAL_HOURS,
} from "../data/mockData";
import {
  AccessStatus,
  Category,
  CategoryAccess,
  CategoryMembership,
  HourEntry,
  Member,
  Organization,
  OrganizationRole,
  Project,
} from "../types/models";

type SubmitHoursInput = {
  hours: number;
  categoryId: number;
  notes: string;
};

type CategoryInput = {
  name: string;
  description: string;
  access: CategoryAccess;
};

type ProjectInput = {
  categoryId: number;
  title: string;
  when: string;
  where: string;
  spots: number;
};

type AppState = {
  organization: Organization;
  organizationTotalHours: number;
  personalHours: number;
  categories: Category[];
  projects: Project[];
  projectsInCategory: (categoryId: number) => Project[];
  /** Admin action: add an opportunity to a category. */
  createProject: (input: ProjectInput) => void;
  signedUpProjectIds: number[];
  isSignedUp: (projectId: number) => boolean;
  toggleProjectSignUp: (projectId: number) => void;
  /** The current member's memberships, for the access rules in domain/access. */
  categoryMemberships: CategoryMembership[];
  requestCategoryAccess: (categoryId: number) => void;
  /** A member withdrawing their own request before it is decided. */
  cancelCategoryAccessRequest: (categoryId: number) => void;

  // Admin surface. The screens gate these behind isAdmin; they are dumb writers.
  viewerRole: OrganizationRole;
  members: Member[];
  createCategory: (input: CategoryInput) => void;
  updateCategory: (categoryId: number, input: Partial<CategoryInput>) => void;
  /** Everyone's membership in one category, not just the viewer's. */
  membershipsFor: (categoryId: number) => CategoryMembership[];
  /** Approve, deny, add or remove a member. `null` removes the membership. */
  setCategoryMembership: (
    categoryId: number,
    userId: string,
    status: AccessStatus | null
  ) => void;
  submissions: HourEntry[];
  /** Total hours per category, biggest first. Categories with no hours are omitted. */
  hoursByCategory: { category: Category; hours: number }[];
  submitHours: (input: SubmitHoursInput) => void;
};

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [signedUpProjectIds, setSignedUpProjectIds] = useState<number[]>([]);
  const [submissions, setSubmissions] = useState<HourEntry[]>([]);
  const [allCategoryMemberships, setAllCategoryMemberships] =
    useState<CategoryMembership[]>(CATEGORY_MEMBERSHIPS);

  const toggleProjectSignUp = useCallback((projectId: number) => {
    setSignedUpProjectIds((current) =>
      current.includes(projectId)
        ? current.filter((id) => id !== projectId)
        : [...current, projectId]
    );
  }, []);

  const submitHours = useCallback(({ hours, categoryId, notes }: SubmitHoursInput) => {
    setSubmissions((current) => [
      { id: Date.now(), hours, categoryId, notes },
      ...current,
    ]);
  }, []);

  const isSignedUp = useCallback(
    (projectId: number) => signedUpProjectIds.includes(projectId),
    [signedUpProjectIds]
  );

  // A category request only ever moves the viewer from "no membership" (or a
  // previous denial) to "pending"; approving is an admin action for later.
  const requestCategoryAccess = useCallback((categoryId: number) => {
    setAllCategoryMemberships((current) => {
      const existing = current.find(
        (entry) => entry.categoryId === categoryId && entry.userId === CURRENT_USER_ID
      );

      if (existing && existing.status !== "denied") {
        return current;
      }

      const requested: CategoryMembership = {
        categoryId,
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
  const cancelCategoryAccessRequest = useCallback((categoryId: number) => {
    setAllCategoryMemberships((current) =>
      current.filter(
        (entry) =>
          !(
            entry.categoryId === categoryId &&
            entry.userId === CURRENT_USER_ID &&
            entry.status === "pending"
          )
      )
    );
  }, []);

  const categoryMemberships = useMemo(
    () => allCategoryMemberships.filter((entry) => entry.userId === CURRENT_USER_ID),
    [allCategoryMemberships]
  );

  const membershipsFor = useCallback(
    (categoryId: number) =>
      allCategoryMemberships.filter((entry) => entry.categoryId === categoryId),
    [allCategoryMemberships]
  );

  const setCategoryMembership = useCallback(
    (categoryId: number, userId: string, status: AccessStatus | null) => {
      setAllCategoryMemberships((current) => {
        const withoutEntry = current.filter(
          (entry) => !(entry.categoryId === categoryId && entry.userId === userId)
        );

        return status === null
          ? withoutEntry
          : [...withoutEntry, { categoryId, userId, status }];
      });
    },
    []
  );

  const createCategory = useCallback((input: CategoryInput) => {
    setCategories((current) => {
      const nextId = current.reduce((max, category) => Math.max(max, category.id), 0) + 1;
      return [...current, { id: nextId, ...input }];
    });
  }, []);

  const updateCategory = useCallback((categoryId: number, input: Partial<CategoryInput>) => {
    setCategories((current) =>
      current.map((category) =>
        category.id === categoryId ? { ...category, ...input } : category
      )
    );
  }, []);

  const createProject = useCallback((input: ProjectInput) => {
    setProjects((current) => {
      const nextId = current.reduce((max, project) => Math.max(max, project.id), 0) + 1;
      return [...current, { id: nextId, ...input }];
    });
  }, []);

  const projectsInCategory = useCallback(
    (categoryId: number) => projects.filter((project) => project.categoryId === categoryId),
    [projects]
  );

  const personalHours = useMemo(
    () => STARTING_PERSONAL_HOURS + submissions.reduce((sum, entry) => sum + entry.hours, 0),
    [submissions]
  );

  const hoursByCategory = useMemo(
    () =>
      categories
        .map((category) => ({
          category,
          hours: submissions
            .filter((entry) => entry.categoryId === category.id)
            .reduce((sum, entry) => sum + entry.hours, 0),
        }))
        .filter((row) => row.hours > 0)
        .sort((a, b) => b.hours - a.hours),
    [categories, submissions]
  );

  const value: AppState = useMemo(
    () => ({
      organization: CURRENT_ORGANIZATION,
      organizationTotalHours: ORGANIZATION_TOTAL_HOURS,
      personalHours,
      categories,
      projects,
      projectsInCategory,
      createProject,
      signedUpProjectIds,
      isSignedUp,
      toggleProjectSignUp,
      categoryMemberships,
      requestCategoryAccess,
      cancelCategoryAccessRequest,
      viewerRole: CURRENT_USER_ROLE,
      members: MEMBERS,
      createCategory,
      updateCategory,
      membershipsFor,
      setCategoryMembership,
      submissions,
      hoursByCategory,
      submitHours,
    }),
    [
      categories,
      hoursByCategory,
      personalHours,
      signedUpProjectIds,
      isSignedUp,
      projects,
      projectsInCategory,
      createProject,
      toggleProjectSignUp,
      categoryMemberships,
      requestCategoryAccess,
      cancelCategoryAccessRequest,
      createCategory,
      updateCategory,
      membershipsFor,
      setCategoryMembership,
      submissions,
      submitHours,
    ]
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
