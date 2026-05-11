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
        'script-src': ['self', 'blob:', 'https://cdn.jsdelivr.net', 'https://vercel.live', 'https://va.vercel-scripts.com'],
        'script-src-elem': ['self', 'https://cdn.jsdelivr.net', 'https://va.vercel-scripts.com'],
        'style-src': ['self', 'unsafe-inline'],
        'img-src': ['self', 'data:', 'https:'],
        'connect-src': ['self', 'https://*.supabase.co', 'https://*.sentry.io'],
        'font-src': ['self', 'data:'],
        'frame-src': ['self', 'https://vercel.live'],
      },
      reportOnly: {
        'script-src': ['self', 'https://vercel.live'],
        'script-src-elem': ['self', 'https://va.vercel-scripts.com'],
        'img-src': ['self', 'data:', 'https:'],
        'report-uri': ['https://o4511150140424192.ingest.us.sentry.io/api/4511330588295168/security/?sentry_key=fe908bdbe011debe50395a3f6712f36c']
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