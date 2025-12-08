import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    server: {
      port: 3000,
      host: true
    },
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      minify: 'terser',
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'redux-vendor': ['react-redux', '@reduxjs/toolkit'],
            'utils': ['axios']
          }
        }
      },
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production'
        }
      },
      target: 'es2015',
      cssTarget: 'chrome61'
    },
    define: {
      __APP_ENV__: JSON.stringify(env)
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    },
    css: {
      postcss: './postcss.config.js'
    },
    // Optimize dependencies
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-redux', '@reduxjs/toolkit', 'axios']
    }
  }
})