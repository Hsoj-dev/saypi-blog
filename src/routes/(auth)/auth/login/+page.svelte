<script lang="ts">
    import { resolve } from '$app/paths';
    import { login } from '$lib/remote/auth.remote';
</script>

<svelte:head>
  <title>Saypi-Blog | Login</title>
</svelte:head>

<div class="card card-border border-primary bg-base-100 w-sm sm:w-lg shadow-2xl">
    <div class="card-body">
        <h1 class="card-title text-lg sm:text-xl md:text-2xl justify-center">
            [ Log In ]
        </h1>

        <!-- TODO: fine tune responsiveness -->
        <form {...login}>
            <fieldset class="fieldset">
                <div class="flex flex-col gap-2">
                    <label class="label" for="identifier">Username or Email</label>
                    <input {...login.fields.identifier.as('text')} 
                        class="input validator w-full" 
                        placeholder="Username or Email" 
                        required 
                    />
        
                    {#each login.fields.identifier.issues() as issue (issue.message)}
                        <p class="text-error italic">{issue.message}</p>
                    {/each}
        
                    <label class="label" for="password">Password</label>
                    <input {...login.fields.password.as('password')} 
                        class="input validator w-full" 
                        placeholder="Password" 
                        required 
                        autocomplete="current-password"
                    />
        
                    {#each login.fields.password.issues() as issue (issue.message)}
                        <p class="text-error italic">{issue.message}</p>
                    {/each}
                    
                    <a class="link link-hover" href={resolve('/auth/forgot-password')}>Forgot your password?</a>
    
                    <div class="card-actions">
                        <button class="btn btn-primary btn-block" disabled={!!login.pending} aria-busy={!!login.pending}>
                            {#if login.pending}
                                <span class="loading loading-dots loading-md"></span>
                                <span class="sr-only">Logging In...</span>
                            {:else}
                                Login
                            {/if}
                        </button>
                    </div>
    
                    <p class="flex justify-center gap-1">
                        Don't have an account?                  
                        <a class="link link-hover" href={resolve('/auth/signup')}> Sign up</a>
                    </p>
                </div>
            </fieldset>
        </form>
    </div>
</div>


