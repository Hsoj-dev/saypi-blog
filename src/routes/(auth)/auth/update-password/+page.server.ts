/*
 * Part of the Saypi-Blog project.
 *
 * Copyright (c) 2026 Saypi Studio
 * Licensed under the Saypi-Blog Source Available License 1.0 (SSAL-1.0).
 *
 * See the LICENSE file in the project root for license information.
 */
 
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { logError } from '$lib/helpers/logger';

const RECOVERY_COOKIE = 'pwd_recovery';

export const load: PageServerLoad = async ({ url, cookies, locals: { supabase, requestId } }) => {
  
  const code = url.searchParams.get('code');

  if (code) {
    const { error: err } = await supabase.auth.exchangeCodeForSession(code);
    
    if (err) {
      logError('EXCHANGE_CODE_FOR_SESSION_ERROR', { requestId, error: err });
      
      throw error(500, {
        message: 'Failed to exchange code for session',
        code: 'EXCHANGE_CODE_FOR_SESSION_ERROR'
      });
    }

    // Mark this browser as having a legitimate password-recovery session
    cookies.set(RECOVERY_COOKIE, '1', {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 10 // 10 minutes
    });
    
    throw redirect(303, '/auth/update-password');
  }
  
  const { data: temp } = await supabase.auth.getSession();
  
  if (!temp.session || !cookies.get(RECOVERY_COOKIE)) {
    throw redirect(303, '/auth/login');
  }
  
  return {};
};