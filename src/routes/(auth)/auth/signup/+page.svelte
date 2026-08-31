<!--
  Part of the Saypi-Blog project.

  Copyright (c) 2026 Saypi Studio
  Licensed under the Saypi-Blog Source Available License 1.0 (SSAL-1.0).

  See the LICENSE file in the project root for license information.
-->

<script lang="ts">
    import { signup } from '$lib/remote/auth.remote';
    import { signupSchema } from '$lib/schema/auth';
    import { campuses } from '$lib/utils/campus';
    import { levels } from '$lib/utils/options';
    import { toast } from 'svoast';

    let showPassword = $state(false);
</script>

<svelte:head>
  <title>Saypi-Blog | Sign Up</title>
</svelte:head>

<div class="card card-border border-primary bg-base-100 w-sm sm:w-lg shadow-2xl">
    <div class="card-body">
        <h1 class="card-title text-lg sm:text-xl md:text-2xl justify-center">
            [ Sign Up for Saypi-Blog ]
        </h1>

        <!-- TODO: fine tune responsiveness -->
        <form {...signup.preflight(signupSchema).enhance(async ({ submit }) => {
          try {
              const ok = await submit();
              if (!ok) return; // if success, server redirects to /auth/verify
          } catch (err: any) {
              const status = err?.status;
              const message = err?.body?.message ?? 'Something went wrong. Please try again.';
      
              if (status === 429) {
                  toast.warning(message);
              } else {
                  // 400 INVALID_SIGNUP_DETAILS, 500 AUTH_SIGNUP_FAILED, 500 DATABASE_ERROR
                  toast.error(message);
              }
          }
        })}> 
            <fieldset class="fieldset">
                <label class="label" for="email">Email</label>
                <input {...signup.fields.email.as('email')} 
                    class="input validator w-full" 
                    placeholder="School Email" 
                    required 
                    autocomplete="email"/>

                {#each signup.fields.email.issues() as issue (issue.message)}
                    <p class="text-error italic">{issue.message}</p>
                {/each}

                <label class="label" for="username">Username</label>      
                <input {...signup.fields.username.as('text')} 
                    class="input validator w-full" 
                    placeholder="Username" 
                    required 
                    autocomplete="username"/>

                {#each signup.fields.username.issues() as issue (issue.message)}
                    <p class="text-error italic">{issue.message}</p>
                {/each}
                
                <label class="label" for="_password">Password</label>  
                <div class="relative">
                    <input {...signup.fields._password.as('password')}
                        type={showPassword ? 'text' : 'password'}
                        class="input validator w-full pr-10"
                        placeholder="Password"
                        required
                        autocomplete="new-password"/>
                
                    <button type="button"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
                        onclick={() => (showPassword = !showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}>
                        {#if showPassword}
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                        {:else}
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                        {/if}
                    </button>
                </div>
                
                {#each signup.fields._password.issues() as issue (issue.message)}
                    <p class="text-error italic">{issue.message}</p>
                {/each}

                <div class="flex flex-row gap-2">
                    <div class="w-1/2">
                        <label class="label" for="firstName">Given Name</label>
                        <input
                            {...signup.fields.firstName.as('text')}
                            class="input validator w-full mt-1"
                            placeholder="Given Name"
                            required/>
        
                        {#each signup.fields.firstName.issues() as issue (issue.message)}
                            <p class="text-error italic">{issue.message}</p>
                        {/each}
                    </div>
                    <div class="w-1/2">
                        <label class="label" for="lastName">Last Name</label>
                        <input
                            {...signup.fields.lastName.as('text')}
                            class="input validator w-full mt-1"
                            placeholder="Last Name"
                            required/>

                        {#each signup.fields.lastName.issues() as issue (issue.message)}
                            <p class="text-error italic">{issue.message}</p>
                        {/each}
                    </div>
                </div>
                
                <div class="flex flex-row gap-2">
                    <div class="w-1/4">
                        <label class="label" for="gradeLevel">Grade Level</label>
                        <select
                            {...signup.fields.gradeLevel.as('select')}
                            class="select select-bordered validator mt-1" 
                            required>
                            <option value="" disabled selected>Grade Level</option>
                      		{#each levels as level (level)}
                     			<option value={level}>{level}</option>
                      		{/each}
                        </select>
        
                        {#each signup.fields.gradeLevel.issues() as issue (issue.message)}
                            <p class="text-error italic">{issue.message}</p>
                        {/each}
                    </div>

                    <div class="w-3/4">
                        <label class="label" for="campus">Campus</label>
                       	<select 
                            {...signup.fields.campus.as('select')}
                            class="select select-bordered validator w-full mt-1" 
                            required>
                            <option value="" disabled selected>Select Campus</option>
                      		{#each campuses as campus (campus)}
                     			<option value={campus}>{campus}</option>
                      		{/each}
                       	</select>
                        
                        {#each signup.fields.campus.issues() as issue (issue.message)}
                            <p class="text-error italic">{issue.message}</p>
                        {/each}
                    </div>
                </div>
                
                <div class="card-actions">
                  <button class="btn btn-primary btn-block mt-2" disabled={!!signup.pending} aria-busy={!!signup.pending}>
                      {#if signup.pending}
                          <span class="loading loading-dots loading-md"></span>
                          <span class="sr-only">Creating account...</span>
                      {:else}
                        Create My Account
                      {/if}
                  </button>
                </div>
            </fieldset>
        </form>   
    </div> 
</div>



