// src/lib/utils/profile.ts

// Helper function to get profile handle
export function getProfileHandle(firstName: string, lastName: string): string {
  const clean = (str: string) =>
    str
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "");

  const first = clean(firstName);
  const last = clean(lastName);

  const combined = `${first}${last}`;

  if (!combined) {
    throw new Error("Cannot generate profile handle: first and last name invalid.");
  }

  // Optional: avoid handles that are too short (e.g., "@a")
  if (combined.length < 2) {
    throw new Error("Profile handle too short.");
  }

  return `@${combined}`;
}