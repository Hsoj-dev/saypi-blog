/*
 * Part of the Saypi-Blog project.
 *
 * Copyright (c) 2026 Saypi Studio
 * Licensed under the Saypi-Blog Source Available License 1.0 (SSAL-1.0).
 *
 * See the LICENSE file in the project root for license information.
 */

import { db } from '$lib/server/db/db';
import { sql } from 'drizzle-orm';
import { loginAttempts } from '$lib/server/db/schema/loginAttempts';

export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<boolean> {
  const windowExpired = sql`${loginAttempts.windowStart} < now() - (${windowSeconds} || ' seconds')::interval`;

  const [row] = await db
    .insert(loginAttempts)
    .values({ key, count: 1, windowStart: new Date() })
    .onConflictDoUpdate({
      target: loginAttempts.key,
      set: {
        count: sql`CASE WHEN ${windowExpired} THEN 1 ELSE ${loginAttempts.count} + 1 END`,
        windowStart: sql`CASE WHEN ${windowExpired} THEN now() ELSE ${loginAttempts.windowStart} END`
      }
    })
    .returning({ count: loginAttempts.count });

  return (row?.count ?? 0) <= limit;
}