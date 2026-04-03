// svelte.config.js
import adapter from '@sveltejs/adapter-vercel';
import { relative, sep } from 'node:path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// defaults to rune mode for the project, execept for `node_modules`. Can be removed in svelte 6.
		runes: ({ filename }) => {
			const relativePath = relative(import.meta.dirname, filename);
			const pathSegments = relativePath.toLowerCase().split(sep);
			const isExternalLibrary = pathSegments.includes('node_modules');

			return isExternalLibrary ? undefined : true;
    },
    experimental: {
			async: true
		},
  },
	
	kit: {
    adapter: adapter(),
    csp: {
      mode: 'auto',
      directives: {
        'default-src': ['self'],
        'script-src': ['self'],
        'style-src': ['self', 'unsafe-inline'],
        'img-src': ['self', 'data:', 'https:'],
        'connect-src': ['self', 'https://*.supabase.co', 'https://*.sentry.io'],
        'font-src': ['self', 'data:']
      },
      reportOnly: {
        'script-src': ['self'],
        'img-src': ['self', 'data:', 'https:'],
        'report-uri': ['https://o4511150140424192.ingest.us.sentry.io/api/4511150146322432/security/?sentry_key=36f25b1bb405a8b4e7de1e3d3b893cde']
      }
    },
    experimental: {
      remoteFunctions: true,
      tracing: {
      	 server: true
     	},
      instrumentation: {
      	 server: true
     	}
    }
  }
};

export default config;