<script lang="ts">
	import { logout, requireUser } from "$lib/remote/auth.remote";
	import { getDatabaseUser } from "$lib/remote/users.remote";
	// import { getUserProfile } from "$lib/remote/profiles.remote";
	
	const authUser = await requireUser();
	const user = await getDatabaseUser(authUser.id);
	// const profile = await getUserProfile(authUser.id);
</script>

<p>Welcome, {user.username}!</p>
<form {...logout}>
    <button type="submit" class="btn">Sign Out</button>
</form>

<!-- <form {...deleteAccount}>
    <button type="submit" class="btn">Delete Account</button>
</form> -->

