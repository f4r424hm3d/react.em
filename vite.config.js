import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react() ,tailwindcss(),],
  build: {
    // ✅ Production optimizations
    rollupOptions: {
      output: {
        manualChunks: {
          // Split React vendor bundle
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Split UI libraries
          'ui-vendor': ['framer-motion', 'swiper'],
          // Split icon libraries
          'icons': ['lucide-react', 'react-icons'],
          // Split form/validation libraries
          'forms': ['react-toastify', 'react-hot-toast'],
        },
      },
    },
    chunkSizeWarningLimit: 600, // Raise limit for larger vendor chunks
    minify: 'esbuild', // Fast minification
  },
  server: {
    proxy: {
      '/storage': {
        target: 'https://www.educationmalaysia.in',
        changeOrigin: true,
        secure: false,
      },
      '/sitemap.xml': {
        target: 'https://admin.educationmalaysia.in',
        changeOrigin: true,
        secure: false,
      },
      '/sitemap-home.xml': {
        target: 'https://admin.educationmalaysia.in',
        changeOrigin: true,
        secure: false,
      },
      '/sitemap-exams.xml': {
        target: 'https://admin.educationmalaysia.in',
        changeOrigin: true,
        secure: false,
      },
      '/sitemap-services.xml': {
        target: 'https://admin.educationmalaysia.in',
        changeOrigin: true,
        secure: false,
      },
      '/sitemap-universities.xml': {
        target: 'https://admin.educationmalaysia.in',
        changeOrigin: true,
        secure: false,
      },
      '/sitemap-university.xml': {
        target: 'https://admin.educationmalaysia.in',
        changeOrigin: true,
        secure: false,
      },
      '/sitemap-university-program.xml': {
        target: 'https://admin.educationmalaysia.in',
        changeOrigin: true,
        secure: false,
      },
      '/sitemap-specialization.xml': {
        target: 'https://admin.educationmalaysia.in',
        changeOrigin: true,
        secure: false,
      },
      '/sitemap-course.xml': {
        target: 'https://admin.educationmalaysia.in',
        changeOrigin: true,
        secure: false,
      },
      '/sitemap-blog.xml': {
        target: 'https://admin.educationmalaysia.in',
        changeOrigin: true,
        secure: false,
      },
      '/sitemap-course-level.xml': {
        target: 'https://admin.educationmalaysia.in',
        changeOrigin: true,
        secure: false,
      },
      '/sitemap-courses-in-malaysia.xml': {
        target: 'https://admin.educationmalaysia.in',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
