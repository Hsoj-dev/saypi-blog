<script lang="ts">
	import '../app.css';
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

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="layout">
    
    <header>
  		<a href="/">Saypi-Blog</a>
    </header>
    	
    <main>
        {@render children()}    
    </main>
    
    <footer>
        {new Date().getFullYear()}
    </footer>
    
</div>