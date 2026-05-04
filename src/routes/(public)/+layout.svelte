<script lang='ts'>

  import Footer from '$lib/components/layout/public/Footer.svelte';
  import Navbar from '$lib/components/layout/public/Navbar.svelte';

  let { children } = $props();
</script>

<div class="layout">
    <header>
        <Navbar />
    </header>
    	
    <main>
        {@render children()}    
    </main>
    
    <footer>
        <Footer />
    </footer>
</div>