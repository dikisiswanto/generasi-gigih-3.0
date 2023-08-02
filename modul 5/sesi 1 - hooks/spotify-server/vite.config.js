import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {

  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      'import.meta.env.CLIENT_ID': JSON.stringify(env.CLIENT_ID),
      'import.meta.env.CLIENT_SECRET': JSON.stringify(env.CLIENT_SECRET),
      'import.meta.env.REDIRECT_URI': JSON.stringify(env.REDIRECT_URI)
    }
  }
})
