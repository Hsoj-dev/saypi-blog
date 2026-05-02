<script lang="ts">
    
    import { signup } from '$lib/remote/auth.remote';
    import { campuses } from '$lib/utils/campus';
    import { levels } from '$lib/utils/options';

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
        <form {...signup}> 
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
                
                <!-- TODO: add see password toggle -->
                <label class="label" for="password">Password</label>  
                <input {...signup.fields.password.as('password')} 
                    class="input validator w-full" 
                    placeholder="Password" 
                    required 
                    autocomplete="new-password"/>
                
                {#each signup.fields.password.issues() as issue (issue.message)}
                    <p class="text-error italic">{issue.message}</p>
                {/each}

                <div class="flex flex-row gap-2">
                    <div class="w-1/2">
                        <label class="label" for="firstName">First Name</label>
                        <input
                            {...signup.fields.firstName.as('text')}
                            class="input validator w-full mt-1"
                            placeholder="First Name"
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
                      		{#each levels as level}
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
                      		{#each campuses as campus}
                     			<option value={campus}>{campus}</option>
                      		{/each}
                       	</select>
                        
                        {#each signup.fields.campus.issues() as issue (issue.message)}
                            <p class="text-error italic">{issue.message}</p>
                        {/each}
                    </div>
                </div>
                
                <div class="card-actions">
                  <button class="btn btn-primary btn-block mt-2">Create my Saypi Blog -></button>
                </div>
            </fieldset>
        </form>   
    </div> 
</div>



