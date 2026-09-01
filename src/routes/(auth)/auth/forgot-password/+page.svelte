<!--
  Part of the Saypi-Blog project.

  Copyright (c) 2026 Saypi Studio
  Licensed under the Saypi-Blog Source Available License 1.0 (SSAL-1.0).

  See the LICENSE file in the project root for license information.
-->

<script lang="ts">
	import { resolve } from '$app/paths'; 
    import { sendResetPasswordEmail as action } from '$lib/remote/auth.remote' ;
	import { toast } from 'svoast';
</script>
 
<svelte:head>
  <title>Saypi-Blog | Forgot Password</title>
</svelte:head>

<div class="card card-border border-primary bg-base-100 w-sm sm:w-md shadow-2xl">
    <div class="card-body pb-2">
        <h1 class="card-title text-lg sm:text-xl md:text-[1.4rem] justify-center">
            [ Send Password Reset Email ]
        </h1>
        <form {...action.enhance(async ({ submit }) => {
          try {
              await submit();
              toast.success('Reset Password email sent! Check your inbox.');
          } catch (err: any) {
              const status = err?.status;
              const message = err?.body?.message ?? 'Something went wrong. Please try again.';
      
              if (status === 429) {
                  toast.warning(message);
              } else {
                  toast.error(message);
              }
          }
        })}>
            <fieldset class="fieldset">
                <label class="floating-label" for="email">
                    <span>Email</span>
                    <input {...action.fields.email.as('email')} 
                        class="input validator w-full" 
                        placeholder="Email" 
                        required 
                        autocomplete="email"
                    />
                </label>

                {#each action.fields.email.issues() as issue (issue.message)}
                    <p class="text-error italic">{issue.message}</p>
                {/each}
                
                <div class="card-actions justify-center">
                    <button class="btn btn-primary btn-block mt-1" disabled={!!action.pending} aria-busy={!!action.pending}>
                        {#if action.pending}
                            <span class="loading loading-dots loading-md"></span>
                            <span class="sr-only">Sending Email...</span>
                        {:else}
                            Send Email
                        {/if}
                    </button>
                    <a href={resolve('/auth/login')} class="link link-hover mt-1">Back to login</a>
                </div>
            </fieldset>
        </form>
    </div>
</div>
