// src/lib/schema/auth.ts
import { z } from 'zod';
import { levels } from '$lib/utils/options';
import { campuses } from '$lib/utils/campus';

export const signupSchema = z.object({
  email: z.email({ error: "Invalid email address" }).endsWith("pshs.edu.ph", { error: "Please use your PSHS email" }),
  username: z.string().min(1, { error: "Username is required" }).max(64, { error: "Bruh, why is your username so long?? - Hsoj ToT" }).trim(),
  password: z.string().min(6, { error: "Password must be at least 6 characters long" }).max(32, { error: "Bruh, can you really memorize that?? - Hsoj ToT" }).trim(),
  firstName: z.string().min(1, { error: "First name is required" }).trim(),
  lastName: z.string().min(1, { error: "Last name is required" }).trim(),
  gradeLevel: z.enum(levels, { error: "Please select a valid grade level" }),
  campus: z.enum(campuses, { error: "Invalid campus selection" })
});

export const loginSchema = z.object({
  identifier: z.string().min(1, { error: "Please enter your username or email" }).trim(),
  password: z.string().min(1, { error: "Please enter your password" }).trim()
});

export const updatePasswordSchema = z.object({
  newPassword: z.string().min(6, { error: "Password must be at least 6 characters long" }).max(32, { error: "Bruh, can you really memorize that?? - Hsoj ToT" }).trim(),
  confirmPassword: z.string().min(1, { error: "Please confirm your new password" }).trim()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});