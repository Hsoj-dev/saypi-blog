// src/hooks.server.ts
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$env/static/public';
import { createServerClient } from '@supabase/ssr';
import * as Sentry from '@sentry/sveltekit';
import { sequence } from '@sveltejs/kit/hooks';
import { type Handle, isRedirect, redirect } from '@sveltejs/kit';

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
  '/auth/forgotPassword'
]

const AUTHENTICATED_ONLY_PREFIXES = [
  '/blog',
  '/@'
]

// SENTRY
export const handleError = Sentry.handleErrorWithSentry();

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
        /**
         * Note: You have to add the `path` variable to the
         * set and remove method due to sveltekit's cookie API
         * requiring this to be set, setting the path to an empty string
         * will replicate previous/standard behavior (https://kit.svelte.dev/docs/types#public-types-cookies)
         */
        cookiesToSet.forEach(({ name, value, options }) => {
          event.cookies.set(name, value, { ...options, path: '/' })
        })
      },
    },
  })

  /**
   * Unlike `supabase.auth.getSession()`, which returns the session _without_
   * validating the JWT, this function also calls `getUser()` to validate the
   * JWT before returning the session.
   */
  event.locals.safeGetSession = async () => {
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
  const { session, user } = await event.locals.safeGetSession()
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
    Sentry.captureException(error)
    
    if (isRedirect(error)) {
      throw error
    }
    
    const err = error instanceof Error
      ? error
      : new Error(String(error))
    
    console.error('Server error:', {
      message: err.message,
      stack: err.stack,
      url: event.url.pathname,
      userId: event.locals.user?.id,
      sessionId: event.locals.session?.access_token,
      method: event.request.method,
      userAgent: event.request.headers.get('user-agent'),
      ip: event.getClientAddress?.() ?? "unknown",
      timestamp: new Date().toISOString(),
    })
    
    throw error
  }
}

// RATE LIMITING HOOK
// TODO: setup rate limiting hook

export const handle: Handle = sequence(
  Sentry.sentryHandle(), // capture all errors
  withErrorLogging,      // structured logs
  // withRateLimiting,      // block abusive traffic
  withSecurityHeaders,   // apply headers
  withSupabase,          // create supabase client
  withAuthGuard          // protect routes
)