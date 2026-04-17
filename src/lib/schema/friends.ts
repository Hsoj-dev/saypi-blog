// src/lib/schema/blog.ts
import { z } from 'zod';

export const updateFriendshipSchema = z.object({
  id: z.uuid({ error: "Invalid friendship ID format" }),
  status: z.enum(["accepted", "declined", "blocked"], { error: "Invalid status"})
});