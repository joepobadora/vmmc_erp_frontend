import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  compilerOptions: {
    dev: true, // keep extra warnings during dev
  },
  kit: {
    adapter: adapter({
      fallback: 'index.html', // fallback page for dynamic routes
    }),
  },
};

export default config;
