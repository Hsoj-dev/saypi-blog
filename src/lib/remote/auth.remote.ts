// src/lib/server/remote/auth.remote.ts
import { form, query, command, getRequestEvent } from '$app/server'
import { redirect, error } from '@sveltejs/kit'
import { signupSchema, loginSchema } from '$lib/schema/auth';
import { AuthApiError } from '@supabase/supabase-js';
import { createDatabaseUser } from '$lib/helpers/userCreation';
import { getProfileHandle } from '$lib/utils/profile';
import { logError, logInfo } from '$lib/helpers/logger';

export const signup = form(signupSchema, async (user) => {
  const { locals: { supabase, requestId } } = getRequestEvent();

 	// ------------------- HELPERS -------------------
	const registerAuthUser = async (email: string, password: string) => {
		const { data, error: authError } = await supabase.auth.signUp({
			email,
			password
		});

    if (authError) {
      throw authError
    };
    
		return data.user;
  };
	
	const handle = getProfileHandle(user.firstName, user.lastName);

	// ------------------- AUTH SIGNUP -------------------
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
        code: 'SUPABASE_SIGNUP_FAILED'
      });
    }
  
 	// ------------------- CREATE DATABASE USER -------------------
  try {
    await createDatabaseUser(authUser.id, user, handle);
	} catch (err) {
    logError('DATABASE_ERROR', { requestId, userId: authUser.id, error: err });
		
    throw error(500, {
      message: 'Failed to create user profile',
      code: 'DATABASE_ERROR'
    });
  }
  
  // TODO: signup failed attempt
	
  // ------------------- REDIRECT ------------------- 
  throw redirect(303, '/auth/verify');
})

export const logout = command(async () => {
	const { locals } = getRequestEvent()

  const { error: err } = await locals.supabase.auth.signOut();
  
  if (err) {
    console.error('Error during logout:', err); // TODO: proper logging to appear in sentry dashboard
    
    throw error(500, {
      message: 'Failed to log out',
      code: 'AUTH_LOGOUT_ERROR'
    });
  }
  
  locals.session = null;
  locals.user = null;
  
	throw redirect(303, '/auth/login')
})

export const getUser = query(async () => {
	const { locals } = getRequestEvent()
	if (!locals.user) {
		throw redirect(307, '/auth/login')
	}
	return locals.user
})