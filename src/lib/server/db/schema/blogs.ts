// src/lib/server/db/schema/blogs.ts
import { pgTable, uuid, timestamp, uniqueIndex, index, varchar, text, boolean, pgPolicy } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { authenticatedRole } from 'drizzle-orm/supabase';
import { users } from './users';
import { blogDiscoverableEnum } from './enums';

// REMINDER: check RLS and Relations if adding new columns

export const blogs = pgTable("blogs", {
  id: uuid("id").primaryKey().defaultRandom(),

  authorId: uuid("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  slug: varchar("slug", { length: 200 }).notNull(),

  title: varchar("title", { length: 300 }).notNull(),
  content: text("content").notNull(),

  publishedAt: timestamp("published_at"),
  isDiscoverable: blogDiscoverableEnum("is_discoverable").default("private").notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"), // for soft-deletes
}, (table) => [
  uniqueIndex("blogs_author_slug_idx").on(table.authorId, table.slug),
  index("blogs_discoverable_idx").on(table.isDiscoverable),
  index("blogs_author_idx").on(table.authorId),
  
  /*
  POLICY: Users can view blogs that are:
  - discoverable (public)
  OR
  - owned by the current user

  Additionally, soft-deleted blogs are hidden.
  */
  pgPolicy('select_blogs', {
    for: 'select',
    to: authenticatedRole,
    using: sql`deleted_at IS NULL AND (is_discoverable = 'public' OR author_id = auth.uid())`,
  }),
  
  /*
  POLICY: Users can create blogs only for themselves.

  Prevents a user from inserting a row with someone else's author_id.
  */
  pgPolicy('insert_own_blog', {
    for: 'insert',
    to: authenticatedRole,
    withCheck: sql`author_id = auth.uid()`,
  }),
  
  /*
  POLICY: Users can update only their own blogs.

  USING:
  determines which rows they can update

  WITH CHECK:
  ensures the row still belongs to them after update
  */
  pgPolicy('update_own_blog', {
    for: 'update',
    to: authenticatedRole,
    using: sql`author_id = auth.uid()`,
    withCheck: sql`author_id = auth.uid()`,
  }),
  
  /*
  POLICY: Users can delete only their own blogs.
  */
  pgPolicy('delete_own_blog', {
    for: 'delete',
    to: authenticatedRole,
    using: sql`author_id = auth.uid()`,
  }),
]).enableRLS();