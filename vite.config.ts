import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
// export default defineConfig({
//   base: '/admin/',
//   plugins: [react()],
//   server: {
//     port: 5501, 
//   },
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, './src'),
//     },
//   },
// })

export default defineConfig({
  base: '/admin/',
  plugins: [react()],
  server: {
    port: 5501,
  },
  resolve: {
   alias: {
      '@': path.resolve(__dirname, './src'),
    },
   },
})

