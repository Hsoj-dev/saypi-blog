// src/lib/remote/infoPrivacy.remote.ts
import { form, query, getRequestEvent } from "$app/server"
import { error } from "@sveltejs/kit";
import { db } from '$lib/server/db/db';
import { z } from 'zod';
import { userInfoPrivacy } from "$lib/server/db/schema";
import { logError } from "$lib/helpers/logger";
import { eq } from "drizzle-orm";

export const getMyInfoPrivacy = query(async () => {
  const userId = getUserId();

  const [result] = await db.select()
    .from(userInfoPrivacy)
    .where(eq(userInfoPrivacy.userId, userId));

  return result;
});

export const updateInfoPrivacy = form(z.object({
  basic: z.enum(["public", "private", "friends-only"]).optional(),
  student: z.enum(["public", "private", "friends-only"]).optional(),
  personal: z.enum(["public", "private", "friends-only"]).optional(),
}), async ({ basic, student, personal }) => {
  const { locals: { requestId } } = getRequestEvent();
  const userId = getUserId();
  
  type UpdateData = Partial<{
    basic: "public" | "private" | "friends-only";
    student: "public" | "private" | "friends-only";
    personal: "public" | "private" | "friends-only";
  }>;
  
  const updateData: UpdateData = {};
  
  if (basic !== undefined) updateData.basic = basic;
  if (student !== undefined) updateData.student = student;
  if (personal !== undefined) updateData.personal = personal;
  
  if (Object.keys(updateData).length === 0) {
    throw error(400, {
      message: "No fields to update",
      code: "NO_UPDATE_FIELDS"
    });
  }
  
  try {
    const result = await db.update(userInfoPrivacy).set({
      ...updateData,
      updatedAt: new Date()
    })
      .where(eq(userInfoPrivacy.userId, userId))
      .returning({ id: userInfoPrivacy.userId })
    
    if (result.length === 0) {
      throw error(404, {
        message: "Privacy settings not found",
        code: "INFO_PRIVACY_NOT_FOUND"
      });
    }
  } catch (err) {
    logError("INFO_PRIVACY_UPDATE_FAILED", { requestId, userId, error: err })
    
    throw error(500, {
      message: `Failed to update info privacy`,
      code: "INFO_PRIVACY_UPDATE_FAILED",
    })
  }
});

function getUserId() {
  const { locals } = getRequestEvent();

  if (!locals.user?.id) {
    throw error(401, {
      message: "User is unauthorized",
      code: "UNAUTHORIZED_ACCESS"
    });
  }

  return locals.user.id;
}