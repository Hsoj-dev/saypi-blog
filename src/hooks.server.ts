// src/hooks.server.ts
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$env/static/public';
import { createServerClient } from '@supabase/ssr';
import * as Sentry from '@sentry/sveltekit';
import { sequence } from '@sveltejs/kit/hooks';
import { type Handle } from '@sveltejs/kit';

// SENTRY
export const handleError = Sentry.handleErrorWithSentry();

// SUPABASE HOOK
const supabase: Handle = async ({ event, resolve }) => {
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
// TODO: setup auth guard hook

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
// TODO: setup error logging hook

// RATE LIMITING HOOK
// TODO: setup rate limiting hook

export const handle: Handle = sequence(
  //withErrorLogging,   // catch errors from all layers
  Sentry.sentryHandle(),
  supabase,           // attach supabase to locals
  //authGuard,          // protect routes using the session
  withSecurityHeaders // apply security headers
)