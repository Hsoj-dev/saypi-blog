// src/lib/server/db/schema/userInfoPrivacy.ts
import { pgTable, timestamp, uuid, pgPolicy } from "drizzle-orm/pg-core";
import { sql } from 'drizzle-orm';
import { authenticatedRole } from 'drizzle-orm/supabase';
import { users } from "./users";
import { infoPrivacyEnum } from "./enums";

export const userInfoPrivacy = pgTable("user_info_privacy", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),

  basic: infoPrivacyEnum("basic").notNull().default("public"),
  contact: infoPrivacyEnum("contact").notNull().default("public"),
  student: infoPrivacyEnum("student").notNull().default("public"),
  personal: infoPrivacyEnum("personal").notNull().default("public"),

  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, () => [
  pgPolicy('select_own_privacy', {
    for: 'select',
    to: authenticatedRole,
    using: sql`user_id = auth.uid()`,
  }),

  pgPolicy('insert_own_privacy', {
    for: 'insert',
    to: authenticatedRole,
    withCheck: sql`user_id = auth.uid()`,
  }),

  pgPolicy('update_own_privacy', {
    for: 'update',
    to: authenticatedRole,
    using: sql`user_id = auth.uid()`,
    withCheck: sql`user_id = auth.uid()`,
  }),
]).enableRLS();