// src/lib/server/db/schema//users.ts
import { pgTable, varchar, text, timestamp, uuid, pgPolicy } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { authenticatedRole, serviceRole } from 'drizzle-orm/supabase';
import { campusEnum, gradeEnum, privacyEnum, accountTypeEnum } from './enums';

export const users = pgTable("users", {
  id: uuid("id").primaryKey(), // Primary key that matches Supabase auth.users.id

  username: varchar("username", { length: 32 }).notNull().unique(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  profileHandle: varchar("profile_handle", { length: 100 }).notNull().unique(),

  campus: campusEnum("campus").notNull(),
  gradeLevel: gradeEnum("grade_level").notNull(),
  accountType: accountTypeEnum("account_type").default("student").notNull(),

  bio: varchar("bio", { length: 300 }),
  profilePicUrl: text("profile_pic_url"),

  privacyLevel: privacyEnum("privacy_level")
    .default("public")
    .notNull(),

  createdAt: timestamp("created_at")
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
}, () => [
  
  /*
  POLICY: Users can view their own profile.

  This allows the logged-in user to fetch their own row
  regardless of privacy settings.
  */
  pgPolicy('select_own_user', {
    for: 'select',
    to: authenticatedRole,
    using: sql`id = auth.uid()`,
  }),
  
  /*
  POLICY: Public profiles are visible to everyone.

  Any authenticated user can view profiles where
  privacy_level = 'public'.
  */
  pgPolicy("select_public_profiles", {
    for: "select",
    to: authenticatedRole,
    using: sql`privacy_level = 'public'`,
  }),
  
  /*
  POLICY: Users can update only their own row.

  USING clause:
  Determines which rows they are allowed to UPDATE.

  WITH CHECK clause:
  Ensures the updated row still belongs to them.
  */
  pgPolicy('update_own_user', {
    for: 'update',
    to: authenticatedRole,
    using: sql`id = auth.uid()`,
    withCheck: sql`id = auth.uid()`,
  }),
  
  /*
  POLICY: Only the backend service role can create users.

  This prevents normal clients from inserting rows directly.

  Usually a server hook will create the user record
  after a successful signup.
  */
  pgPolicy('insert_user_service_only', {
    for: 'insert',
    to: serviceRole,
    withCheck: sql`true`, // service role can insert any row
  })
]).enableRLS();

//   uniqueIndex("users_username_idx").on(table.username),
//   uniqueIndex("users_email_idx").on(table.email),
//   index("users_campus_idx").on(table.campus),
//   index("users_grade_idx").on(table.gradeLevel),
