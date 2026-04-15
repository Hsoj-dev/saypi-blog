// src/lib/remote/profiles.remote.ts
import { form, query, getRequestEvent } from '$app/server'
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db/db';
import { z } from 'zod';
import { userProfiles } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { basicInfoSchema, studentInfoSchema, personalInfoSchema, statusUpdateSchema } from '$lib/schema/profiles';
import { eq } from 'drizzle-orm';

export const getUserProfile = query(z.string(), async (userId) => {
  
  const userProfile = await db.query.userProfiles.findFirst({
    where: (users, { eq }) => eq(userProfiles.userId, userId)
  });
  
  if (!userProfile) {
    throw error(404, {
      message: 'User not found',
      code: 'DATABASE_QUERY_ERROR'
    });
  }
  
	return userProfile
})
    
export const updateStatusUpdate = form(statusUpdateSchema, async (user) => { 
  const userId = getUserId();
  await db.update(userProfiles).set({
    statusUpdate: user.statusUpdate,
    updatedAt: new Date()
  }).where(eq(userProfiles.userId, userId));
})

export const updateBasicInfo = form(basicInfoSchema, async (user) => { 
  const userId = getUserId();
  await db.update(userProfiles).set({
    pronouns: user.pronouns,
    homeCity: user.homeCity,
    elementarySchool: user.elementarySchool,
    updatedAt: new Date()
  }).where(eq(userProfiles.userId, userId));
})

export const updateStudentInfo = form(studentInfoSchema, async (user) => { 
  const userId = getUserId();
  await db.update(userProfiles).set({
    section: user.section,
    coreCourses: user.coreCourses,
    electives: user.electives,
    house: user.house,
    updatedAt: new Date()
  }).where(eq(userProfiles.userId, userId));
})

export const updatePersonalInfo = form(personalInfoSchema, async (user) => { 
  const userId = getUserId();
  await db.update(userProfiles).set({
    personality: user.personality,
    hobbies: user.hobbies,
    interests: user.interests,
    likes: user.likes,
    dislikes: user.dislikes,
    goals: user.goals,
    aboutMe: user.aboutMe,
    updatedAt: new Date()
  }).where(eq(userProfiles.userId, userId));
})

function getUserId() {
  const { locals } = getRequestEvent();

  if (!locals.user?.id) {
    throw redirect(303, '/auth/login');
  }

  return locals.user.id;
}