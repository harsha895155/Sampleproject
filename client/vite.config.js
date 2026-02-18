// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import path from 'path';
// import { fileURLToPath } from 'url';
// import fs from 'fs';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// console.log('--- Vite Config Loading ---');
// console.log('Context:', __dirname);

// const shims = {
//   'react': 'src/shims/react.js',
//   'react-dom': 'src/shims/react-dom.js',
//   'react-dom/client': 'src/shims/react-dom.js',
//   'react-router-dom': 'src/shims/react-router-dom.jsx',
//   'lucide-react': 'src/shims/lucide-react.jsx',
//   'axios': 'src/shims/axios.js',
//   'framer-motion': 'src/shims/framer-motion.jsx',
//   'recharts': 'src/shims/recharts.jsx',
// };

// const aliases = Object.entries(shims).map(([find, relPath]) => {
//   const replacement = path.resolve(__dirname, relPath);
//   console.log(`Aliasing ${find} to ${replacement} (exists: ${fs.existsSync(replacement)})`);
//   return { find, replacement };
// });

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: aliases,
//   },
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://localhost:5011',
//         changeOrigin: true,
//       },
//     },
//   },
// })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('--- Vite Config Loading ---');
console.log('Context:', __dirname);

const shims = {
  'react': 'src/shims/react.js',
  'react-dom': 'src/shims/react-dom.js',
  'react-dom/client': 'src/shims/react-dom.js',
  'react-router-dom': 'src/shims/react-router-dom.jsx',
  'lucide-react': 'src/shims/lucide-react.jsx',
  'axios': 'src/shims/axios.js',
  'framer-motion': 'src/shims/framer-motion.jsx',
  'recharts': 'src/shims/recharts.jsx',
};

const aliases = Object.entries(shims).map(([find, relPath]) => {
  const replacement = path.resolve(__dirname, relPath);
  console.log(`Aliasing ${find} to ${replacement} (exists: ${fs.existsSync(replacement)})`);
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
        target: 'http://127.0.0.1:5011',
        changeOrigin: true,
      },
    },
  },
})
