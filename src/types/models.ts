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
 * Who can see a category and sign up for what is inside it.
 * - "open":    every member can see it and sign up.
 * - "request": every member can see it, but must be approved to sign up.
 * - "invite":  only approved members can see it at all.
 */
export type CategoryAccess = "open" | "request" | "invite";

export type AccessStatus = "pending" | "approved" | "denied";

export type Category = {
  id: number;
  name: string;
  description: string;
  access: CategoryAccess;
};

/** A member's standing inside one category. */
export type CategoryMembership = {
  categoryId: number;
  userId: string;
  status: AccessStatus;
};

/** Someone who belongs to the organization. */
export type Member = {
  id: string;
  name: string;
};

export type Project = {
  id: number;
  categoryId: number;
  title: string;
  when: string;
  where: string;
  spots: number;
};

export type HourEntry = {
  id: number;
  hours: number;
  /** The category (club) the hours were served in. */
  categoryId: number;
  notes: string;
};
