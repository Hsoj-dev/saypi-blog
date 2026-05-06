<script>
	import { resolve } from "$app/paths";
</script>

<svelte:head>
  <title>Saypi-Blog | About</title>
</svelte:head>

<h1 class="text-2xl sm:text-3xl md:text-4xl font-bold mx-6 mt-0">
    [ About ]
</h1>

<!-- TODO: add about details -->
<div class="card card-border border-primary bg-base-100 shadow-md p-3 md:p-5 max-w-5xl my-6">
    <div class="card-body text-left space-y-6">
        <h2 class="text-2xl font-bold text-center mb-4">The Saypi-Blog Project</h2>

        <p>
        <b>Saypi-Blog</b> is a social blogging platform made for <b>Pisay scholars</b>.
        </p>

        <p>
        </p>

        <p>
        </p>
    </div>
</div>

<div class="card card-border border-primary bg-base-100 shadow-md p-5 max-w-5xl">
    <div class="card-body text-left">
        <h2 class="text-2xl font-bold text-center mb-4">The People Behind Saypi-Blog</h2>
        
        <div class="max-w-2xl mx-auto grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-left">
            <a href={resolve('/@joshsatinitigan')} class="font-semibold">
                Hsoj
            </a>
            <span>
                Creator, Developer, Benevolent Dictator, Fluff Reader
            </span>

            <a href={resolve('/@carlnacar')} class="font-semibold">
                CJ
            </a>
            <span>
                Designer, Functionality Tester, Always Anxious
            </span>

            <a href={resolve('/@kurtundag')} class="font-semibold">
                Bjork
            </a>
            <span>
                Platform Moderator, Support (emotional), Expendable member
            </span>
        </div>
    </div>
</div>

