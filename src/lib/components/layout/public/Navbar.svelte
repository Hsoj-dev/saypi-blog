<script>
	import { resolve } from "$app/paths";
</script>

<div class="drawer drawer-end">
    <input id="mobile-drawer" type="checkbox" class="drawer-toggle" />

    <!-- NAVBAR -->
    <div class="drawer-content">
        <div class="navbar bg-base-300 shadow-sm">
            <div class="navbar-start">
                <div class="flex-1">
                    <a  href={resolve('/')} class="btn btn-ghost text-md md:text-xl" data-sveltekit-reload>
                        <!-- <img alt="Logo" src="" class="w-4" /> -->
                        <!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class="w-8">
                            <path d="M416 64C457 64 496.3 80.3 525.2 109.2L530.7 114.7C559.7 143.7 576 183 576 223.9C576 248 570.3 271.5 559.8 292.7C557.9 296.4 554.5 299.2 550.5 300.4L438.5 334C434.6 335.2 432 338.7 432 342.8C432 347.9 436.1 352 441.2 352L473.4 352C487.7 352 494.8 369.2 484.7 379.3L462.3 401.7C460.4 403.6 458.1 404.9 455.6 405.7L374.6 430C370.7 431.2 368.1 434.7 368.1 438.8C368.1 443.9 372.2 448 377.3 448C390.5 448 396.2 463.7 385.1 470.9C344 497.5 295.8 512 246.1 512L160.1 512L112.1 560C103.3 568.8 88.9 568.8 80.1 560C71.3 551.2 71.3 536.8 80.1 528L320 288C328.8 279.2 328.8 264.8 320 256C311.2 247.2 296.8 247.2 288 256L143.5 400.5C137.8 406.2 128 402.2 128 394.1C128 326.2 155 261.1 203 213.1L306.8 109.2C335.7 80.3 375 64 416 64z"/>
                        </svg> -->
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-6 fill-secondary"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M352 0c41 0 80.3 16.3 109.2 45.2l5.5 5.5c29 29 45.3 68.3 45.3 109.2 0 24.1-5.7 47.6-16.2 68.8-1.9 3.7-5.3 6.5-9.3 7.7L374.5 270c-3.9 1.2-6.5 4.7-6.5 8.8 0 5.1 4.1 9.2 9.2 9.2l32.2 0c14.3 0 21.4 17.2 11.3 27.3l-22.4 22.4c-1.9 1.9-4.2 3.2-6.7 4l-81 24.3c-3.9 1.2-6.5 4.7-6.5 8.8 0 5.1 4.1 9.2 9.2 9.2 13.2 0 18.9 15.7 7.8 22.9-41.1 26.6-89.3 41.1-139 41.1l-86 0-48 48c-8.8 8.8-23.2 8.8-32 0s-8.8-23.2 0-32L256 224c8.8-8.8 8.8-23.2 0-32s-23.2-8.8-32 0L79.5 336.5c-5.7 5.7-15.5 1.7-15.5-6.4 0-67.9 27-133 75-181L242.8 45.2C271.7 16.3 311 0 352 0z"/></svg>
                        Saypi-Blog
                        <span class="badge badge-secondary">Alpha</span>
                    </a>
                </div>    
            </div>
            
            <div class="navbar-end">
                
                <div class="hidden lg:flex">
                    <ul class="menu menu-horizontal gap-2">
                        <li class="gap-0"><a href={resolve('/')} class="btn btn-sm btn-ghost text-sm" data-sveltekit-reload>Home</a></li>
                        <li><a href={resolve('/about')} class="btn btn-sm btn-ghost text-sm">About Us</a></li>
                        <li><a href={resolve('/auth/signup')} class="btn btn-sm btn-ghost text-sm">Invite</a></li>
                        <li><a href={resolve('/auth/signup')} class="btn btn-sm btn-ghost text-sm">Sign Up</a></li>
                        <li><a href={resolve('/auth/login')} class="btn btn-sm btn-primary text-sm">Log In</a></li>
                        
                        <label class="swap swap-rotate">
                            <!-- this hidden checkbox controls the state -->
                            <input type="checkbox" class="theme-controller" value="coffee" />
                        
                            <!-- sun icon -->
                            <svg
                            class="swap-off h-8 w-8 fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24">
                            <path
                                d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                            </svg>
                        
                            <!-- moon icon -->
                            <svg
                            class="swap-on h-8 w-8 fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24">
                            <path
                                d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                            </svg>
                        </label>
                    </ul>
                </div>

                <!-- Hamburger (mobile only) -->
                <div class="lg:hidden">
        			<label for="mobile-drawer" class="btn btn-square btn-ghost">
           				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 stroke-current" fill="none" viewBox="0 0 24 24">
          					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
         						d="M4 6h16M4 12h16M4 18h16" />
           				</svg>
        			</label>
     		     </div>
            
            </div>
        </div>
    </div>

    <!-- SIDEBAR -->
	<div class="drawer-side">
		<label for="mobile-drawer" class="drawer-overlay"></label>
    
		<ul class="menu bg-base-200 min-h-full w-64 p-4 gap-2">
			<li><a href={resolve('/')}>Home</a></li>
			<li><a href={resolve('/about')}>About Us</a></li>
			<li><a href={resolve('/auth/signup')}>Invite</a></li>
			<li><a href={resolve('/auth/signup')}>Sign Up</a></li>
			<li><a href={resolve('/auth/login')} class="btn btn-primary">Log In</a></li>
		</ul>
	</div>
</div>
