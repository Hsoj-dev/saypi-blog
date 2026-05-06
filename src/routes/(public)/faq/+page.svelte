<script lang='ts'>
	import { resolve } from "$app/paths";
</script>

<svelte:head>
  <title>Saypi-Blog | FAQ</title>
</svelte:head>

<h1 class="text-2xl sm:text-3xl md:text-4xl font-bold m-6">
    [ FAQ ]
</h1>

<!-- TODO: add more faqs -->
<div class="w-sm md:w-xl lg:w-2xl text-left">
    <details class="collapse collapse-arrow bg-base-100 border-2 border-primary" name="accordion">
      <summary class="collapse-title font-semibold">What is Saypi-Blog?</summary>
      <div class="collapse-content text-sm">Saypi-Blog is a social blogging platform made for Pisay scholars.</div>
    </details>
    <br>  
    <details class="collapse collapse-arrow bg-base-100 border-2 border-primary" name="accordion">
      <summary class="collapse-title font-semibold">Who made this site?</summary>
      <div class="collapse-content text-sm">See the <a href={resolve('/about')} class="link">about</a> page.</div>
    </details>
    <br>
    <details class="collapse collapse-arrow bg-base-100 border-2 border-primary" name="accordion">
      <summary class="collapse-title font-semibold">Is this a class project?</summary>
      <div class="collapse-content text-sm">Nope, just for fun.</div>
    </details>
    <br>
    <details class="collapse collapse-arrow bg-base-100 border-2 border-primary" name="accordion">
      <summary class="collapse-title font-semibold">I have a question that's not covered in the FAQ. How can I ask it?</summary>
      <div class="collapse-content text-sm">Email us.</div>
    </details>
    <br>
</div>

