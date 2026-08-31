<!--
  Part of the Saypi-Blog project.

  Copyright (c) 2026 Saypi Studio
  Licensed under the Saypi-Blog Source Available License 1.0 (SSAL-1.0).

  See the LICENSE file in the project root for license information.
-->

<script lang="ts">
    import { resolve } from '$app/paths';
    import { page } from '$app/state';

    const status = $derived(page.status);
    const message = $derived(page.error?.message ?? 'Something went wrong.');
</script>

<svelte:head>
    <title>Saypi-Blog | Error</title>
</svelte:head>

<div class="card card-border border-error bg-base-100 w-sm sm:w-lg shadow-2xl">
    <div class="card-body items-center text-center">
        <div class="text-error">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" x2="12" y1="8" y2="12"/>
                <line x1="12" x2="12.01" y1="16" y2="16"/>
            </svg>
        </div>

        <h1 class="card-title text-lg sm:text-xl">
            {status === 404 ? 'Page not found' : 'Something went wrong'}
        </h1>

        <p class="text-base-content/70">{message}</p>

        <div class="card-actions mt-2 gap-2">
            <a href={resolve("/auth/login")} class="btn btn-primary">Go to Login</a>
            <a href={resolve("/")} class="btn btn-ghost">Back Home</a>
        </div>
    </div>
</div>