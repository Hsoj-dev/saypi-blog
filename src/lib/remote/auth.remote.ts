// src/lib/server/remote/auth.remote.ts
import { form, query, command, getRequestEvent } from '$app/server'
import { redirect, error } from '@sveltejs/kit'
import { signupSchema, loginSchema, updatePasswordSchema } from '$lib/schema/auth';
import { AuthApiError } from '@supabase/supabase-js';
import { createDatabaseUser } from '$lib/helpers/userCreation';
import { getProfileHandle } from '$lib/utils/profile';
import { logError, logInfo } from '$lib/helpers/logger';
import { db } from '$lib/server/db/db';
import { z } from 'zod';

export const signup = form(signupSchema, async (user) => {
  const { url, locals: { supabase, requestId } } = getRequestEvent();

 	// HELPERS
  const handle = getProfileHandle(user.firstName, user.lastName);
  
	const registerAuthUser = async (email: string, password: string) => {
		const { data, error: authError } = await supabase.auth.signUp({
			email,
      password,
      options: {
        emailRedirectTo: `${url.origin}`, // TODO: add env website name
        data: {  
          profileHandle: handle
        } 
      }
		});

    if (authError) {
      throw authError
    };
    
		return data.user;
  };

	// AUTH SIGNUP 
	let authUser;

	try {
    authUser = await registerAuthUser(user.email, user.password);
    
    logInfo('USER_REGISTERED', {
      requestId: requestId,
      userId: authUser?.id,
      email: authUser?.email,
      username: user.username
    });
  } catch (err) {
    logError('SIGNUP_ERROR', { requestId, error: err });

		if (err instanceof AuthApiError && err.status === 400) {
      throw error(400, {
        message: 'Invalid email or password',
        code: 'INVALID_SIGNUP_DETAILS'
      });  
    }
		
    throw error(500, {
      message: 'Unable to create account. Please try again.',
      code: 'AUTH_SIGNUP_FAILED'
    });
  }
	
  if (!authUser) {
    throw error(500, {
      message: 'Signup failed: missing auth user',
      code: 'AUTH_SIGNUP_FAILED'
    });
  }
  
 	// CREATE DATABASE USER
  try {
    await createDatabaseUser(authUser.id, user, handle);
	} catch (err) {
    logError('DATABASE_ERROR', { requestId, userId: authUser.id, error: err });
		
    throw error(500, {
      message: 'Failed to create user profile',
      code: 'DATABASE_ERROR'
    });
  }
	
  throw redirect(303, `/auth/verify?email=${encodeURIComponent(user.email)}`);
})

export const login = form(loginSchema, async ({ identifier, password }) => {
  const { locals: { supabase, requestId } } = getRequestEvent();
  
  let email = identifier;
  const isEmail = z.email().safeParse(identifier).success; // TODO: check if the email is a pisay email
	
  if (!isEmail) {
    const dbUser = await db.query.users.findFirst({
      columns: { email: true },
      where: (users, { eq }) => eq(users.username, identifier)
    });
    
    if (!dbUser?.email) {
      throw error(400, {
        message: 'Invalid username or password',
        code: 'INVALID_LOGIN'
      });
    }
    
    email = dbUser?.email;
  }
  
  const { data, error: err } = await supabase.auth.signInWithPassword({
      email,
      password
  }) 
  
  if (err) {
    logError('LOGIN_ERROR', { requestId, userIdentifier: identifier, error: err }); // TODO: add login attempt number
    
    if (err instanceof AuthApiError && err.status === 400) {
      throw error(400, {
        message: 'Invalid username or password',
        code: 'INVALID_LOGIN'
      });  
    }
    
    throw error(500, {
      message: 'Server error. Please try again later.',
      code: 'AUTH_LOGIN_FAILED'
    });
  }

  logInfo('USER_LOGIN', {
    requestId,
    userId: data.user.id,
    userIdentifier: identifier
  });
  
  // TODO: add check login number attempts
  // Options:
  // Rate limit by IP
  // Rate limit by username
  // Temporary account lockout
  
	throw redirect(303, '/');
})

export const logout = form(async () => {
  const { locals } = getRequestEvent()

  const { error: err } = await locals.supabase.auth.signOut();
  
  if (err) {
    logError('LOGOUT_ERROR', { requestId: locals.requestId, error: err });
    
    throw error(500, {
      message: 'Failed to log out',
      code: 'AUTH_LOGOUT_ERROR'
    });
  }
  
  logInfo('USER_LOGOUT', {
    requestId: locals.requestId,
    userId: locals.session?.user.id,
  });
  
  locals.session = null;
  locals.user = null;
  
	throw redirect(303, '/auth/login')
})

export const sendResetPasswordEmail = form(z.object({
  email: z.email().endsWith("pshs.edu.ph", { error: "Please use your PSHS email" })
}), async ({ email }) => {
  const { url, locals: { supabase, requestId } } = getRequestEvent()
  
  const { data, error: err } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${url.origin}/auth/update-password`
  });
  
  if (data) {
    logInfo('RESET_PASSWORD_EMAIL_SENT', {
      requestId,
      whereTo: email
    }); 
  }
  
  if (err) {
    logError('RESET_PASSWORD_EMAIL_ERROR', { requestId, whereTo: email, error: err });

    throw error(500, {
      message: 'Failed to send reset password email',
      code: 'RESET_PASSWORD_EMAIL_ERROR'
    });
  }
  
  return { success: true };
})

export const updatePassword = form(updatePasswordSchema, async ({ newPassword }) => {
  const { locals: { supabase, requestId } } = getRequestEvent()
  
  const { data: temp } = await supabase.auth.getSession();
  
  if (!temp.session) {
    throw redirect(303, '/auth/login');
  }
  
  const { data, error: updateUserError } = await supabase.auth.updateUser({
    password: newPassword
  })
  
  if (updateUserError) {
    logError('PASSWORD_UPDATE_ERROR', { requestId, error: updateUserError });

    throw error(500, {
      message: 'Failed to update password',
      code: 'PASSWORD_UPDATE_ERROR'
    });
  }
  
  if (data) {
    logInfo('PASSWORD_UPDATE', {
      requestId,
      userId: temp.session.user.id
    }); 
  }
  
  const { error: signOutError } = await supabase.auth.signOut();

  if (signOutError) {
    logError('LOGOUT_ERROR', { requestId, error: signOutError });

    throw error(500, {
      message: 'Failed to log out',
      code: 'AUTH_LOGOUT_ERROR'
    });
  }
  
  throw redirect(303, '/auth/login')
})

// TODO: Implement this after v1
// export const deleteAccount = form("unchecked", async (passwords) => {
//   const { locals: { supabase } } = getRequestEvent()
  
  
// })

export const resendVerificationEmail = command(async () => {
  const { url, locals: { supabase, requestId } } = getRequestEvent()
  
  // Try to get the email from the current session first
  const { data: { user } } = await supabase.auth.getUser();
  let email = user?.email;

  // Fallback to URL only if session doesn't exist
  if (!email) email = url.searchParams.get('email') ?? undefined;

  if (!email) throw redirect(303, '/');
  
  const { data, error: err } = await supabase.auth.resend({ type: 'signup', email })
  
  if (err) {
    logError('RESEND_VERIFICATION_EMAIL_FAILED', { requestId, whereTo: email, error: err });

    throw error(500, {
      message: 'Failed to resend verification email',
      code: 'RESEND_VERIFICATION_EMAIL_FAILED'
    });
  }

  if (data) {
    logInfo('RESEND_VERIFICATION_EMAIL', {
      requestId,
      whereTo: email
    }); 
  }
  
  return { success: true };
})

export const requireUser = query(async () => {
  const { locals } = getRequestEvent()
	
	if (!locals.user) {
		throw redirect(303, '/auth/login')
  }
	
	return locals.user
})

export const getUser = query(async () => {
  const { locals } = getRequestEvent()
  return locals.user
})
