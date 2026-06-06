export type OrganizationRole = "member" | "admin";

export type OrganizationMembership = {
  organizationId: string;
  userId: string;
  role: OrganizationRole;
  personalHours: number;
};

export type Organization = {
  id: string;
  name: string;
  slogan?: string;
  logoUrl?: string;
  totalHours: number;
  memberCount: number;
  yearlyQuota?: number;
};