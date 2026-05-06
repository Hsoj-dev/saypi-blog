<script lang='ts'>

  import Footer from '$lib/components/layout/public/Footer.svelte';
  import Navbar from '$lib/components/layout/public/Navbar.svelte';

  let { children } = $props();
</script>

<div class="layout">
    <header>
        <Navbar />
    </header>
    	
    <div class="hero bg-base-200 min-h-[calc(100vh-4rem)] grid-bg">
        <div class="hero-content text-center">
            <main>
                {@render children()}    
            </main>
        </div>
    </div>
    
    <footer>
        <Footer />
    </footer>
</div>