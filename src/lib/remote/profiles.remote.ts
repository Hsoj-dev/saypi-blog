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

export const getMyProfile = query(async () => {
  const userId = getUserId();
  
  const myProfile = await db.query.userProfiles.findFirst({
    where: (userProfiles, { eq }) => eq(userProfiles.userId, userId)
  });
  
  if (!myProfile) {
    throw error(404, {
      message: 'User not found',
      code: 'DATABASE_QUERY_ERROR'
    });
  }
  
	return myProfile
})

export const getPublicProfile = query(z.uuid(), async (targetUserId) => {
  const viewerId = getUserId();
  
  if (viewerId === targetUserId) {
    return await getMyProfile();
  }
  
  const isFriend = await checkIfFriends(viewerId, targetUserId);

  // TODO: refactor these queries into a join next time
  const privacy = await db.query.userInfoPrivacy.findFirst({
    where: (userInfoPrivacy, { eq }) => eq(userInfoPrivacy.userId, targetUserId)
  });
  
  const profile = await db.query.userProfiles.findFirst({
    where: (userProfiles, { eq }) => eq(userProfiles.userId, targetUserId)
  });
  
  if (!profile || !privacy) {
    throw error(404, {
      message: 'User not found',
      code: 'DATABASE_QUERY_ERROR'
    });
  }
  
  return {
    statusUpdate: profile.statusUpdate,
    updatedAt: profile.updatedAt,
    basic: canView(privacy.basic, isFriend)
      ? {
        pronouns: profile.pronouns,
        homeCity: profile.homeCity,
        elementarySchool: profile.elementarySchool,
      }
      : {},

    student: canView(privacy.student, isFriend)
      ? { 
        section: profile.section,
        coreCourses: profile.coreCourses,
        electives: profile.electives,
        house: profile.house,
      }
      : {},

    personal: canView(privacy.personal, isFriend)
      ? { 
        personality: profile.personality,
        hobbies: profile.hobbies,
        interests: profile.interests,
        likes: profile.likes,
        dislikes: profile.dislikes,
        goals: profile.goals,
        aboutMe: profile.aboutMe,
      }
      : {},
  };
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
  
  getMyProfile().refresh();
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
  
  getMyProfile().refresh();
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
  
  getMyProfile().refresh();
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
  
  getMyProfile().refresh();
})

function getUserId() {
  const { locals } = getRequestEvent();

  if (!locals.user?.id) {
    throw redirect(303, '/auth/login');
  }

  return locals.user.id;
}

async function checkIfFriends(userA: string, userB: string) {
  const result = await db.query.friends.findFirst({
    where: (f, { and, or, eq }) =>
      and(
        eq(f.status, "accepted"),
        or(
          and(eq(f.requesterId, userA), eq(f.addresseeId, userB)),
          and(eq(f.requesterId, userB), eq(f.addresseeId, userA))
        )
      ),
    columns: { id: true },
  });

  return !!result;
}

function canView(level: string, isFriend: boolean) {
  if (level === "public") return true;
  if (level === "friends-only" && isFriend) return true;
  return false;
}