<script>
  import { createEventDispatcher } from 'svelte';
  import TagInput from './TagInput.svelte';
  
  // 导出属性
  export let prompt = {
    title: '',
    description: '',
    content: '',
    tags: []
  };
  export let isEditing = false;
  
  // 创建事件分发器
  const dispatch = createEventDispatcher();
  
  // 表单状态
  let title = prompt.title || '';
  let description = prompt.description || '';
  let content = prompt.content || '';
  let tags = prompt.tags || [];
  let errors = {};
  
  // 验证表单
  function validateForm() {
    errors = {};
    
    if (!title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!content.trim()) {
      errors.content = 'Prompt content is required';
    }
    
    return Object.keys(errors).length === 0;
  }
  
  // 处理表单提交
  function handleSubmit() {
    if (validateForm()) {
      const promptData = {
        title,
        description,
        content,
        tags
      };
      
      dispatch('submit', promptData);
    }
  }
  
  // 处理取消
  function handleCancel() {
    dispatch('cancel');
  }
  
  // 处理标签更新
  function handleTagsUpdate(event) {
    tags = event.detail;
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="prompt-form">
  <div class="form-group">
    <label for="title" class="form-label">Title</label>
    <input 
      type="text" 
      id="title" 
      class="form-input" 
      bind:value={title} 
      placeholder="Enter a title for your prompt"
    />
    {#if errors.title}
      <div class="form-error">{errors.title}</div>
    {/if}
  </div>
  
  <div class="form-group">
    <label for="description" class="form-label">Description (optional)</label>
    <textarea 
      id="description" 
      class="form-textarea" 
      bind:value={description} 
      placeholder="Enter a brief description of what this prompt does"
      rows="3"
    ></textarea>
  </div>
  
  <div class="form-group">
    <label for="content" class="form-label">Prompt Content</label>
    <textarea 
      id="content" 
      class="form-textarea" 
      bind:value={content} 
      placeholder="Enter your prompt content here"
      rows="10"
    ></textarea>
    {#if errors.content}
      <div class="form-error">{errors.content}</div>
    {/if}
    <div class="form-help">
      Write your prompt instructions, context, and any specific formatting you want.
    </div>
  </div>
  
  <div class="form-group">
    <label class="form-label">Tags (optional)</label>
    <TagInput 
      tags={tags} 
      on:update={handleTagsUpdate} 
      placeholder="Add tags (press Enter after each tag)"
    />
    <div class="form-help">
      Add tags to categorize your prompt (e.g., "writing", "coding", "creative").
    </div>
  </div>
  
  <div class="form-actions">
    <button type="submit" class="btn primary">
      {isEditing ? 'Update Prompt' : 'Create Prompt'}
    </button>
    <button type="button" class="btn" on:click={handleCancel}>
      Cancel
    </button>
  </div>
</form>

<style>
  .prompt-form {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 2rem;
  }
  
  .form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
  }
  
  @media (max-width: 768px) {
    .prompt-form {
      padding: 1.5rem;
    }
    
    .form-actions {
      flex-direction: column;
    }
    
    .form-actions button {
      width: 100%;
    }
  }
</style>