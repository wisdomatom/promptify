import { loadPrompts } from '$lib/stores/promptStore';

/** @type {import('./$types').PageLoad} */
export async function load() {
  // 加载提示数据
  await loadPrompts();
  
  return {
    // 这里不需要返回数据，因为我们使用的是Svelte存储
    // 数据会通过store在组件中获取
  };
}