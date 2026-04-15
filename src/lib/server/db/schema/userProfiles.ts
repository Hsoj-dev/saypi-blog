// src/lib/server/db/schema/userProfiles.ts
import { pgTable, varchar, text, timestamp, uuid, jsonb, pgPolicy } from "drizzle-orm/pg-core";
import { sql } from 'drizzle-orm';
import { authenticatedRole } from 'drizzle-orm/supabase';
import { users } from "./users";

// REMINDER: check RLS and Relations if adding new columns

export const userProfiles = pgTable("user_profiles", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),

  statusUpdate: text("status_update"),

  // BASIC INFO
  pronouns: varchar("pronouns", { length: 50 }),
  homeCity: varchar("home_city", { length: 100 }),
  elementarySchool: varchar("elementary_school", { length: 255 }),

  // STUDENT INFO
  section: varchar("section", { length: 100 }),
  coreCourses: text("core_courses"),
  electives: text("electives"),
  house: varchar("house", { length: 100 }),

  // PERSONAL INFO
  personality: text("personality"),
  hobbies: text("hobbies"),
  interests: text("interests"),
  likes: text("likes"),
  dislikes: text("dislikes"),
  goals: text("goals"),
  aboutMe: text("about_me"),

  updatedAt: timestamp("updated_at").notNull().defaultNow()
}, () => [
  // Users can view their own profile
  // Users can view profiles of others only if their privacy level is public
  // TODO: friend based privacy
  pgPolicy('select_visible_profiles', {
    for: 'select',
    to: authenticatedRole,
    using: sql`
      user_id = auth.uid()
      OR EXISTS (
        SELECT 1
        FROM users u
        WHERE u.id = user_profiles.user_id
        AND u.privacy_level = 'public'
      )
    `,
  }),
  
  // EXISTS (
  //   SELECT 1
  //   FROM friends f
  //   WHERE
  //     f.status = 'accepted'
  //     AND (
  //       (f.requester_id = auth.uid() AND f.addressee_id = user_profiles.user_id)
  //       OR
  //       (f.addressee_id = auth.uid() AND f.requester_id = user_profiles.user_id)
  //     )
  // )

  // Users can update their own profile
  pgPolicy('update_own_profile', {
    for: 'update',
    to: authenticatedRole,
    using: sql`user_id = auth.uid()`,
    withCheck: sql`user_id = auth.uid()`,
  }),
  // Users can insert/delete their profile as themselves
  pgPolicy('insert_own_profile', {
    for: 'insert',
    to: authenticatedRole,
    withCheck: sql`user_id = auth.uid()`,
  }),
  pgPolicy('delete_own_profile', {
    for: 'delete',
    to: authenticatedRole,
    using: sql`user_id = auth.uid()`,
  })
]).enableRLS();
