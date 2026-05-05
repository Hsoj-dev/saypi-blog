// src/lib/utils/profile.ts

export function getFirstName(name: string): string {
  return name.trim().split(' ')[0] || "";
}

// Helper function to get profile handle
export function getProfileHandle(firstName: string, lastName: string): string {
  const clean = (str: string) =>
    str
      .trim()
      .normalize("NFD")               // Breaks accents into separate pieces
      .replace(/[\u0300-\u036f]/g, "") // Removes the accent pieces
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "");     // Your original regex

  const fixedFirstName = getFirstName(firstName);
  const first = clean(fixedFirstName);
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