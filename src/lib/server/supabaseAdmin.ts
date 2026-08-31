/*
 * Part of the Saypi-Blog project.
 *
 * Copyright (c) 2026 Saypi Studio
 * Licensed under the Saypi-Blog Source Available License 1.0 (SSAL-1.0).
 *
 * See the LICENSE file in the project root for license information.
 */

 import { createClient } from '@supabase/supabase-js';
 import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
 import { PUBLIC_SUPABASE_URL } from '$env/static/public';
 
 export const supabaseAdmin = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
	auth: {
		autoRefreshToken: false,
		persistSession: false
	}
 });