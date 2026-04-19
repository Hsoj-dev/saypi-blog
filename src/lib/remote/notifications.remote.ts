// src/lib/remote/notifications.remote.ts
import { query, command, requested, getRequestEvent } from "$app/server";
import { error } from '@sveltejs/kit'
import { z } from 'zod';
import { notifications } from '$lib/server/db/schema';
import { db } from '$lib/server/db/db';
import { desc, eq, and, isNull, count } from 'drizzle-orm';
import { logError  } from "$lib/helpers/logger";

export const getMyNotifications = query(z.object({
    filter: z.enum(['all', 'unread']).optional()
}), async ({ filter }) => {
  const userId = getUserId();
  
  const query = await db.query.notifications.findMany({
    where: (n, { eq, and, isNull }) =>
      filter === 'unread'
        ? and(eq(n.recipientId, userId), isNull(n.readAt))
        : eq(n.recipientId, userId),
    orderBy: desc(notifications.createdAt),
    limit: 20
  });
  
  return query
})

export const getMyUnreadNotificationsCount = query(async () => {
  const userId = getUserId();
  
  const unreadCount = await db
    .select({ count: count(notifications.id) })
    .from(notifications)
    .where(
      and(
        eq(notifications.recipientId, userId),
        isNull(notifications.readAt)
      )
    );
  
  return unreadCount[0]?.count ?? 0;
})

// NOTE: Only use this on server side,
export const createNotification = command(z.object({
  recipientId: z.uuid(),
  type: z.enum(["friend_request", "friend_accept", "blog_upvote", "admin_announcement"]),
  entityId: z.uuid().optional(),
  entityType: z.enum(["blog", "user", "announcement"]).optional()
}), async ({ recipientId, type, entityId, entityType }) => {
  const { locals: { requestId } } = getRequestEvent();
  const userId = getUserId();
  
  try {
    const result = await db.insert(notifications).values({
      recipientId,
      actorId: userId,
      type,
      entityId,
      entityType
    }).onConflictDoNothing().returning({ id: notifications.id });

    if (result.length === 0) {
      return;
    }
  } catch (err) {
    logError('NOTIFICATION_CREATION_FAILED', {
      requestId,
      actorId: userId,
      recipientId,
      notificationType: type,
      entityId,
      entityType,
      error: err
    });
    
    throw error(500, {
      message: 'Failed to create notification',
      code: 'NOTIFICATION_CREATION_FAILED'
    });
  }

  await requested(getMyNotifications).refreshAll();
  await requested(getMyUnreadNotificationsCount).refreshAll();
})
  
export const markAsRead = command(z.uuid(), async (id) => {
  const { locals: { requestId } } = getRequestEvent();
  const userId = getUserId();
  
  try {
    const result = await db.update(notifications).set({
      readAt: new Date()
    })
    .where(
      and(
        eq(notifications.id, id),
        eq(notifications.recipientId, userId),
        isNull(notifications.readAt)
      )
    ).returning({ id: notifications.id });
    
    if (result.length === 0) {
      throw error(404, {
        message: 'Notification not found or already read',
        code: 'NOTIFICATION_NOT_FOUND_OR_READ'
      });
    }
  } catch (err) {
    logError('NOTIFICATION_MARK_READ_FAILED', {
      requestId,
      userId,
      notificationId: id,
      error: err
    });
    
    throw error(500, {
      message: 'Failed to mark notification as read',
      code: 'NOTIFICATION_MARK_READ_FAILED'
    });
  }
  
  await requested(getMyNotifications).refreshAll();
  await requested(getMyUnreadNotificationsCount).refreshAll();
})

export const markAllAsRead = command(async () => {
  const { locals: { requestId } } = getRequestEvent();
  const userId = getUserId();
  
  try {
    const result = await db.update(notifications).set({
      readAt: new Date()
    })
    .where(
      and(
        eq(notifications.recipientId, userId),
        isNull(notifications.readAt)
      )
    ).returning({ id: notifications.id });
    
    if (result.length === 0) {
      return;
    }
  } catch (err) {
    logError('NOTIFICATIONS_MARK_ALL_FAILED', {
      requestId,
      userId,
      error: err
    });
    
    throw error(500, {
      message: 'Failed to mark all notifications as read',
      code: 'NOTIFICATIONS_MARK_ALL_FAILED'
    });
  }
  
  await requested(getMyNotifications).refreshAll();
  await requested(getMyUnreadNotificationsCount).refreshAll();
})

export const deleteAllNotifications = command(async () => {
  const userId = getUserId();
  await db.delete(notifications).where(eq(notifications.recipientId, userId));
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