/*
 * Part of the Saypi-Blog project.
 *
 * Copyright (c) 2026 Saypi Studio
 * Licensed under the Saypi-Blog Source Available License 1.0 (SSAL-1.0).
 *
 * See the LICENSE file in the project root for license information.
 */

export function getProfileHandle(firstName: string, lastName: string): string {
  const clean = (str: string) =>
    str
      .trim()
      .normalize("NFD") // Breaks accents into separate pieces
      .replace(/[\u0300-\u036f]/g, "") // Removes the accent pieces
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "") // Your original regex
      .trim();     

  const first = clean(firstName).replace(/\s+/g, "");
  const last = clean(lastName).replace(/\s+/g, "");
  const combined = `${first}${last}`;

  if (!combined) {
    throw new Error("Cannot generate profile handle: first and last name invalid.");
  }

  if (combined.length < 2) {
    throw new Error("Profile handle too short.");
  }

  return `@${combined}`;
}