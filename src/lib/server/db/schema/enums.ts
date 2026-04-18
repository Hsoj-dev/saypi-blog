// src/lib/server/db/schema/enums.ts
import { pgEnum } from "drizzle-orm/pg-core";

export const campusEnum = pgEnum("campus_enum", [
    "MC",
    "IRC",
    "CVC",
    "CARC",
    "CLC",
    "CBZRC",
    "MRC",
    "BRC",
    "WVC",
    "CVisC",
    "EVC",
    "CMC",
    "SMC",
    "SRC",
    "CRC",
    "ZRC"
]);

export const gradeEnum = pgEnum("grade_enum", [
  "7",
  "8",
  "9",
  "10",
  "11",
  "12"
]);

export const privacyEnum = pgEnum("privacy_enum", [
  "public",
  "private",
  "friends-only"
]);

export const accountTypeEnum = pgEnum("account_type_enum", [
  "student", 
  "org", 
  "guest",
  "mod",
  "admin"
]);

export const sexEnum = pgEnum("sex_enum", [
  "male",
  "female"
]);

export const infoPrivacyEnum = pgEnum("info_privacy_enum", [
  "public",
  "private",
  "friends-only"
]);

export const blogDiscoverableEnum = pgEnum("blog_discoverable_enum", [
  "public",
  "campus",
  "private"
]);

export const friendStatusEnum = pgEnum("friend_status_enum", [
  "pending",   // request sent, waiting for acceptance
  "accepted",  // mutual friendship
  "declined",  // request declined
  "blocked"    // user blocked
]);

export const notificationTypeEnum = pgEnum("notification_type_enum", [
  "friend_request",
  "friend_accept",
  "blog_upvote",
  //"mention_user",
  "admin_announcement",
  //"profile_milestone",
  //"potential_friend_joined" // You're batchmate joined (checks campus and grade level)
]);

export const entityTypeEnum = pgEnum("entity_type_enum", [
  "blog",
  "user",
  "announcement",
]);