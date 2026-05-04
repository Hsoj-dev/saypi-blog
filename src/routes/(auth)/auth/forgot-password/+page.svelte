<script lang="ts">
	import { resolve } from '$app/paths'; 
    import { sendResetPasswordEmail as action } from '$lib/remote/auth.remote' ;
</script>
 
<svelte:head>
  <title>Saypi-Blog | Forgot Password</title>
</svelte:head>

<div class="card card-border border-primary bg-base-100 w-sm sm:w-md shadow-2xl">
    <div class="card-body pb-2">
        <h1 class="card-title text-lg sm:text-xl md:text-[1.4rem] justify-center">
            [ Send Password Reset Email ]
        </h1>
        <form {...action}>
            <fieldset class="fieldset">
                <label class="floating-label" for="email">
                    <span>Your Email</span>
                    <input {...action.fields.email.as('text')} 
                        class="input validator w-full" 
                        placeholder="Email" 
                        required 
                    />
                </label>

    
                {#each action.fields.email.issues() as issue (issue.message)}
                    <p class="text-error italic">{issue.message}</p>
                {/each}
                
                <div class="card-actions justify-center">
                    <button class="btn btn-primary btn-block mt-1">Send Email</button>
                    <a href={resolve('/auth/login')} class="link link-hover mt-1">Back to login</a>
                </div>
            </fieldset>
        </form>
    </div>
</div>
