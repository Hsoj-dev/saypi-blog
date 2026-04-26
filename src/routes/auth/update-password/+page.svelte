<script lang="ts">
    
    import { updatePassword as action } from '$lib/remote/auth.remote' ;

</script>

<h1 class="text-2xl">Send Password Reset Email</h1>

<form {...action}>
    
    <label class="label">
        New Password
        
        <input {...action.fields.newPassword.as('password')} 
            class="input" 
            placeholder="Password" 
            required 
        />
        
        {#each action.fields.newPassword.issues() as issue}
            <p>{issue.message}</p>
        {/each}
    </label>
    
    <label>
      Confirm Password
      
      <input {...action.fields.confirmPassword.as('password')} 
          class="input" 
          placeholder="Password" 
          required 
        />
      
      {#each action.fields.confirmPassword.issues() as issue}
          <p>{issue.message}</p>
      {/each}
    </label>
       
   	<button type="submit" class="btn">Reset Password</button>
</form>

<svelte:head>
  <title>Saypi | Reset Password</title>
</svelte:head>