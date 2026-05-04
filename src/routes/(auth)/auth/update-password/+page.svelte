<script lang="ts">
    import { updatePassword as action } from '$lib/remote/auth.remote' ;
</script>

<svelte:head>
  <title>Saypi-Blog | Reset Password</title>
</svelte:head>

<div class="card card-border border-primary bg-base-100 w-sm sm:w-lg shadow-2xl">
    <div class="card-body">
        <h1 class="card-title text-lg sm:text-xl md:text-2xl justify-center">
            [ Reset Password ]
        </h1>
        
        <form {...action}>
            <fieldset class="fieldset">
                <label class="label" for="newPassword">New Password</label>
                <input {...action.fields.newPassword.as('password')} 
                    class="input validator w-full" 
                    placeholder="Password" 
                    required 
                />
            
                {#each action.fields.newPassword.issues() as issue (issue.message)}
                    <p class="text-error italic">{issue.message}</p>
                {/each}

                <label class="label" for="confirmPassword">Confirm Password</label>
                <input {...action.fields.confirmPassword.as('password')} 
                    class="input validator w-full" 
                    placeholder="Password" 
                    required 
                    />
            
                {#each action.fields.confirmPassword.issues() as issue (issue.message)}
                    <p class="text-error italic">{issue.message}</p>
                {/each}

                <div class="card-actions">
                    <button class="btn btn-primary btn-block mt-1" disabled={!!action.pending} aria-busy={!!action.pending}>
                        {#if action.pending}
                            <span class="loading loading-dots loading-md"></span>
                            <span class="sr-only">Resetting Password...</span>
                        {:else}
                            Reset Password
                        {/if}
                    </button>
                </div>
            </fieldset>
        </form>
    </div>
</div>