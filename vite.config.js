import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('--- Root Vite Config Loading ---');
console.log('Context:', __dirname);

const shims = {
  'react-router-dom': 'client/src/shims/react-router-dom.jsx',
  'lucide-react': 'client/src/shims/lucide-react.jsx',
  'axios': 'client/src/shims/axios.js',
  'framer-motion': 'client/src/shims/framer-motion.jsx',
  'recharts': 'client/src/shims/recharts.jsx',
};

const aliases = Object.entries(shims).map(([find, relPath]) => {
  const replacement = path.resolve(__dirname, relPath);
  console.log(`Root Aliasing ${find} to ${replacement} (exists: ${fs.existsSync(replacement)})`);
  return { find, replacement };
});

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: aliases,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
