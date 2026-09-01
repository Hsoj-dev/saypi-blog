<!-- src\routes\(app)\[handle]\+page.svelte -->
<script lang="ts">
	import { resolve } from "$app/paths";
    import { logout } from "$lib/remote/auth.remote";
	import { updateBasicInfo, updatePersonalInfo, updateStatusUpdate, updateStudentInfo } from "$lib/remote/profiles.remote";
   	import Avatar from "$lib/components/Avatar.svelte";
    import { toast } from "svoast";
     
	let { data } = $props();
	
	let user = $derived(data.user);
    let profile = $derived(data.profile);
    let isOwner = $derived(data.isOwner);
    // let isOwner = false;
</script>

<svelte:head>
  <title>{user.username} - Saypi-Blog</title>
</svelte:head>

<p>Welcome, {user.username}!</p>
<p>My profile: {profile}</p>

<form {...logout.enhance(async ({ submit }) => {
    try {
        await submit();
    } catch (err: any) {
        const message = err?.body?.message ?? 'Failed to log out. Please try again.';
        toast.error(message);
    }
})}>
    <button type="submit" class="btn" disabled={!!logout.pending} aria-busy={!!logout.pending}>
        {#if logout.pending}
            <span class="loading loading-dots loading-md"></span>
            <span class="sr-only">Logging out...</span>
        {:else}
            Sign Out
        {/if}
    </button>
</form>

{#if user}
    <!-- YOU -->
    {#if isOwner}
        <button class="btn btn-primary"><a href={resolve(`/${user.profileHandle}/edit`)}>Edit Profile</a></button>
        <form {...updateStatusUpdate} oninput={() => updateStatusUpdate.validate()}>
            <label class="label">
                Status Update
        
                <textarea {...updateStatusUpdate.fields.statusUpdate.as('text')}
                class="input">{profile?.statusUpdate}</textarea>
        
                {#each updateStatusUpdate.fields.statusUpdate.issues() as issue (issue.message)}
                  <p class="text-error">{issue.message}</p>
                {/each}
            </label>
        
            <button class="btn">Edit</button>
        </form>
    
        <form {...updateBasicInfo}>
            <label class="label">
                Basic Info
                <input class="input" type="text">
            </label>
        
            <button class="btn">Edit Info</button>
        </form>
    
        <form {...updateStudentInfo}>
            <label class="label">
                Student Info
                <input class="input" type="text">
            </label>
        
            <button class="btn">Edit Info</button>
        </form>
    
        <form {...updatePersonalInfo}>
            <label class="label">
                Personal Info
                <input class="input" type="text">
            </label>
        
            <button class="btn">Edit Info</button>
        </form>

        <Avatar />
    <!-- SOMEONE ELSE -->
    {:else}
        <p>{profile?.statusUpdate}</p>
    {/if}
{:else}
    <!-- TODO: Improve -->
    <p>No User</p>
{/if}
