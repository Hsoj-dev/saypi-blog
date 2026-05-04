// src\routes\(app)\[handle]\+layout.server.ts
import { requireUser } from '$lib/remote/auth.remote';
import { getMyProfile, getPublicProfile } from '$lib/remote/profiles.remote';
import { getDatabaseUserByHandle } from '$lib/remote/users.remote';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params }) => {
  const viewer = await requireUser();
  const user = await getDatabaseUserByHandle(params.handle);
  const isOwner = viewer && viewer.id === user.id;
  
  let profile = null;
  
  if (isOwner) {
    profile = await getMyProfile();
  } else {
    if (user.privacyLevel === "public" || user.privacyLevel === "friends-only") {
      profile = await getPublicProfile(user.id);
    };
  }
  
  return {
    user,
    profile,
    isOwner
  };
};