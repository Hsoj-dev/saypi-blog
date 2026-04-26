<script lang="ts">
    
    import { resolve } from '$app/paths';
    import { login } from '$lib/remote/auth.remote';

</script>

<h1 class="text-2xl">Login</h1>

<form {...login}>
    
    <label class="label">
        Identifier
        
        {#each login.fields.identifier.issues() as issue}
            <p>{issue.message}</p>
        {/each}
        
        <input {...login.fields.identifier.as('text')} 
            class="input" 
            placeholder="Username or Email" 
            required 
        />
    </label>
    
    <label class="label">
        Password
        
        <input {...login.fields.password.as('password')} 
            class="input" 
            placeholder="Password" 
            required 
            autocomplete="current-password"
        />
        
        {#each login.fields.password.issues() as issue}
            <p>{issue.message}</p>
        {/each}
    </label>
       
   	<button type="submit" class="btn">Login</button>
</form>

<p>
	Don't have an account?
	<a href={resolve('/auth/signup')}>Sign up</a>
</p>
		
<a href={resolve('/auth/forgot-password')}>Forgot password?</a>

<svelte:head>
  <title>Saypi | Login</title>
</svelte:head>