<script lang='ts'>
  let { children } = $props();
</script>

<div class="hero bg-base-200 min-h-screen grid-bg">
    <div class="hero-content">
        <main>
            {@render children()}    
        </main>
    </div>
</div>