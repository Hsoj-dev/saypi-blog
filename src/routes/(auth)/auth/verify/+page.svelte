<script lang='ts'>
    import { page } from '$app/state';
	import { resendVerificationEmail } from "$lib/remote/auth.remote";
	import { toast } from 'svoast';
	
    let email = page.url.searchParams.get('email');

    let cooldownUntil = $state(0);
    let now = $state(Date.now());
    
    $effect(() => {
        if (cooldownUntil <= now) return;
        const interval = setInterval(() => (now = Date.now()), 1000);
        return () => clearInterval(interval);
    });

    const secondsLeft = $derived(Math.max(0, Math.ceil((cooldownUntil - now) / 1000)));
    const onCooldown = $derived(secondsLeft > 0);

    async function handleResend() {
        if (onCooldown) return;
        cooldownUntil = Date.now() + 30_000; // client-side cooldown, separate from the server rate limit
        try {
            await resendVerificationEmail();
            toast.success('Verification email sent! Check your inbox.');
        } catch (err: any) {
            const status = err?.status;
            const message = err?.body?.message ?? 'Failed to resend email. Please try again.';
            toast[status === 429 ? 'warning' : 'error'](message);
        }
    }
</script>

<svelte:head>
  <title>Saypi-Blog | Verify Account</title>
</svelte:head>

<!-- TODO: add back to login link -->
<div class="card card-border border-primary bg-base-100 w-sm sm:w-lg shadow-2xl">
    <div class="card-body text-center">
        <h1 class="card-title text-lg sm:text-xl md:text-2xl justify-center mb-2">
            [ Verify your Email ]
        </h1>
        
        <p>You're almost there! We sent an email to <br><span class="font-bold">{email}</span></p>
        <br>
        <p>Just click on the link in that email to complete your signup.<br>
            If you don't see it, you may need to
            <span class="font-bold">check your spam</span> folder.
        </p>
        <br>
        <p>Still can't find the email? No problem.</p>

        <div class="card-actions">
            <button class="btn btn-primary mt-3 w-full" 
                disabled={!email || onCooldown}
                aria-busy={onCooldown}
                onclick={handleResend}>
                {#if onCooldown}
                    Resend available in {secondsLeft}s
                {:else}
                    Resend Verification Email
                {/if}
            </button>
        </div>
    </div>
</div>
