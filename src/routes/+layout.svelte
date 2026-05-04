<script lang="ts">
	import '../app.css';
	import "@friendofsvelte/tipex/styles/index.css";
	import favicon from '$lib/assets/favicon.svg';

	import { dev } from '$app/environment';
    import { injectAnalytics } from '@vercel/analytics/sveltekit';
    import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
    
    injectAnalytics({ 
      mode: dev ? 'development' : 'production',
      debug: dev ? false : true,
    });
    injectSpeedInsights({
      debug: dev ? false : true,
    });

	let { children } = $props();
</script>

<!-- TODO: Improve -->
<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="layout">
    <main>
        {@render children()}    
    </main>
</div>