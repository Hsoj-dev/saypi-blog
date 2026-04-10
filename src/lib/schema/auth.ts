// src/lib/schema/auth.ts
import { z } from 'zod';

export const signupSchema = z.object({
  email: z.email({ error: "Invalid email address" }).endsWith("pshs.edu.ph", { error: "Please use your PSHS email" }),
  username: z.string().min(3, { error: "Username must be at least 3 characters long" }).trim(),
  password: z.string().min(6, { error: "Password must be at least 6 characters long" }).max(32, {error: "Bruh, can you really memorize that?? - Hsoj ToT"}).trim(),
  firstName: z.string().min(1, { error: "First name is required" }).trim(),
  lastName: z.string().min(1, { error: "Last name is required" }).trim(),
  sex: z.enum(['male', 'female']),
  gradeLevel: z.enum(["7", "8", "9", "10", "11", "12"], { error: "Please select a valid grade level" }),
  campus: z.string({ error: "Invalid campus selection" }).min(1, { error: "Please select a campus" }),
});

export const loginSchema = z.object({
  username: z.string().trim(),
  password: z.string().trim()
});
