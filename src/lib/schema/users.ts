// src/lib/schema/users.ts
import { z } from 'zod';

export const usernameSchema = z.object({
  username: z.string().min(1, { error: "Username is required" }).max(64, { error: "Bruh, why is your new username so long?? - Hsoj ToT" }).trim(),
});