// src/lib/remote/upvotes.remote.ts
import { command, query, getRequestEvent } from '$app/server'
import { redirect, error } from '@sveltejs/kit'
import { z } from 'zod';
import { logError, logInfo } from '$lib/helpers/logger';
import { db } from '$lib/server/db/db';

// in +page.svelte: await upvoteBlog(blog.id).updates(getUpvotes(blog.id))
export const upvoteBlog = command(z.string(), async (blogId) => {
  const { locals: { requestId } } = getRequestEvent();

  const userId = getUserId();

  await db.insert(upvotes).values({
    blogId,
    userId
  });

  getUpvotes(blogId).refresh();
});

export const revokeUpvote = command(async () => {
  
})

// TODO: Change redirect, too aggressive??
function getUserId() {
  const { locals } = getRequestEvent();

  if (!locals.user?.id) {
    throw redirect(303, '/auth/login');
  }

  return locals.user.id;
}