// src/lib/remote/friends.remote.ts
import { query, command, getRequestEvent } from '$app/server';
import { redirect, error } from '@sveltejs/kit'
import { db } from '$lib/server/db/db';
import { z } from 'zod';
import { friends } from '$lib/server/db/schema';
import { and, eq, or, count } from 'drizzle-orm';
import { updateFriendshipSchema } from '$lib/schema/friends';
import { logError, logInfo } from '$lib/helpers/logger';

export const getMyFriends = query(async () => {
  const userId = getUserId();
  
  const query = await db.query.friends.findMany({
    where: (friends, { and, eq, or }) =>
      and(
        eq(friends.status, 'accepted'),
        or(
          eq(friends.requesterId, userId),
          eq(friends.addresseeId, userId)
        )
      )
  });
  
  return query
});

export const getUserFriends = query(z.uuid(), async (userId) => {
  const query = await db.query.friends.findMany({
    where: (friends, { and, eq, or }) =>
      and(
        eq(friends.status, 'accepted'),
        or(
          eq(friends.requesterId, userId),
          eq(friends.addresseeId, userId)
        )
      )
  });

  return query
});

export const getMyFriendsCount = query(async () => {
  const userId = getUserId();
  
  const friendsCount = await db
    .select({ total: count(friends.id) })
    .from(friends)
    .where(
    and(
      eq(friends.status, 'accepted'),
      or(
        eq(friends.requesterId, userId),
        eq(friends.addresseeId, userId)
      )
    )
  );
  return friendsCount[0]?.total ?? 0;
});

export const getUserFriendsCount = query(z.uuid(), async (userId) => {
  const friendsCount = await db
    .select({ total: count(friends.id) })
    .from(friends)
    .where(
    and(
      eq(friends.status, 'accepted'),
      or(
        eq(friends.requesterId, userId),
        eq(friends.addresseeId, userId)
      )
    )
  );
  return friendsCount[0]?.total ?? 0;
});

export const getMyPendingRequests = query(async () => {
  const userId = getUserId();
  
  const query = await db.query.friends.findMany({
    where: (friends, { and, eq }) =>
      and(
        eq(friends.status, 'pending'),
        eq(friends.addresseeId, userId)
      )
  });
  
  return query
});

export const getMyOutgoingRequests = query(async () => {
  const userId = getUserId();
  const query = await db.query.friends.findMany({
    where: (friends, { and, eq }) =>
      and(
        eq(friends.status, 'pending'),
        eq(friends.requesterId, userId)
      )
  });

  return query
});

export const getUserBlockedPeople = query(z.uuid(), async (userId) => {
  const query = await db.query.friends.findMany({
    where: (friends, { and, eq, or }) =>
      and(
        eq(friends.status, 'blocked'),
        or(
          eq(friends.requesterId, userId),
          eq(friends.addresseeId, userId)
        )
      )
  });

  return query
});

export const getFriendshipStatus = query(z.uuid(), async (targetUserId) => {
  const userId = getUserId();
  
  return await db.query.friends.findFirst({
    where: (friends, { or, and, eq }) =>
      or(
        and(
          eq(friends.requesterId, userId),
          eq(friends.addresseeId, targetUserId)
        ),
        and(
          eq(friends.requesterId, targetUserId),
          eq(friends.addresseeId, userId)
        )
      )
  });
});

export const sendFriendRequest = command(z.uuid(), async (targetUserId) => {
  const { locals: { requestId } } = getRequestEvent();
  const userId = getUserId();
  try {
    const result = await db.insert(friends).values({
      requesterId: userId,
      addresseeId: targetUserId,
      status: 'pending'
    }).onConflictDoNothing().returning({ id: friends.id });

    if (result.length === 0) {
      throw error(409, {
        message: 'Friend request already exists',
        code: 'FRIEND_REQUEST_EXISTS'
      });
    }
  } catch (err) {
    logError('FRIEND_REQUEST_FAILED', { requestId, error: err });
    
    throw error(500, {
      message: 'Failed to send friend request',
      code: 'FRIEND_REQUEST_FAILED'
    });
  }
  
  logInfo('FRIEND_REQUEST_SENT', { requestId, userId, targetUserId });

  getMyOutgoingRequests().refresh();
  getFriendshipStatus(targetUserId).refresh();
});

export const updateFriendshipStatus = command(updateFriendshipSchema, async (update) => {
  const { locals: { requestId } } = getRequestEvent();
  const userId = getUserId();
  try {
    const result = await db.update(friends).set({
      status: update.status,
      updatedAt: new Date()
    }).where(
        and(
          eq(friends.id, update.id),
          or(
            eq(friends.requesterId, userId),
            eq(friends.addresseeId, userId)
          )
        )
      )
      .returning();
  
    if (result.length === 0) {
      throw error(404, {
        message: 'Friendship not found',
        code: 'FRIENDSHIP_ERROR'
      });
    }
  } catch (err) {
    logError('FRIENDSHIP_UPDATE_FAILED', { requestId, error: err });
    
    throw error(500, {
      message: 'Failed to update friendship',
      code: 'FRIENDSHIP_UPDATE_FAILED'
    });
  }
  
  logInfo('FRIENDSHIP_UPDATE', { requestId, userId, updateType: update.status });
  
  getMyFriends().refresh();
  getMyPendingRequests().refresh();
  getMyOutgoingRequests().refresh();
});

export const removeFriendship = command(z.uuid(), async (id) => {
  const userId = getUserId();
  await db.delete(friends)
    .where(
      and(
        eq(friends.id, id),
        or(
          eq(friends.requesterId, userId),
          eq(friends.addresseeId, userId)
        )
      )
    );
  
  getMyFriends().refresh();
  getMyOutgoingRequests().refresh();
});

// TODO: change?
function getUserId() {
  const { locals } = getRequestEvent();

  if (!locals.user?.id) {
    throw redirect(303, '/auth/login');
    // throw error(401, 'Unauthorized');
  }
  
  return locals.user.id;
}
