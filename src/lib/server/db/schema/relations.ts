// src/lib/server/db/schema/relations.ts
import { relations } from "drizzle-orm";
import { users } from "./users";
import { userProfiles } from "./userProfiles";
import { userInfoPrivacy } from "./userInfoPrivacy";
import { blogs } from "./blogs";

// -------------------------------
// USER & PROFILE RELATIONS
// -------------------------------
export const userRelations = relations(users, ({ one }) => ({
  profile: one(userProfiles, {
    fields: [users.id],
    references: [userProfiles.userId]
  })
}));

export const userProfileRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id]
  })
}));

// -------------------------------
// USER INFO PRIVACY RELATIONS
// -------------------------------
export const userPrivacyRelations = relations(users, ({ one }) => ({
  privacy: one(userInfoPrivacy, {
    fields: [users.id],
    references: [userInfoPrivacy.userId],
  }),
}));

export const infoPrivacyRelations = relations(userInfoPrivacy, ({ one }) => ({
  user: one(users, {
    fields: [userInfoPrivacy.userId],
    references: [users.id],
  }),
}));

// -------------------------------
// BLOGS RELATIONS
// -------------------------------
export const blogsRelations = relations(blogs, ({ one }) => ({
  author: one(users, {
    fields: [blogs.authorId],
    references: [users.id],
  }),
}));

export const userBlogRelations = relations(users, ({ many }) => ({
  blogs: many(blogs)
}));