// src/lib/schema/users.ts
import { z } from 'zod';

export const usernameSchema = z.object({
  username: z.string().min(1, { error: "Username is required" }).max(64, { error: "Bruh, why is your new username so long?? - Hsoj ToT" }).trim(),
});
  
export const privacyLevelSchema = z.object({
  privacyLevel: z.enum(["public", "private", "friends-only"], { error: "Invalid privacy level" })
});

export const bioSchema = z.object({
  bio: z.string().max(300, { error: "You have reached maximum characters amount" })
});

export const profilePicURLSchema = z.object({
  profilePicURL: z.url()
})