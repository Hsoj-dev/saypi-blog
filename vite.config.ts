// vite.config.ts
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { sentrySvelteKit } from "@sentry/sveltekit";
import { sentryVitePlugin } from "@sentry/vite-plugin";

export default defineConfig({
  plugins: [
    sentrySvelteKit({
      org: "saypi-studio",
      project: "saypi-blog"
    }),
    process.env.NODE_ENV === "production" &&
      sentryVitePlugin({
        org: "saypi-studio",
        project: "saypi-blog",
        authToken: process.env.SENTRY_AUTH_TOKEN,
      }),
    tailwindcss(),
    sveltekit()
  ]
});
