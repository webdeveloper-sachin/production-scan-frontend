import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const target = env.VITE_PROXY_TARGET || 'http://localhost:3000';

  return {
    // https sirf `npm run dev:phone` par (phone se camera ke liye)
    plugins: [react(), tailwindcss(), ...(mode === 'https' ? [basicSsl()] : [])],
    server: {
      host: true, // same WiFi ke phone se https://<pc-ip>:5173 khol sako
      // /api ki requests backend ko forward hoti hain (https page se http API ka mixed-content issue nahi aata)
      proxy: { '/api': { target, changeOrigin: true } },
    },
  };
});
