/*
 * Part of the Saypi-Blog project.
 *
 * Copyright (c) 2026 Saypi Studio
 * Licensed under the Saypi-Blog Source Available License 1.0 (SSAL-1.0).
 *
 * See the LICENSE file in the project root for license information.
 */
 
import { db } from '$lib/server/db/db';
import { users } from '$lib/server/db/schema/users';
import { userProfiles } from '$lib/server/db/schema/userProfiles';
import { userInfoPrivacy } from '$lib/server/db/schema/userInfoPrivacy';
import { getCampusCode } from '$lib/utils/campus';

export const createDatabaseUser = async (userId: string, user: any, handle: string) => {
  await db.transaction(async (tx) => {
      const inserted = await tx.insert(users).values({
          id: userId,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          profileHandle: handle,
          gradeLevel: Number(user.gradeLevel),
          campus: getCampusCode(user.campus)
      }).onConflictDoNothing({ target: users.id }).returning({ id: users.id });
  
      // If user already exists, do nothing
      if (inserted.length === 0) return;
  
      await tx.insert(userProfiles).values({ userId }).onConflictDoNothing();
      await tx.insert(userInfoPrivacy).values({ userId }).onConflictDoNothing();
  });
};

export async function getAvailableHandle(baseHandle: string): Promise<string> {
  let handle = baseHandle;
  let suffix = 1;

  while (
    await db.query.users.findFirst({
      columns: { id: true },
      where: (u, { eq }) => eq(u.profileHandle, handle)
    })
  ) {
    suffix++;
    handle = `${baseHandle}${suffix}`;
  }

  return handle;
}
