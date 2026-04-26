// src/routes/auth/confirm/+page.server.ts
import { requireUser } from '$lib/remote/auth.remote'
import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types';
import type { EmailOtpType } from '@supabase/supabase-js';

export const load: PageServerLoad = async ({ url, locals: { supabase } }) => {
  const token_hash = url.searchParams.get('token_hash');
  const type = url.searchParams.get('type') as EmailOtpType;

  // TODO: Improve redirect
  if (!token_hash || !type) {
    throw redirect(303, '/auth/auth-code-error');
  }

  // Exchange token for session
  const { error } = await supabase.auth.verifyOtp({
    token_hash,
    type
  });

  // TODO: Improve error handling
  if (error) {
    throw redirect(303, '/auth/auth-code-error');
  }

  const authUser = await requireUser(); 
  const handle = authUser.user_metadata.profileHandle;  
  
  throw redirect(303, `/${handle}`);
};