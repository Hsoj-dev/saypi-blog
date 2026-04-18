// src/lib/server/db/schema/notifications.ts
import { pgTable, timestamp, uuid, pgPolicy, index, uniqueIndex } from "drizzle-orm/pg-core";
import { sql } from 'drizzle-orm';
import { authenticatedRole } from 'drizzle-orm/supabase';
import { users } from "./users";
import { notificationTypeEnum, entityTypeEnum } from './enums';

// REMINDER: check RLS and Relations if adding new columns

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  recipientId: uuid("recipient_id")
    .notNull()
    .references(() => users.id),
  actorId: uuid("actor_id")
    .references(() => users.id, { onDelete: "set null" }),

  type: notificationTypeEnum("type").notNull(),
  
  entityType: entityTypeEnum("entity_type"),
  entityId: uuid("entity_id"),

  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").notNull().defaultNow()
}, (table) => [
  uniqueIndex("unique_blog_upvote_notification")
    .on(table.recipientId, table.actorId, table.entityId, table.type),
  
  index("notifications_recipient_idx")
    .on(table.recipientId, table.createdAt),

  index("notifications_unread_idx")
    .on(table.recipientId, table.readAt),
  
  pgPolicy('read_own_notifications', {
    for: 'select',
    to: authenticatedRole,
    using: sql`recipient_id = auth.uid()`,
  }),
  
  pgPolicy('update_own_notifications', {
    for: 'update',
    to: authenticatedRole,
    using: sql`recipient_id = auth.uid()`,
    withCheck: sql`recipient_id = auth.uid()`,
  }),
]).enableRLS();