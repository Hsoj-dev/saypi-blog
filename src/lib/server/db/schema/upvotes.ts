// src/lib/server/db/schema/upvotes.ts
import { pgTable, timestamp, uuid, uniqueIndex, pgPolicy } from "drizzle-orm/pg-core";
import { users } from "./users";
import { blogs } from "./blogs";
import { authenticatedRole } from "drizzle-orm/supabase";
import { sql } from "drizzle-orm";

export const upvotes = pgTable("upvotes", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  upvoterId: uuid("upvoter_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  blogId: uuid("blog_id")
    .notNull()
    .references(() => blogs.id, { onDelete: "cascade" }),
  
  createdAt: timestamp("created_at").notNull().defaultNow()
}, (table) => [
  uniqueIndex("upvotes_user_blog_unique_idx").on(table.upvoterId, table.blogId),

  pgPolicy("select_upvotes", {
    for: "select",
    to: authenticatedRole,
    using: sql`true`,
  }),
  
  pgPolicy("insert_own_upvote", {
    for: "insert",
    to: authenticatedRole,
    withCheck: sql`upvoter_id = auth.uid()`,
  }),
  
  pgPolicy("remove_own_upvote", {
    for: "delete",
    to: authenticatedRole,
    using: sql`upvoter_id = auth.uid()`,
  }),
  
]).enableRLS();