export type OrganizationRole = "member" | "admin";

export type OrganizationMembership = {
  organizationId: string;
  userId: string;
  role: OrganizationRole;
  personalHours: number;
};

export type Organization = {
  id: number;
  name: string;
  slogan: string;
};

/**
 * Who can see a project and sign up for what is inside it.
 * - "open":    every member can see it and sign up.
 * - "request": every member can see it, but must be approved to sign up.
 * - "invite":  only approved members can see it at all.
 */
export type ProjectAccess = "open" | "request" | "invite";

export type AccessStatus = "pending" | "approved" | "denied";

export type Project = {
  id: number;
  name: string;
  description: string;
  access: ProjectAccess;
};

/** A member's standing inside one project. */
export type ProjectMembership = {
  projectId: number;
  userId: string;
  status: AccessStatus;
};

/** Someone who belongs to the organization. */
export type Member = {
  id: string;
  name: string;
};

export type Opportunity = {
  id: number;
  projectId: number;
  title: string;
  when: string;
  where: string;
  spots: number;
};

export type HourEntry = {
  id: number;
  hours: number;
  /** The project the hours were served in. */
  projectId: number;
  notes: string;
};
