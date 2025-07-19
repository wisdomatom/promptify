import { loadPrompts, getPromptById } from '$lib/stores/promptStore';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
  // 确保提示数据已加载
  await loadPrompts();
  
  // 获取提示数据
  const prompt = getPromptById(params.id);
  
  // 如果找不到提示，返回404错误
  if (!prompt) {
    throw error(404, {
      message: 'Prompt not found'
    });
  }
  
  return {
    prompt
  };
}