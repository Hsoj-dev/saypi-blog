<!--
  Part of the Saypi-Blog project.

  Copyright (c) 2026 Saypi Studio
  Licensed under the Saypi-Blog Source Available License 1.0 (SSAL-1.0).

  See the LICENSE file in the project root for license information.
-->

<script lang='ts'>
  import { Toasts } from 'svoast';
  let { children } = $props();
</script>

<Toasts />

<div class="hero bg-base-200 min-h-screen grid-bg">
    <div class="hero-content">
        <main>
            {@render children()}    
        </main>
    </div>
</div>