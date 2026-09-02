<!--
  Part of the Saypi-Blog project.

  Copyright (c) 2026 Saypi Studio
  Licensed under the Saypi-Blog Source Available License 1.0 (SSAL-1.0).

  See the LICENSE file in the project root for license information.
-->

<script lang="ts">
    import { changePassword } from '$lib/remote/auth.remote';
    import { toast } from 'svoast';

    let showCurrent = $state(false);
    let showNew = $state(false);
</script>

<div class="card card-border border-primary bg-base-100 w-full max-w-md">
    <div class="card-body">
        <h2 class="card-title text-lg">Change Password</h2>

        <form {...changePassword.enhance(async ({ submit, element }) => {
            try {
                const ok = await submit();
                if (!ok) return;
                element.reset();
                toast.success('Password updated. Other devices have been signed out.');
            } catch (err: any) {
                const status = err?.status;
                const message = err?.body?.message ?? 'Something went wrong. Please try again.';
                toast[status === 429 ? 'warning' : 'error'](message);
            }
        })}>
            <fieldset class="fieldset">
                <label class="label" for="_currentPassword">Current Password</label>
                <div class="relative">
                    <input {...changePassword.fields._currentPassword.as('password')}
                        type={showCurrent ? 'text' : 'password'}
                        class="input validator w-full pr-10"
                        placeholder="Current password"
                        required
                        autocomplete="current-password"/>
                    <button type="button"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
                        onclick={() => (showCurrent = !showCurrent)}
                        aria-label={showCurrent ? 'Hide password' : 'Show password'}>
                        {#if showCurrent}
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                        {:else}
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                        {/if}
                    </button>
                </div>
                {#each changePassword.fields._currentPassword.issues() as issue (issue.message)}
                    <p class="text-error italic">{issue.message}</p>
                {/each}

                <label class="label" for="_newPassword">New Password</label>
                <div class="relative">
                    <input {...changePassword.fields._newPassword.as('password')}
                        type={showNew ? 'text' : 'password'}
                        class="input validator w-full pr-10"
                        placeholder="New password"
                        required
                        autocomplete="new-password"/>
                    <button type="button"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
                        onclick={() => (showNew = !showNew)}
                        aria-label={showNew ? 'Hide password' : 'Show password'}>
                        {#if showNew}
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                        {:else}
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                        {/if}
                    </button>
                </div>
                {#each changePassword.fields._newPassword.issues() as issue (issue.message)}
                    <p class="text-error italic">{issue.message}</p>
                {/each}

                <label class="label" for="_confirmPassword">Confirm New Password</label>
                <input {...changePassword.fields._confirmPassword.as('password')}
                    type={showNew ? 'text' : 'password'}
                    class="input validator w-full"
                    placeholder="Confirm new password"
                    required
                    autocomplete="new-password"/>
                {#each changePassword.fields._confirmPassword.issues() as issue (issue.message)}
                    <p class="text-error italic">{issue.message}</p>
                {/each}

                <div class="card-actions mt-2">
                    <button class="btn btn-primary btn-block" disabled={!!changePassword.pending} aria-busy={!!changePassword.pending}>
                        {#if changePassword.pending}
                            <span class="loading loading-dots loading-md"></span>
                            <span class="sr-only">Updating password...</span>
                        {:else}
                            Update Password
                        {/if}
                    </button>
                </div>
            </fieldset>
        </form>
    </div>
</div>

