/*
 * Part of the Saypi-Blog project.
 *
 * Copyright (c) 2026 Saypi Studio
 * Licensed under the Saypi-Blog Source Available License 1.0 (SSAL-1.0).
 *
 * See the LICENSE file in the project root for license information.
 */
 
import { requireUser } from '$lib/remote/auth.remote'
import { redirect, error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types';
import type { EmailOtpType } from '@supabase/supabase-js';
import { logError } from '$lib/helpers/logger';

export const load: PageServerLoad = async ({ url, locals: { supabase, requestId } }) => {
  const token_hash = url.searchParams.get('token_hash');
  const type = url.searchParams.get('type') as EmailOtpType;

  if (!token_hash || !type) {
    throw error(400, {
      message: 'This confirmation link is invalid or incomplete.',
      code: 'INVALID_CONFIRMATION_LINK'
    });
  }

  // Exchange token for session
  const { error: verifyError } = await supabase.auth.verifyOtp({
    token_hash,
    type
  });

  if (verifyError) {
    logError('VERIFY_OTP_ERROR', { requestId, type, error: verifyError });
    throw error(400, {
      message: 'This confirmation link is invalid or has expired. Please try signing up again.',
      code: 'VERIFY_OTP_ERROR'
    });
  }

  const authUser = await requireUser(); 
  const handle = authUser.user_metadata.profileHandle;  

  if (!handle) {
    logError('CONFIRM_MISSING_HANDLE', { requestId, userId: authUser.id });
    throw redirect(303, '/');
  }
  
  throw redirect(303, `/${handle}`);
};