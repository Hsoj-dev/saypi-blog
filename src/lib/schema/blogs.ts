// src/lib/schema/blog.ts
import { z } from 'zod';

// TODO: finish this
export const updateBlogSchema = z.object({
  blogId: z.string(),
  title: z.string().optional(),
  slug: z.string().optional(),
  content: z.string().optional(),
});

export const softDeleteBlogSchema = z.object({
  blogId: z.uuid()
});