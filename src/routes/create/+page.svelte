<script>
  import { goto } from '$app/navigation';
  import { addPrompt } from '$lib/stores/promptStore';
  import PromptForm from '$lib/components/PromptForm.svelte';
  import { v4 as uuidv4 } from 'uuid';
  
  // 空提示模板
  const emptyPrompt = {
    title: '',
    description: '',
    content: '',
    tags: []
  };
  
  // 处理表单提交
  function handleSubmit(event) {
    const now = new Date().toISOString();
    const newPrompt = {
      ...event.detail,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now
    };
    
    addPrompt(newPrompt);
    goto(`/prompts/${newPrompt.id}`);
  }
  
  // 处理取消
  function handleCancel() {
    goto('/prompts');
  }
</script>

<svelte:head>
  <title>Create New Prompt | Promptify</title>
</svelte:head>

<div class="create-prompt-page">
  <div class="page-header">
    <div class="back-link">
      <a href="/prompts">&larr; Back to Prompts</a>
    </div>
    <h1>Create New Prompt</h1>
  </div>
  
  <div class="intro-text">
    <p>
      Create a new AI prompt that you can reuse later. Good prompts are clear, specific, 
      and provide enough context for the AI to understand what you want.
    </p>
  </div>
  
  <PromptForm 
    prompt={emptyPrompt} 
    isEditing={false} 
    on:submit={handleSubmit} 
    on:cancel={handleCancel} 
  />
</div>

<style>
  .create-prompt-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
  }
  
  .page-header {
    margin-bottom: 1.5rem;
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
  
  .intro-text {
    margin-bottom: 2rem;
    background-color: var(--secondary-light);
    padding: 1.5rem;
    border-radius: 0.5rem;
    border-left: 4px solid var(--primary);
  }
  
  .intro-text p {
    margin: 0;
    line-height: 1.6;
  }
</style>