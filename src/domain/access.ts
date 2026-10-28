import {
  AccessStatus,
  Category,
  CategoryAccess,
  CategoryMembership,
  OrganizationRole,
} from "../types/models";

/**
 * The rules that decide what a member can see and do inside project categories.
 *
 * These are pure functions on purpose: every screen reads visibility through
 * them instead of checking `category.access` itself, so the app cannot disagree
 * with itself about who sees what. When a backend arrives, this file is the
 * contract it has to enforce server-side — hiding UI is not a permission.
 *
 * `memberships` is expected to be the current viewer's memberships only.
 */

export function isAdmin(role: OrganizationRole): boolean {
  return role === "admin";
}

/** How each mode is described in the UI. */
export function accessLabel(access: CategoryAccess): string {
  if (access === "open") {
    return "Everyone";
  }

  return access === "request" ? "Requests" : "Invite only";
}

/** The viewer's standing in a category, or null if they have no membership. */
export function statusInCategory(
  categoryId: number,
  memberships: CategoryMembership[]
): AccessStatus | null {
  const membership = memberships.find((entry) => entry.categoryId === categoryId);
  return membership ? membership.status : null;
}

/**
 * Open and request categories are always listed so members can discover them.
 * Invite-only categories stay invisible until the member is approved.
 * Admins see every category, since they are the ones managing them.
 */
export function canViewCategory(
  category: Category,
  memberships: CategoryMembership[],
  role: OrganizationRole
): boolean {
  if (isAdmin(role)) {
    return true;
  }

  if (category.access !== "invite") {
    return true;
  }

  return statusInCategory(category.id, memberships) === "approved";
}

/** Open categories need nothing; restricted ones need an approval. */
export function canSignUpInCategory(
  category: Category,
  memberships: CategoryMembership[],
  role: OrganizationRole
): boolean {
  if (isAdmin(role) || category.access === "open") {
    return true;
  }

  return statusInCategory(category.id, memberships) === "approved";
}

/**
 * Only request categories offer a way in, and only while the member has no
 * membership (or was denied and may ask again). Invite-only cannot be requested,
 * and admins already have access so they never need to ask.
 */
export function canRequestAccess(
  category: Category,
  memberships: CategoryMembership[],
  role: OrganizationRole
): boolean {
  if (category.access !== "request" || isAdmin(role)) {
    return false;
  }

  const status = statusInCategory(category.id, memberships);
  return status === null || status === "denied";
}

/**
 * Whether this member actually serves in a category: open ones are open to all,
 * restricted ones require an approval. Deliberately ignores the admin role —
 * being an admin does not mean you served in that club's shifts.
 */
export function isMemberOfCategory(
  category: Category,
  memberships: CategoryMembership[]
): boolean {
  if (category.access === "open") {
    return true;
  }

  return statusInCategory(category.id, memberships) === "approved";
}

/** Categories this member can log hours against, in their original order. */
export function memberCategories(
  categories: Category[],
  memberships: CategoryMembership[]
): Category[] {
  return categories.filter((category) => isMemberOfCategory(category, memberships));
}

/**
 * Categories the viewer can actually use right now: the ones they can sign up
 * in. For a member that is open categories plus restricted ones they were
 * approved for, so a request still waiting on an admin is *not* here — it shows
 * on the join screen instead. Admins can sign up in everything.
 */
export function joinedCategories(
  categories: Category[],
  memberships: CategoryMembership[],
  role: OrganizationRole
): Category[] {
  return categories.filter((category) => canSignUpInCategory(category, memberships, role));
}

/**
 * Categories a member can ask to join, including requests already pending so the
 * join screen can show their state. Invite-only categories are never here: those
 * are granted by an admin, so advertising them would leak a list they chose to
 * keep closed.
 */
export function joinableCategories(
  categories: Category[],
  memberships: CategoryMembership[],
  role: OrganizationRole
): Category[] {
  if (isAdmin(role)) {
    return [];
  }

  return categories.filter((category) => {
    if (category.access !== "request") {
      return false;
    }

    return statusInCategory(category.id, memberships) !== "approved";
  });
}

/** Categories the viewer is allowed to see, in their original order. */
export function visibleCategories(
  categories: Category[],
  memberships: CategoryMembership[],
  role: OrganizationRole
): Category[] {
  return categories.filter((category) => canViewCategory(category, memberships, role));
}
