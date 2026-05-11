<script lang="ts">
	import '../app.css';
	import "@friendofsvelte/tipex/styles/index.css";

	import { invalidate } from '$app/navigation'
	import { onMount } from 'svelte'
	
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

	let { data, children } = $props();
	let { supabase, claims } = $derived(data)

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== claims?.exp) {
				invalidate('supabase:auth')
			}
		})
		return () => data.subscription.unsubscribe()
	})
</script>

<!-- TODO: Improve -->
<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<main>{@render children()}</main>