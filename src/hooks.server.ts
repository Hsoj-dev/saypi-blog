/*
 * Part of the Saypi-Blog project.
 *
 * Copyright (c) 2026 Saypi Studio
 * Licensed under the Saypi-Blog Source Available License 1.0 (SSAL-1.0).
 *
 * See the LICENSE file in the project root for license information.
 */

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$env/static/public';
import { createServerClient } from '@supabase/ssr';
import * as Sentry from '@sentry/sveltekit';
import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from '$env/static/private';
import { sequence } from '@sveltejs/kit/hooks';
import { type Handle, isRedirect, redirect } from '@sveltejs/kit';

// TODO: Update routes
const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/privacy',
  '/terms',
  '/robots.txt',
]

const AUTH_ROUTES = [
  '/auth/login', 
  '/auth/signup',
  '/auth/verify',
  '/auth/forgot-password'
]

const AUTHENTICATED_ONLY_PREFIXES = [
  '/blog',
  '/@'
]

// SENTRY
export const handleError = Sentry.handleErrorWithSentry();

// REQUEST ID HOOK
const withRequestId: Handle = async ({ event, resolve }) => {
  event.locals.requestId = crypto.randomUUID();
  
  const response = await resolve(event)

  response.headers.set('x-request-id', event.locals.requestId);
	
  return response
};

// SUPABASE HOOK
const withSupabase: Handle = async ({ event, resolve }) => {
  /**
   * Creates a Supabase client specific to this server request.
   *
   * The Supabase client gets the Auth token from the request cookies.
   */
  event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll: () => event.cookies.getAll(),
      /**
       * SvelteKit's cookies API requires `path` to be explicitly set in
       * the cookie options. Setting `path` to `/` replicates previous/
       * standard behavior.
       */
      /**
       * Note: You have to add the `path` variable to the
       * set and remove method due to sveltekit's cookie API
       * requiring this to be set, setting the path to an empty string
       * will replicate previous/standard behavior (https://kit.svelte.dev/docs/types#public-types-cookies)
       */
      setAll: (cookiesToSet) => {
        // "Remember me" preference, set at login and read on every request
        // (including silent token refreshes) so it survives beyond the login
        // request itself. Default to persistent (current behavior) if the
        // preference cookie is missing - e.g. for anyone with an existing
        // session from before this feature shipped.
        const rememberMe = event.cookies.get('remember_me') !== '0';
        
        /**
         * Note: You have to add the `path` variable to the
         * set and remove method due to sveltekit's cookie API
         * requiring this to be set, setting the path to an empty string
         * will replicate previous/standard behavior (https://kit.svelte.dev/docs/types#public-types-cookies)
         */
        cookiesToSet.forEach(({ name, value, options }) => {
          const finalOptions = { ...options, path: '/' };
      
          if (!rememberMe) {
            delete finalOptions.maxAge;
            delete finalOptions.expires;
          }
      
          event.cookies.set(name, value, finalOptions);
        })
      },
    },
  })

  /**
   * Unlike `supabase.auth.getSession()`, which returns the session _without_
   * validating the JWT, this function also calls `getUser()` to validate the
   * JWT before returning the session.
   */
  event.locals.getValidatedSession = async () => {
    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession()

    if (!session) { return { session: null, user: null } }

    const {
      data: { user },
      error,
    } = await event.locals.supabase.auth.getUser()

    if (error) {
      // JWT validation has failed
      return { session: null, user: null }
    }
        
    return { 
      session, 
      user,
    }
  }

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      /**
       * Supabase libraries use the `content-range` and `x-supabase-api-version`
       * headers, so we need to tell SvelteKit to pass it through.
       */
      return name === 'content-range' || name === 'x-supabase-api-version'
    },
  })
}

// AUTH GUARD HOOK
// TODO: Improve this hook
const withAuthGuard: Handle = async ({ event, resolve }) => {
  const { session, user } = await event.locals.getValidatedSession()
  event.locals.session = session
  event.locals.user = user
  
  const path = event.url.pathname
  
  // Redirect logged-in users away from auth routes
  if (session && AUTH_ROUTES.includes(path)) {
    throw redirect(303, '/')
  }
  
  // ----------------------------
  // 1. Public routes
  // ----------------------------
  if (PUBLIC_ROUTES.includes(path)) {
    return await resolve(event)
  }
  
  // ----------------------------
  // 2. Private admin/mod routes
  // ----------------------------
  if (path.startsWith('/private')) {
    if (!session) throw redirect(303, '/auth/login') // Redirect unauthenticated users to the login page

    if (
      user?.role !== 'admin'
    ) {
      throw redirect(303, '/')
    }

    return await resolve(event)
  }
  
  // ----------------------------
  // 3. Authenticated-only routes???
  // ----------------------------
  const requiresAuth = AUTHENTICATED_ONLY_PREFIXES.some(prefix => path.startsWith(prefix))

  if (requiresAuth && !session) {
    throw redirect(303, '/auth/login')
  }
  
  return await resolve(event)
}

// SECURITY HEADERS HOOK
const withSecurityHeaders: Handle = async ({ event, resolve }) => {
  const response = await resolve(event)

	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
	
  return response
};

// ERROR LOGGING HOOK
const withErrorLogging: Handle = async ({ event, resolve }) => {
  try {
    return await resolve(event)
  } catch (error) {
    if (isRedirect(error)) {
      throw error
    }
    
    Sentry.captureException(error)
    
    const err = error instanceof Error
      ? error
      : new Error(String(error))
    
    console.error('Server error:', {
      timestamp: new Date().toISOString(),
      message: err.message,
      userId: event.locals.user?.id,
      ip: event.getClientAddress?.() ?? "unknown",
      stack: err.stack,
      url: event.url.pathname,
      method: event.request.method,
      userAgent: event.request.headers.get('user-agent'),
    })
    
    throw error
  }
}

// CLOUDINARY HOOK
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true
});

export const withCloudinary: Handle = async ({ event, resolve }) => {
  event.locals.cloudinary = cloudinary;
  return resolve(event);
};

export const handle: Handle = sequence(
  Sentry.sentryHandle(), // capture all errors
  withRequestId,         // assign request id
  withErrorLogging,      // structured logs
  withSecurityHeaders,   // apply headers
  withSupabase,          // create supabase client
  withCloudinary,        // create cloudinary client
  withAuthGuard          // protect routes
)