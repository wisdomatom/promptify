import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  
  // 服务器配置
  server: {
    port: 3000,
    strictPort: false,
    open: true
  },
  
  // 构建配置
  build: {
    target: 'esnext',
    outDir: 'build',
    minify: true
  }
});