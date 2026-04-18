// src/lib/remote/notifications.remote.ts
import { query, command, getRequestEvent } from "$app/server";
import { redirect, error } from '@sveltejs/kit'
import { z } from 'zod';
import { notifications } from '$lib/server/db/schema';
import { db } from '$lib/server/db/db';
import { desc, eq, and, isNull, count } from 'drizzle-orm';
import { logError, logInfo } from "$lib/helpers/logger";

export const getMyNotifications = query(async () => {
  const userId = getUserId();
  
  const query = await db.query.notifications.findMany({
    where: eq(notifications.recipientId, userId),
    orderBy: desc(notifications.createdAt),
    limit: 20
  });
  
  return query
})

export const getMyUnreadNotifications = query(async () => {
  const userId = getUserId();
  
  const query = await db
  .select()
  .from(notifications)
  .where(
    and(
      eq(notifications.recipientId, userId),
      isNull(notifications.readAt)
    )
  )
  .orderBy(desc(notifications.createdAt))
  .limit(20);
  
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

export const createNotification = command(z.object({
  recipientId: z.uuid(),
  type: z.enum(["friend_request", "friend_accept", "blog_upvote", "admin_announcement"]),
  entityId: z.uuid(),
  entityType: z.enum(["blog", "user", "announcement"])
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
      throw error(, {
        message: '',
        code: ''
      });
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
    
    throw error( , {
      message: '',
      code: 'NOTIFICATION_CREATION_FAILED'
    });
  }
  
  // Will this be just noise?
  logInfo('NOTIFICATION_SENT', { requestId, userId, notificationId: notifications.id })
  
  getMyNotifications().refresh();
  getMyUnreadNotifications().refresh();
  getMyUnreadNotificationsCount().refresh();
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
      throw error(, {
        message: '',
        code: ''
      });
    }
  } catch (err) {
    logError('', { requestId, userId, error: err });
    
    throw error( , {
      message: '',
      code: ''
    });
  }
  
  getMyNotifications().refresh();
  getMyUnreadNotifications().refresh();
  getMyUnreadNotificationsCount().refresh();
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
      throw error(, {
        message: '',
        code: ''
      });
    }
  } catch (err) {
    logError('', { requestId, userId, error: err });
    
    throw error( , {
      message: "",
      code: ""
    });
  }
  
  getMyNotifications().refresh();
  getMyUnreadNotifications().refresh();
  getMyUnreadNotificationsCount().refresh();
})

// deleteNotifications? when should I delete notifications? what notifications should I delete?

// TODO: change? too strict?
function getUserId() {
  const { locals } = getRequestEvent();

  if (!locals.user?.id) {
    throw redirect(303, '/auth/login');
  }

  return locals.user.id;
}