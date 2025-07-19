<script>
  import { goto } from '$app/navigation';
  import { updatePrompt } from '$lib/stores/promptStore';
  import PromptForm from '$lib/components/PromptForm.svelte';
  
  // 导出属性
  export let data;
  
  // 从数据中获取提示
  const prompt = data.prompt;
  
  // 处理表单提交
  function handleSubmit(event) {
    const updatedPrompt = {
      ...prompt,
      ...event.detail,
      updatedAt: new Date().toISOString()
    };
    
    updatePrompt(updatedPrompt);
    goto(`/prompts/${prompt.id}`);
  }
  
  // 处理取消
  function handleCancel() {
    goto(`/prompts/${prompt.id}`);
  }
</script>

<svelte:head>
  <title>Edit Prompt | Promptify</title>
</svelte:head>

<div class="edit-prompt-page">
  <div class="page-header">
    <div class="back-link">
      <a href="/prompts/{prompt.id}">&larr; Back to Prompt</a>
    </div>
    <h1>Edit Prompt</h1>
  </div>
  
  <PromptForm 
    {prompt} 
    isEditing={true} 
    on:submit={handleSubmit} 
    on:cancel={handleCancel} 
  />
</div>

<style>
  .edit-prompt-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
  }
  
  .page-header {
    margin-bottom: 2rem;
  }
  
  .back-link {
    margin-bottom: 1rem;
  }
  
  .back-link a {
    color: var(--text-light);
    text-decoration: none;
    font-size: 0.875rem;
  }
  
  .back-link a:hover {
    color: var(--primary);
    text-decoration: underline;
  }
  
  h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
</style>