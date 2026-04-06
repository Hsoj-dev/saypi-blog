// src/lib/server/db/schema/friends.ts
import { pgTable, uuid, timestamp, index, pgPolicy } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { authenticatedRole } from 'drizzle-orm/supabase';
import { users } from "./users";
import { friendStatusEnum } from "./enums";

export const friends = pgTable("friends", {
  id: uuid("id").primaryKey().defaultRandom(),

  requesterId: uuid("requester_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  addresseeId: uuid("addressee_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  status: friendStatusEnum("status").notNull().default("pending"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
  
  /*
  POLICY: Users can see friendships where they are involved.

  This allows a user to view:
  - friends they requested
  - requests sent to them
  */
  pgPolicy("select_own_friendships", {
    for: "select",
    to: authenticatedRole,
    using: sql`
      requester_id = auth.uid()
      OR addressee_id = auth.uid()
    `,
  }),
  
  /*
  POLICY: Users can send a friend request.

  The requester must be the authenticated user.
  */
  pgPolicy("insert_friend_request", {
    for: "insert",
    to: authenticatedRole,
    withCheck: sql`
      requester_id = auth.uid()
    `,
  }),
  
  /*
  POLICY: Users can update friendships they are part of.

  This allows the addressee to accept a request
  by changing status from 'pending' to 'accepted'.
  */
  pgPolicy("update_friendship_status", {
    for: "update",
    to: authenticatedRole,
    using: sql`
      requester_id = auth.uid()
      OR addressee_id = auth.uid()
    `,
    withCheck: sql`
      requester_id = auth.uid()
      OR addressee_id = auth.uid()
    `,
  }),
  
  /*
  POLICY: Users can delete friendships they are part of.

  This enables unfriending or canceling a request.
  */
  pgPolicy("delete_own_friendship", {
    for: "delete",
    to: authenticatedRole,
    using: sql`
      requester_id = auth.uid()
      OR addressee_id = auth.uid()
    `,
  }),
  
  // prevent users from friending themselves
  sql`ALTER TABLE ${table} ADD CONSTRAINT no_self_friends CHECK (requester_id <> addressee_id)`,

  // true bidirectional friendship uniqueness
  // This prevents (A,B) AND (B,A) duplicates by normalizing pairs:
  // LEAST() always picks the smaller UUID, GREATEST() the larger.
  sql`CREATE UNIQUE INDEX friends_unique_pair ON ${table} 
 (LEAST(requester_id, addressee_id), GREATEST(requester_id, addressee_id))`,

  // index for fast lookups
  index("friends_requester_idx").on(table.requesterId),
  index("friends_addressee_idx").on(table.addresseeId),
  index("friends_status_idx").on(table.status)
  
]).enableRLS();