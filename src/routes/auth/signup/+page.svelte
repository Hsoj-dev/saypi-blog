<script lang="ts">
    
    import { signup } from '$lib/remote/auth.remote';
    import { campuses } from '$lib/utils/campus';
    import { levels, sexes } from '$lib/utils/options';

</script>

<h1 class="text-2xl">Sign Up</h1>

<form {...signup}>
    <label class="label">
        Email
        
        {#each signup.fields.email.issues() as issue}
            <p>{issue.message}</p>
        {/each}
        
        <input {...signup.fields.email.as('email')} 
            class="input" 
            placeholder="School Email" 
            required 
            autocomplete="email"
        />
    </label>
    
    <label class="label">
        Username
        
        {#each signup.fields.username.issues() as issue}
            <p>{issue.message}</p>
        {/each}
        
        <input {...signup.fields.username.as('text')} 
            class="input" 
            placeholder="Username" 
            required 
            autocomplete="username"
        />
    </label>
    
    <label class="label">
        Password
        
        {#each signup.fields.password.issues() as issue}
            <p>{issue.message}</p>
        {/each}
        
        <input {...signup.fields.password.as('password')} 
            class="input" 
            placeholder="Password" 
            required 
            autocomplete="new-password"
        />
    </label>
    
    <label class="label">
        First Name
        
        {#each signup.fields.firstName.issues() as issue}
            <p>{issue.message}</p>
        {/each}
        
        <input
            {...signup.fields.firstName.as('text')}
            class="input"
            placeholder="First Name"
            required
        />
    </label>
    
    <label class="label">
        Last Name
        
        {#each signup.fields.lastName.issues() as issue}
            <p>{issue.message}</p>
        {/each}
        
        <input
            {...signup.fields.lastName.as('text')}
            class="input"
            placeholder="Last Name"
            required
        />
    </label>

    <label class="label">
        I am:
        
        {#each signup.fields.sex.issues() as issue}
            <p>{issue.message}</p>
        {/each}
        
        <select
            {...signup.fields.sex.as('select')}
            class="select select-bordered mt-1" 
            required
        >
            <option value="" disabled selected>Select Sex</option>
      		{#each sexes as sex}
     			<option value={sex}>{sex}</option>
      		{/each}
        </select>
    </label>
    
    <label class="label">
        Grade Level
        
        {#each signup.fields.gradeLevel.issues() as issue}
            <p>{issue.message}</p>
        {/each}
        
        <select
            {...signup.fields.gradeLevel.as('select')}
            class="select select-bordered mt-1" 
            required
        >
            <option value="" disabled selected>Grade Level</option>
      		{#each levels as level}
     			<option value={level}>{level}</option>
      		{/each}
        </select>
    </label>
    
    <label class="label">
        Campus
        
        {#each signup.fields.campus.issues() as issue}
            <p>{issue.message}</p>
        {/each}
        
       	<select 
            {...signup.fields.campus.as('select')}
            class="select select-bordered w-full mt-1" 
            required
        >
            <option value="" disabled selected>Select Campus</option>
      		{#each campuses as campus}
     			<option value={campus}>{campus}</option>
      		{/each}
       	</select>
    </label>
    
   	<button class="btn">Create Account</button>
</form>

<svelte:head>
  <title>Saypi | Sign Up</title>
</svelte:head>