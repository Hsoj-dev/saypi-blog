import { db } from '$lib/server/db/db';
import { users } from '$lib/server/db/schema/users';
import { userProfiles } from '$lib/server/db/schema/userProfiles';
import { userInfoPrivacy } from '$lib/server/db/schema/userInfoPrivacy';
import { getCampusCode } from '$lib/utils/campus';

export const createDatabaseUser = async (userId: string, user: any, handle: string) => {
    const exists = await db.query.users.findFirst({
        where: (t, { eq }) => eq(t.id, userId)
    });

    if (exists) return;

    await db.insert(users).values({
        id: userId,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        profileHandle: handle,
        sex: user.sex,
        gradeLevel: Number(user.gradeLevel),
        campus: getCampusCode(user.campus)
    }).onConflictDoNothing();

    await db.insert(userProfiles).values({ userId });
    await db.insert(userInfoPrivacy).values({ userId });
};