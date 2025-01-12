/// <reference types="vitest/config" />
import { createRequire } from 'module';
import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

export default defineConfig({
    plugins: [],
    build: {
        outDir: 'lib/',
        emptyOutDir: true, 
        lib: {
            entry: resolve(__dirname, 'src/LocalizedStrings.ts'),
            name: 'LocalizedStrings',
            formats: ['es', 'umd'],
            fileName: (format) => `LocalizedStrings.${format}.js`,
        },
        rollupOptions: {
            external: [
                ...(pkg.peerDependencies ? Object.keys(pkg.peerDependencies) : []),
            ],
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        include: ['spec/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    },
});
