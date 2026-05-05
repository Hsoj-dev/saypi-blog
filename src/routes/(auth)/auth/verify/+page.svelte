<script lang='ts'>
    import { page } from '$app/state';
	import { resendVerificationEmail } from "$lib/remote/auth.remote";
	
    let email = page.url.searchParams.get('email');
</script>

<svelte:head>
  <title>Saypi-Blog | Verify Account</title>
</svelte:head>

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

        <!-- TODO: Add button disabled -->
        <!-- TODO: Add toasts -->
        <div class="card-actions">
            <button class="btn btn-primary mt-3 w-full" disabled={!email}
                onclick={async() => { await resendVerificationEmail() }}>
                Resend Verification Email
            </button>
        </div>
    </div>
</div>
