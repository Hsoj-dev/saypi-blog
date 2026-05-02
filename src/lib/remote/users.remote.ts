// src/lib/remote/users.remote.ts
import { form, query, getRequestEvent } from '$app/server'
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db/db';
import { z } from 'zod';
import { users } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { bioSchema, privacyLevelSchema, profilePicURLSchema, usernameSchema } from '$lib/schema/users';
import { eq } from 'drizzle-orm';

export const getDatabaseUser = query(z.uuid(), async (userId) => {
  
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId)
  });
  
  if (!user) {
    throw error(404, {
      message: 'User not found',
      code: 'DATABASE_QUERY_ERROR'
    });
  }
  
	return user
})

export const getDatabaseUserByHandle = query(z.string(), async (profileHandle) => {
  
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.profileHandle, profileHandle)
  });
  
  if (!user) {
    throw error(404, {
      message: 'User not found',
      code: 'DATABASE_QUERY_ERROR'
    });
  }
  
	return user
})

export const getUserUsername = query(z.uuid(), async (userId) => {
  
  const user = await db.query.users.findFirst({
    columns: { username: true },
    where: (users, { eq }) => eq(users.id, userId)
  });

  if (!user?.username) {
    throw error(400, {
      message: 'No username',
      code: 'DATABASE_QUERY_ERROR'
    });
  }
  
	return user
})

export const getUserProfileHandle = query(z.uuid(), async (userId) => {
  
  const user = await db.query.users.findFirst({
    columns: { profileHandle: true },
    where: (users, { eq }) => eq(users.id, userId)
  });

  if (!user?.profileHandle) {
    throw error(400, {
      message: 'No profile handle',
      code: 'DATABASE_QUERY_ERROR'
    });
  }
  
	return user
})

export const getUserAccountType = query(z.uuid(), async (userId) => {
  
  const user = await db.query.users.findFirst({
    columns: { accountType: true },
    where: (users, { eq }) => eq(users.id, userId)
  });

  if (!user?.accountType) {
    throw error(400, {
      message: 'No account type',
      code: 'DATABASE_QUERY_ERROR'
    });
  }
  
	return user
})

export const getUserCampus = query(z.uuid(), async (userId) => {
  
  const user = await db.query.users.findFirst({
    columns: { campus: true },
    where: (users, { eq }) => eq(users.id, userId)
  });

  if (!user?.campus) {
    throw error(400, {
      message: 'No campus',
      code: 'DATABASE_QUERY_ERROR'
    });
  }
  
	return user
})

export const getUserGradeLevel = query(z.uuid(), async (userId) => {
  
  const user = await db.query.users.findFirst({
    columns: { gradeLevel: true },
    where: (users, { eq }) => eq(users.id, userId)
  });

  if (!user?.gradeLevel) {
    throw error(400, {
      message: 'No grade level',
      code: 'DATABASE_QUERY_ERROR'
    });
  }
  
	return user
})

export const updateUsername = form(usernameSchema, async ({ username }) => { 
  const userId = getUserId();
  await db.update(users).set({
    username,
    updatedAt: new Date()
  }).where(eq(users.id, userId));
})

export const updatePrivacyLevel = form(privacyLevelSchema, async ({ privacyLevel }) => { 
  const userId = getUserId();
  await db.update(users).set({
    privacyLevel,
    updatedAt: new Date()
  }).where(eq(users.id, userId));
})

export const updateBio = form(bioSchema, async ({ bio }) => { 
  const userId = getUserId();
  await db.update(users).set({
    bio,
    updatedAt: new Date()
  }).where(eq(users.id, userId));
})

export const updateProfilePic = form(profilePicURLSchema, async ({ profilePicUrl }) => { 
  const userId = getUserId();
  await db.update(users).set({
    profilePicUrl,
    updatedAt: new Date()
  }).where(eq(users.id, userId));
})

function getUserId() {
  const { locals } = getRequestEvent();

  if (!locals.user?.id) {
    throw redirect(303, '/auth/login');
  }

  return locals.user.id;
}