<!-- src\routes\+page.svelte -->
<!-- TODO: Improve -->
<script lang='ts'>
	import Main from "$lib/components/layout/public/Main.svelte";

	let { data } = $props();
</script>

<svelte:head>
  <title>Saypi-Blog | The Social Blogging Platform made for Pisay Scholars.</title>
</svelte:head>

{#if data.claims}
    <p>Logged In</p>
{:else}
    <Main />
{/if}
