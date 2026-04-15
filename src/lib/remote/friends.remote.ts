// src/lib/remote/friends.remote.ts
import { query, command, getRequestEvent } from '$app/server';
import { db } from '$lib/server/db/db';
import { friends } from '$lib/server/db/schema/friends';
import { and, eq, or } from 'drizzle-orm';

// getUserFriends
// getUserFriendsCount
// getUserBlockedPeople
// getUserPendingRequests
// sendFriendRequest
// updateFriendshipStatus
// what else?