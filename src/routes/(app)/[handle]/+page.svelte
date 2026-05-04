<!-- src/routes/[handle]/+page.svelte -->
<script lang="ts">
	import { resolve } from "$app/paths";
    import { logout } from "$lib/remote/auth.remote";
	import { updateBasicInfo, updatePersonalInfo, updateStatusUpdate, updateStudentInfo } from "$lib/remote/profiles.remote";
    
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
<form {...logout}>
    <button type="submit" class="btn">Sign Out</button>
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

    <!-- SOMEONE ELSE -->
    {:else}
        <p>{profile?.statusUpdate}</p>
    {/if}
{:else}
    <!-- TODO: Improve -->
    <p>No User</p>
{/if}
