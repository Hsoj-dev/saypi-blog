<script lang="ts">
	import { resolve } from "$app/paths";
	
	let { data } = $props();

	let user = $derived(data.user);
    // let profile = $derived(data.profile);
</script>
 
<button class="btn btn-primary"><a href={resolve(`/${user.profileHandle}`)}>Back to Profile</a></button>