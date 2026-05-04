<script lang='ts'>
	import { resolve } from '$app/paths';
    import Footer from './Footer.svelte';
    import Navbar from './Navbar.svelte';
</script>

<div>
    <header>
        <Navbar />
    </header>

    <div class="hero bg-base-200 min-h-[calc(100vh-4rem)] grid-bg">
        <div class="hero-content text-center">
            <div class="card bg-base-100 card-border border-primary shadow-md p-6 sm:p-1 md:p-2">
                <div class="card-body items-center text-center">         
                    <h1 class="card-title text-4xl sm:text-5xl font-bold m-6">
                    [ Hi! Welcome to Saypi-Blog ]
                    </h1>
                    
                    <div class="text-center">
                        <p>
                            Saypi is a social blogging platform made for Pisay scholars.
                        </p>
                        
                        <div class="text-left my-4">
                            <p>You can use Saypi-Blog to:</p>
                            <ul class="list-disc list-inside mt-2 space-y-1">
                            <li>Share your thoughts, ideas, and updates</li>
                            <li>See what’s happening in your campus or in Pisay</li>
                            <li>Find people with similar hobbies and interests as you</li>
                            <li>Comment and talk about things that matter to you</li>
                            </ul>
                        </div>
            
                        <p class="font-bold">
                            Express yourself freely and responsibly, here on Saypi-Blog.
                        </p>
            
                        <p class="mt-4">
                            To get started, click below to sign up using your school email.  
                            If you already have an account, you can log in.
                        </p>
                    </div>
        
                    <div class="card-actions mt-6 gap-3 justify-center">
                        <button class="btn btn-primary sm:w-auto"><a href={resolve('/auth/signup')}>Sign Up</a></button>
                        <button class="btn btn-outline sm:w-auto"><a href={resolve('/auth/login')}>Login</a></button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <footer>
        <Footer />
    </footer>
</div>