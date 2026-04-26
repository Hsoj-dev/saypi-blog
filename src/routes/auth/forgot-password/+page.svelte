<script lang="ts">
    
    import { sendResetPasswordEmail as action } from '$lib/remote/auth.remote' ;

</script>

<h1 class="text-2xl">Send Password Reset Email</h1>

<form {...action}>
    
    <label class="label">
        Email
        
        <input {...action.fields.email.as('text')} 
            class="input" 
            placeholder="Email" 
            required 
        />
        
        {#each action.fields.email.issues() as issue}
            <p>{issue.message}</p>
        {/each}
    </label>
       
   	<button type="submit" class="btn">Send Email</button>
</form>

<svelte:head>
  <title>Saypi | Forgot Password</title>
</svelte:head>