import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  const email = url.searchParams.get('email');

  if (!email) throw redirect(303, '/');

  const isEmail = email.includes('@');
  const isPSHS = email.endsWith('pshs.edu.ph');

  if (!isPSHS || !isEmail) throw redirect(303, '/')

  return {};
};