// src/routes/auth/update-password/+page.server.ts
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { logError } from '$lib/helpers/logger';

export const load: PageServerLoad = async ({ url, locals: { supabase, requestId } }) => {
  
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
    
    throw redirect(303, '/auth/update-password');
  }
  
  const { data: temp } = await supabase.auth.getSession();
  
  if (!temp.session) {
    throw redirect(303, '/auth/login');
  }
  
  return {};
};