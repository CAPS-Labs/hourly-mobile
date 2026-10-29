import { Organization, Project } from "../types/models";

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

export const SERVICE_FIELDS = [
  "Coffee Bar",
  "Concessions",
  "Year Book",
  "Newspaper",
  "Event Services",
  "Hourly Development",
];

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Concession Stand",
    when: "Fri, Oct 30 · 5:00 – 9:00 PM",
    where: "Home Stadium · Concession A",
    spots: 4,
  },
  {
    id: 2,
    title: "Coffee Bar",
    when: "Sat, Oct 31 · 7:00 – 10:00 AM",
    where: "Community Center Lobby",
    spots: 2,
  },
  {
    id: 3,
    title: "Park Cleanup",
    when: "Sun, Nov 1 · 9:00 AM – 12:00 PM",
    where: "Riverside Park · North Entrance",
    spots: 8,
  },
  {
    id: 4,
    title: "Event Setup & Teardown",
    when: "Wed, Nov 4 · 3:30 – 7:30 PM",
    where: "Gymnasium",
    spots: 3,
  },
  {
    id: 5,
    title: "Yearbook Photos",
    when: "Thu, Nov 5 · 4:00 – 6:00 PM",
    where: "Media Room",
    spots: 1,
  },
];
