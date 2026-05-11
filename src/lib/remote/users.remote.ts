// src/lib/remote/users.remote.ts
import { form, query, getRequestEvent } from '$app/server'
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db/db';
import { z } from 'zod';
import { users } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { usernameSchema } from '$lib/schema/users';
import { eq } from 'drizzle-orm';
import { logError } from '$lib/helpers/logger';
import { createImagePath, deleteFile, uploadFile } from '$lib/server/storage';

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
  const { locals: { requestId } } = getRequestEvent();
  const userId = getUserId();

  try {
    await db.update(users).set({
      username,
      updatedAt: new Date()
    }).where(eq(users.id, userId));
  } catch (err) {
    logError('USERNAME_UPDATE_FAILED', { requestId, userId, error: err }); 
    
    throw error(500, {
      message: 'Failed to update username',
      code: 'USERNAME_UPDATE_FAILED'
    });
  }
})

// TODO: fix validation
export const updateFirstLastName = form(z.object({
  firstName: z.string(),
  lastName: z.string()
}), async ({ firstName, lastName }) => { 
  const { locals: { requestId } } = getRequestEvent();
  const userId = getUserId();

  try {
    await db.update(users).set({
      firstName,
      lastName,
      updatedAt: new Date()
    }).where(eq(users.id, userId));
  } catch (err) {
    logError('USER_FIRST_LAST_NAME_UPDATE_FAILED', { requestId, userId, error: err }); 
    
    throw error(500, {
      message: 'Failed to update user first and last name',
      code: 'USER_FIRST_LAST_NAME_UPDATE_FAILED'
    });
  }
})

// TODO: fix validation
export const updateProfileHandle = form(z.object({
  newProfileHandle: z.string()
}), async ({ newProfileHandle }) => { 
  const { locals: { requestId } } = getRequestEvent();
  const userId = getUserId();

  try {
    await db.update(users).set({
      profileHandle: `@${newProfileHandle}`,
      updatedAt: new Date()
    }).where(eq(users.id, userId));
  } catch (err) {
    logError('USER_HANDLE_UPDATE_FAILED', { requestId, userId, error: err }); 
    
    throw error(500, {
      message: 'Failed to update user profile handle',
      code: 'USER_HANDLE_UPDATE_FAILED'
    });
  }
})

// TODO: fix validation
export const updateSex = form(z.object({
  sex: z.enum(['male', 'female'])
}), async ({ sex }) => { 
  const { locals: { requestId } } = getRequestEvent();
  const userId = getUserId();

  try {
    await db.update(users).set({
      sex,
      updatedAt: new Date()
    }).where(eq(users.id, userId));
  } catch (err) {
    logError('USER_SEX_UPDATE_FAILED', { requestId, userId, error: err }); 
    
    throw error(500, {
      message: 'Failed to update user sex',
      code: 'USER_SEX_UPDATE_FAILED'
    });
  }
})

export const updatePrivacyLevel = form(z.object({
  privacyLevel: z.enum(["public", "private", "friends-only"], { error: "Invalid privacy level" })
}), async ({ privacyLevel }) => { 
  const { locals: { requestId } } = getRequestEvent();
  const userId = getUserId();

  try {
    await db.update(users).set({
      privacyLevel,
      updatedAt: new Date()
    }).where(eq(users.id, userId));
  } catch (err) {
    logError('USER_PRIVACY_LEVEL_UPDATE_FAILED', { requestId, userId, error: err }); 
    
    throw error(500, {
      message: 'Failed to update user privacy level',
      code: 'USER_PRIVACY_LEVEL_UPDATE_FAILED'
    });
  }
})

export const updateBio = form(z.object({
  bio: z.string().max(300, { error: "You have reached maximum characters amount" })
}), async ({ bio }) => { 
  const { locals: { requestId } } = getRequestEvent();
  const userId = getUserId();

  try {
    await db.update(users).set({
      bio,
      updatedAt: new Date()
    }).where(eq(users.id, userId));
  } catch (err) {
    logError('USER_BIO_UPDATE_FAILED', { requestId, userId, error: err }); 
    
    throw error(500, {
      message: 'Failed to update user bio',
      code: 'USER_BIO_UPDATE_FAILED'
    });
  }
})

// TODO: test this
export const uploadProfilePic = form(z.object({
  file: z.file()
    .max(2_000_000, { error: 'Image must be under 2MB' })
    .mime(["image/jpeg", "image/jpg", "image/png", "image/webp"],
      { error: 'Only image files are allowed' }
    )
}), async ({ file }) => {
  const { locals: { requestId } } = getRequestEvent();
  const userId = getUserId();
  
  if (!file) {
    throw error(400, {
      message: 'No file uploaded',
      code: 'NO_FILE'
    });
  }

  // Validate image
  if (!file.type.startsWith('image/')) {
    throw error(400, {
      message: 'Only image files are allowed',
      code: 'INVALID_FILE_TYPE'
    });
  }

  // Max 2MB
  if (file.size > 2_000_000) {
    throw error(400, {
      message: 'Image must be under 2MB',
      code: 'FILE_TOO_LARGE'
    });
  }

  const filePath = createImagePath(
    userId,
    file,
    'profile'
  );
  
  await uploadFile(
    userId,
    'avatars',
    file,
    filePath
  );

  try {
    await db.update(users)
      .set({
        profilePicPath: filePath,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  } catch (err) {
    // Cleanup uploaded file
    await deleteFile('avatars', [filePath]);
    
    logError('USER_PROFILE_PIC_PATH_UPDATE_FAILED', {
      requestId,
      userId,
      error: err
    });

    throw error(500, {
      message: 'Failed to update user profile picture path',
      code: 'USER_PROFILE_PIC_PATH_UPDATE_FAILED'
    });
  }

  return {
    success: true,
    profilePicPath: filePath
  };
})

function getUserId() {
  const { locals } = getRequestEvent();

  if (!locals.user?.id) {
    throw redirect(303, '/auth/login');
  }

  return locals.user.id;
}