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
  "admin"
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
]);