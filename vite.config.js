import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        open: true,  // Opens the browser when the server starts
    },
    root: './src/test', // Root directory for the playground
    build: {
        outDir: './dist/test', // Output directory for the playground build
    },
});