<script>
  import { goto } from '$app/navigation';
  
  // 导出属性
  export let prompt;
  
  // 计算预览内容
  $: previewContent = prompt.content.length > 100 
    ? prompt.content.slice(0, 100) + '...' 
    : prompt.content;
  
  // 处理卡片点击
  function handleCardClick() {
    goto(`/prompts/${prompt.id}`);
  }
</script>

<div class="prompt-card" on:click={handleCardClick} on:keydown={(e) => e.key === 'Enter' && handleCardClick()} tabindex="0">
  <div class="prompt-card-header">
    <h3 class="prompt-card-title">{prompt.title}</h3>
  </div>
  
  {#if prompt.description}
    <div class="prompt-card-description">
      {prompt.description}
    </div>
  {/if}
  
  <div class="prompt-card-preview">
    {previewContent}
  </div>
  
  {#if prompt.tags && prompt.tags.length > 0}
    <div class="prompt-card-tags">
      {#each prompt.tags.slice(0, 3) as tag}
        <span class="tag">{tag}</span>
      {/each}
      {#if prompt.tags.length > 3}
        <span class="tag-more">+{prompt.tags.length - 3}</span>
      {/if}
    </div>
  {/if}
</div>

<style>
  .prompt-card {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    transition: transform 0.2s, box-shadow 0.2s;
    cursor: pointer;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .prompt-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .prompt-card:focus {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }
  
  .prompt-card-header {
    margin-bottom: 0.75rem;
  }
  
  .prompt-card-title {
    font-size: 1.25rem;
    margin: 0;
    color: var(--text);
  }
  
  .prompt-card-description {
    font-size: 0.875rem;
    color: var(--text-light);
    margin-bottom: 1rem;
    line-height: 1.4;
  }
  
  .prompt-card-preview {
    font-size: 0.875rem;
    color: var(--text);
    margin-bottom: 1rem;
    line-height: 1.5;
    flex-grow: 1;
    white-space: pre-line;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  
  .prompt-card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: auto;
  }
  
  .tag {
    background-color: var(--primary-light);
    color: var(--primary);
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
  }
  
  .tag-more {
    background-color: #e5e7eb;
    color: #4b5563;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
  }
</style>