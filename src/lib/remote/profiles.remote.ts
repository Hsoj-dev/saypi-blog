// src/lib/remote/profiles.remote.ts
import { form, query, getRequestEvent } from '$app/server'
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db/db';
import { z } from 'zod';
import { userProfiles } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { basicInfoSchema, studentInfoSchema, personalInfoSchema, statusUpdateSchema } from '$lib/schema/profiles';
import { eq } from 'drizzle-orm';
import { logError } from '$lib/helpers/logger';

export const getUserProfile = query(z.uuid(), async (userId) => {
  
  const userProfile = await db.query.userProfiles.findFirst({
    where: (userProfiles, { eq }) => eq(userProfiles.userId, userId)
  });
  
  if (!userProfile) {
    throw error(404, {
      message: 'User not found',
      code: 'DATABASE_QUERY_ERROR'
    });
  }
  
	return userProfile
})
    
export const updateStatusUpdate = form(statusUpdateSchema, async ({ statusUpdate }) => { 
  const { locals: { requestId } } = getRequestEvent();
  const userId = getUserId();
  
  try {
    await db.update(userProfiles).set({
      statusUpdate,
      updatedAt: new Date()
    }).where(eq(userProfiles.userId, userId));
  } catch (err) {
    logError('PROFILE_UPDATE_FAILED', { requestId, userId, infoType: "Status Update",  error: err }); 
    
    throw error(500, {
      message: 'Failed to update profile',
      code: 'PROFILE_UPDATE_FAILED'
    });
  }
  
  getUserProfile(userId).refresh();
})

export const updateBasicInfo = form(basicInfoSchema, async (user) => { 
  const { locals: { requestId } } = getRequestEvent();
  const userId = getUserId();
  
  try {
    await db.update(userProfiles).set({
      pronouns: user.pronouns,
      homeCity: user.homeCity,
      elementarySchool: user.elementarySchool,
      updatedAt: new Date()
    }).where(eq(userProfiles.userId, userId));
  } catch (err) {
    logError('PROFILE_UPDATE_FAILED', { requestId, userId, infoType: "Basic Info", error: err }); 
    
    throw error(500, {
      message: 'Failed to update profile',
      code: 'PROFILE_UPDATE_FAILED'
    });
  }
  
  getUserProfile(userId).refresh();
})

export const updateStudentInfo = form(studentInfoSchema, async (user) => { 
  const { locals: { requestId } } = getRequestEvent();
  const userId = getUserId();
  
  try {
    await db.update(userProfiles).set({
      section: user.section,
      coreCourses: user.coreCourses,
      electives: user.electives,
      house: user.house,
      updatedAt: new Date()
    }).where(eq(userProfiles.userId, userId));
  } catch (err) {
    logError('PROFILE_UPDATE_FAILED', { requestId, userId, infoType: "Student Info", error: err }); 
    
    throw error(500, {
      message: 'Failed to update profile',
      code: 'PROFILE_UPDATE_FAILED'
    });
  }
  
  getUserProfile(userId).refresh();
})

export const updatePersonalInfo = form(personalInfoSchema, async (user) => {
  const { locals: { requestId } } = getRequestEvent();
  const userId = getUserId();
  
  try {
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
  } catch (err) {
    logError('PROFILE_UPDATE_FAILED', { requestId, userId, infoType: "Personal Info", error: err }); 
    
    throw error(500, {
      message: 'Failed to update profile',
      code: 'PROFILE_UPDATE_FAILED'
    });
  }
  
  getUserProfile(userId).refresh();
})

function getUserId() {
  const { locals } = getRequestEvent();

  if (!locals.user?.id) {
    throw redirect(303, '/auth/login');
  }

  return locals.user.id;
}