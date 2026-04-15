// src/lib/schema/profiles.ts
import { z } from 'zod';

// TODO: update this max and error meesage
export const statusUpdateSchema = z.object({
    statusUpdate: z.string().max(300, { error: "You have reached maximum characters amount" })
});

// TODO: Recheck these settings
export const basicInfoSchema = z.object({
  pronouns: z.string().max(100).optional(),
  homeCity: z.string().max(100).optional(),
  elementarySchool: z.string().max(150).optional(),
});

// TODO: Recheck these settings
export const studentInfoSchema = z.object({
  section: z.string().max(100).optional(),
  coreCourses: z.string().max(100).optional(),
  electives: z.string().max(200).optional(),
  house: z.string().max(100).optional(),
});

// TODO: Recheck these settings
export const personalInfoSchema = z.object({
    personality: z.string().max(500).optional(),
    hobbies: z.string().max(500).optional(),
    interests: z.string().max(500).optional(),
    likes: z.string().max(500).optional(),
    dislikes: z.string().max(500).optional(),
    goals: z.string().max(500).optional(),
    aboutMe: z.string().max(1000).optional(),
});