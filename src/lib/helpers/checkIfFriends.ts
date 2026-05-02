import { db } from '$lib/server/db/db';

export async function checkIfFriends(userA: string, userB: string) {
  const result = await db.query.friends.findFirst({
    where: (f, { and, or, eq }) =>
      and(
        eq(f.status, "accepted"),
        or(
          and(eq(f.requesterId, userA), eq(f.addresseeId, userB)),
          and(eq(f.requesterId, userB), eq(f.addresseeId, userA))
        )
      ),
    columns: { id: true },
  });

  return !!result;
}