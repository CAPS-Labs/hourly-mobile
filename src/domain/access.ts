import {
  AccessStatus,
  Project,
  ProjectAccess,
  ProjectMembership,
  OrganizationRole,
} from "../types/models";

/**
 * The rules that decide what a member can see and do inside a project.
 *
 * These are pure functions on purpose: every screen reads visibility through
 * them instead of checking `project.access` itself, so the app cannot disagree
 * with itself about who sees what. When a backend arrives, this file is the
 * contract it has to enforce server-side — hiding UI is not a permission.
 *
 * `memberships` is expected to be the current viewer's memberships only.
 */

export function isAdmin(role: OrganizationRole): boolean {
  return role === "admin";
}

/** How each mode is described in the UI. */
export function accessLabel(access: ProjectAccess): string {
  if (access === "open") {
    return "Everyone";
  }

  return access === "request" ? "Requests" : "Invite only";
}

/** The viewer's standing in a project, or null if they have no membership. */
export function statusInProject(
  projectId: number,
  memberships: ProjectMembership[]
): AccessStatus | null {
  const membership = memberships.find((entry) => entry.projectId === projectId);
  return membership ? membership.status : null;
}

/**
 * Open and request projects are always listed so members can discover them.
 * Invite-only projects stay invisible until the member is approved.
 * Admins see every project, since they are the ones managing them.
 */
export function canViewProject(
  project: Project,
  memberships: ProjectMembership[],
  role: OrganizationRole
): boolean {
  if (isAdmin(role)) {
    return true;
  }

  if (project.access !== "invite") {
    return true;
  }

  return statusInProject(project.id, memberships) === "approved";
}

/** Open projects need nothing; restricted ones need an approval. */
export function canSignUpInProject(
  project: Project,
  memberships: ProjectMembership[],
  role: OrganizationRole
): boolean {
  if (isAdmin(role) || project.access === "open") {
    return true;
  }

  return statusInProject(project.id, memberships) === "approved";
}

/**
 * Only request projects offer a way in, and only while the member has no
 * membership (or was denied and may ask again). Invite-only cannot be requested,
 * and admins already have access so they never need to ask.
 */
export function canRequestAccess(
  project: Project,
  memberships: ProjectMembership[],
  role: OrganizationRole
): boolean {
  if (project.access !== "request" || isAdmin(role)) {
    return false;
  }

  const status = statusInProject(project.id, memberships);
  return status === null || status === "denied";
}

/**
 * Whether this member actually serves in a project: open ones are open to all,
 * restricted ones require an approval. Deliberately ignores the admin role —
 * being an admin does not mean you served that project's shifts.
 */
export function isMemberOfProject(
  project: Project,
  memberships: ProjectMembership[]
): boolean {
  if (project.access === "open") {
    return true;
  }

  return statusInProject(project.id, memberships) === "approved";
}

/** Projects this member can log hours against, in their original order. */
export function memberProjects(
  projects: Project[],
  memberships: ProjectMembership[]
): Project[] {
  return projects.filter((project) => isMemberOfProject(project, memberships));
}

/**
 * Projects the viewer can actually use right now: the ones they can sign up
 * in. For a member that is open projects plus restricted ones they were
 * approved for, so a request still waiting on an admin is *not* here — it shows
 * on the join screen instead. Admins can sign up in everything.
 */
export function joinedProjects(
  projects: Project[],
  memberships: ProjectMembership[],
  role: OrganizationRole
): Project[] {
  return projects.filter((project) => canSignUpInProject(project, memberships, role));
}

/**
 * Projects a member can ask to join, including requests already pending so the
 * join screen can show their state. Invite-only projects are never here: those
 * are granted by an admin, so advertising them would leak a list they chose to
 * keep closed.
 */
export function joinableProjects(
  projects: Project[],
  memberships: ProjectMembership[],
  role: OrganizationRole
): Project[] {
  if (isAdmin(role)) {
    return [];
  }

  return projects.filter((project) => {
    if (project.access !== "request") {
      return false;
    }

    return statusInProject(project.id, memberships) !== "approved";
  });
}

/** Projects the viewer is allowed to see, in their original order. */
export function visibleProjects(
  projects: Project[],
  memberships: ProjectMembership[],
  role: OrganizationRole
): Project[] {
  return projects.filter((project) => canViewProject(project, memberships, role));
}
