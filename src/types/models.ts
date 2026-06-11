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