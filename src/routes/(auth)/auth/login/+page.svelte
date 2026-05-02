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
            [ Login ]
        </h1>

        <!-- TODO: fine tune responsiveness -->
        <form {...login}>
            <div class="flex flex-col gap-2">
                <label class="label" for="identifier">Username or Email</label>
                <input {...login.fields.identifier.as('text')} 
                    class="input w-full" 
                    placeholder="Username or Email" 
                    required 
                />
    
                {#each login.fields.identifier.issues() as issue (issue.message)}
                    <p class="text-error italic">{issue.message}</p>
                {/each}
    
                <label class="label" for="password">Password</label>
                <input {...login.fields.password.as('password')} 
                    class="input w-full" 
                    placeholder="Password" 
                    required 
                    autocomplete="current-password"
                />
    
                {#each login.fields.password.issues() as issue (issue.message)}
                    <p class="text-error italic">{issue.message}</p>
                {/each}

                <div class="flex justify-between">
                    <a class="link link-hover" href={resolve('/auth/forgot-password')}>Forgot your password?</a>
    
                    <a href={resolve('/auth/signup')}>
                        Don't have an account? <span class="link link-hover" >Sign up</span>
                    </a>
                </div>

                <div class="card-actions">
                  <button class="btn btn-primary btn-block mt-2">Login</button>
                </div>
            </div>
        </form>
    </div>
</div>


