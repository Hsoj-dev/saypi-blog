/*
 * Part of the Saypi-Blog project.
 *
 * Copyright (c) 2026 Saypi Studio
 * Licensed under the Saypi-Blog Source Available License 1.0 (SSAL-1.0).
 *
 * See the LICENSE file in the project root for license information.
 */
 
import { z } from 'zod';
import { levels } from '$lib/utils/options';
import { campuses } from '$lib/utils/campus';

export const signupSchema = z.object({
  email: z.email({ error: "Invalid email address" }).endsWith("pshs.edu.ph", { error: "Please use your PSHS email" }),
  username: z.string().min(1, { error: "Username is required" }).max(64, { error: "Bruh, why is your username so long?? - Hsoj ToT" }).trim(),
  _password: z.string().min(6, { error: "Password must be at least 6 characters long" }).max(32, { error: "Bruh, can you really memorize that?? - Hsoj ToT" }).trim(),
  firstName: z.string().min(1, { error: "First name is required" }).trim(),
  lastName: z.string().min(1, { error: "Last name is required" }).trim(),
  gradeLevel: z.enum(levels, { error: "Please select a valid grade level" }),
  campus: z.enum(campuses, { error: "Invalid campus selection" })
});

export const loginSchema = z.object({
  identifier: z.string().min(1, { error: "Please enter your username or email" }).trim(),
  _password: z.string().min(1, { error: "Please enter your password" }).trim(),
  rememberMe: z.coerce.boolean<boolean>().default(false)
});

export const updatePasswordSchema = z.object({
  _newPassword: z.string().min(6, { error: "Password must be at least 6 characters long" }).max(32, { error: "Bruh, can you really memorize that?? - Hsoj ToT" }).trim(),
  _confirmPassword: z.string().min(1, { error: "Please confirm your new password" }).trim()
}).refine(data => data._newPassword === data._confirmPassword, {
  message: "Passwords do not match",
  path: ["_confirmPassword"]
});