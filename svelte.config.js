import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // 预处理选项
  preprocess: vitePreprocess(),

  kit: {
    // 适配器 - 默认使用自动适配器
    adapter: adapter(),
    
    // 别名配置
    alias: {
      $lib: './src/lib'
    }
  }
};

export default config;