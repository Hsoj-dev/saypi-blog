// src\routes\+layout.server.ts
import { getRequestEvent } from '$app/server';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
  const { locals: { session } } = getRequestEvent();
  
  return {
    session
  };
};