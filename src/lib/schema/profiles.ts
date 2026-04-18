// src/lib/schema/profiles.ts
import { z } from 'zod';

export const statusUpdateSchema = z.object({
    statusUpdate: z.string().max(80, { error: "Keep it short (max 80 characters)." })
});

export const basicInfoSchema = z.object({
  pronouns: z.string().max(50, { error: "Pronouns too long." }).optional(),
  homeCity: z.string().max(100, { error: "Home city too long." }).optional(),
  elementarySchool: z.string().max(150, { error: "School name too long." }).optional(),
});

export const studentInfoSchema = z.object({
  section: z.string().max(100, { error: "Section too long." }).optional(),
  coreCourses: z.string().max(100, { error: "Core courses too long." }).optional(),
  electives: z.string().max(100, { error: "Electives too long." }).optional(),
  house: z.string().max(100, { error: "House too long." }).optional(),
});

export const personalInfoSchema = z.object({
  personality: z.string().max(500, { error: "Personality too long." }).optional(),
  hobbies: z.string().max(500, { error: "Hobbies too long." }).optional(),
  interests: z.string().max(500, { error: "Interests too long." }).optional(),
  likes: z.string().max(500, { error: "Likes too long." }).optional(),
  dislikes: z.string().max(500, { error: "Dislikes too long." }).optional(),
  goals: z.string().max(500, { error: "Goals too long." }).optional(),
  aboutMe: z.string().max(800, { error: "About me must be 800 characters or less." }).optional(),
});

