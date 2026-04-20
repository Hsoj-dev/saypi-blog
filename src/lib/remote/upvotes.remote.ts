// src/lib/remote/upvotes.remote.ts
import { command, getRequestEvent } from '$app/server'
import { error } from '@sveltejs/kit'
import { z } from 'zod';
import { db } from '$lib/server/db/db';
import { upvotes, blogs } from '$lib/server/db/schema';
import { logError } from '$lib/helpers/logger';
import { eq, and, sql } from 'drizzle-orm';

export const toggleUpvote = command(z.string(), async (blogId) => {
  const { locals: { requestId } } = getRequestEvent();
  const userId = getUserId();

  try {
    return await db.transaction(async (tx) => {
      // Check if already upvoted
      const existing = await tx.query.upvotes.findFirst({
        where: (upvotes, { and, eq }) =>
          and(
            eq(upvotes.upvoterId, userId),
            eq(upvotes.blogId, blogId)
          )
      });

      if (existing) {
        await tx.delete(upvotes).where(
          and(
            eq(upvotes.upvoterId, userId),
            eq(upvotes.blogId, blogId)
          )
        );

        await tx.update(blogs)
          .set({ upvotesCount: sql`upvotes_count - 1` })
          .where(eq(blogs.id, blogId));

        return { upvoted: false };
      } else {
        await tx.insert(upvotes).values({
          upvoterId: userId,
          blogId,
        });

        await tx.update(blogs)
          .set({ upvotesCount: sql`upvotes_count + 1` })
          .where(eq(blogs.id, blogId));

        return { upvoted: true };
      }
    });
  } catch (err) {
    // Handle race condition duplicate insert edge case
    // if (err?.code === '23505') {
    //   return { upvoted: true }; // already exists, treat as success
    // }

    logError("TOGGLE_UPVOTE_FAILED", { requestId, userId, blogId, error: err });

    throw error(500, {
      message: "Failed to toggle upvote",
      code: "TOGGLE_UPVOTE_FAILED",
    });
  }
});

function getUserId() {
  const { locals } = getRequestEvent();

  if (!locals.user?.id) {
    throw error(401, {
      message: "User is unauthorized",
      code: "UNAUTHORIZED_ACCESS"
    });
  }

  return locals.user.id;
}