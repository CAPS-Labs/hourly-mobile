import {
  Category,
  CategoryMembership,
  Member,
  Organization,
  OrganizationRole,
  Project,
} from "../types/models";

// The organization the whole app is oriented around.
export const CURRENT_ORGANIZATION: Organization = {
  id: 1,
  name: "The Oaks Ambassadors",
  slogan: "Lending a hand to those in need since 2025.",
};

// Organizations a new member can register with before they have joined one.
export const ORGANIZATIONS: Organization[] = [
  CURRENT_ORGANIZATION,
  {
    id: 2,
    name: "Food Bank",
    slogan: "Providing meals to those in need.",
  },
];

export const ORGANIZATION_TOTAL_HOURS = 1240;

// Hours already on the member's record before this session.
export const STARTING_PERSONAL_HOURS = 42;

// Groupings of service opportunities. Members open a category to see the
// opportunities inside it.
export const CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Coffee Bar",
    description: "Morning coffee and pastry service at community events.",
    access: "open",
  },
  {
    id: 2,
    name: "Concessions",
    description: "Run the concession stand during home games.",
    access: "open",
  },
  {
    id: 3,
    name: "Sports Events",
    description: "Set up, staff, and tear down athletic events.",
    access: "request",
  },
  {
    id: 4,
    name: "Community Service",
    description: "Cleanups and outreach projects around town.",
    access: "request",
  },
  {
    id: 5,
    name: "Publications",
    description: "Yearbook and newspaper photo and production work.",
    access: "invite",
  },
];

export const PROJECTS: Project[] = [
  {
    id: 1,
    categoryId: 2,
    title: "Concession Stand",
    when: "Fri, Oct 30 · 5:00 – 9:00 PM",
    where: "Home Stadium · Concession A",
    spots: 4,
  },
  {
    id: 2,
    categoryId: 1,
    title: "Coffee Bar",
    when: "Sat, Oct 31 · 7:00 – 10:00 AM",
    where: "Community Center Lobby",
    spots: 2,
  },
  {
    id: 3,
    categoryId: 4,
    title: "Park Cleanup",
    when: "Sun, Nov 1 · 9:00 AM – 12:00 PM",
    where: "Riverside Park · North Entrance",
    spots: 8,
  },
  {
    id: 4,
    categoryId: 3,
    title: "Event Setup & Teardown",
    when: "Wed, Nov 4 · 3:30 – 7:30 PM",
    where: "Gymnasium",
    spots: 3,
  },
  {
    id: 5,
    categoryId: 5,
    title: "Yearbook Photos",
    when: "Thu, Nov 5 · 4:00 – 6:00 PM",
    where: "Media Room",
    spots: 1,
  },
  {
    id: 6,
    categoryId: 1,
    title: "Coffee Bar · Weekend Shift",
    when: "Sat, Nov 7 · 7:00 – 10:00 AM",
    where: "Community Center Lobby",
    spots: 3,
  },
  {
    id: 7,
    categoryId: 3,
    title: "Basketball Game Staffing",
    when: "Tue, Nov 10 · 5:30 – 8:30 PM",
    where: "Main Gym · East Doors",
    spots: 5,
  },
];

// The signed-in member. Category memberships are keyed by this id.
export const CURRENT_USER_ID = "member-1";

// Stand-in for real auth. Flip this to "member" to preview the app as a regular
// member: the new/edit category entry points disappear, and invite-only
// categories the viewer is not approved for are hidden again.
export const CURRENT_USER_ROLE: OrganizationRole = "admin";

export const MEMBERS: Member[] = [
  { id: CURRENT_USER_ID, name: "Peter Schmidt" },
  { id: "member-2", name: "Cade Palmer" },
  { id: "member-3", name: "Colin Alvis" },
  { id: "member-4", name: "Justice Pepper" },
];

// Seed state. For the current member: Coffee Bar and Concessions are open and
// need no membership, Community Service has approved them, Sports Events has
// not (so they can request access), and Publications is invite-only with no
// invitation, which hides it from them entirely.
//
// The other members exist so an admin has something to act on: Jordan and Alex
// are waiting on Sports Events, and Priya is already in Publications.
export const CATEGORY_MEMBERSHIPS: CategoryMembership[] = [
  { categoryId: 4, userId: CURRENT_USER_ID, status: "approved" },
  { categoryId: 3, userId: "member-2", status: "pending" },
  { categoryId: 3, userId: "member-4", status: "pending" },
  { categoryId: 5, userId: "member-3", status: "approved" },
];
