<script>
  import { goto } from '$app/navigation';
  import { deletePrompt } from '$lib/stores/promptStore';
  
  // 导出属性
  export let data;
  
  // 从数据中获取提示
  const prompt = data.prompt;
  
  // 复制提示内容到剪贴板
  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(prompt.content);
      showCopySuccess = true;
      setTimeout(() => {
        showCopySuccess = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }
  
  // 删除提示
  let showDeleteConfirm = false;
  let showCopySuccess = false;
  
  function confirmDelete() {
    showDeleteConfirm = true;
  }
  
  function cancelDelete() {
    showDeleteConfirm = false;
  }
  
  function handleDelete() {
    deletePrompt(prompt.id);
    goto('/prompts');
  }
  
  // 格式化日期
  function formatDate(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
</script>

<svelte:head>
  <title>{prompt.title} | Promptify</title>
</svelte:head>

<div class="prompt-detail-page">
  <div class="prompt-header">
    <div class="back-link">
      <a href="/prompts">&larr; Back to Prompts</a>
    </div>
    
    <h1>{prompt.title}</h1>
    
    {#if prompt.description}
      <p class="prompt-description">{prompt.description}</p>
    {/if}
    
    <div class="prompt-meta">
      {#if prompt.createdAt}
        <div class="meta-item">
          <span class="meta-label">Created:</span>
          <span class="meta-value">{formatDate(prompt.createdAt)}</span>
        </div>
      {/if}
      
      {#if prompt.updatedAt && prompt.updatedAt !== prompt.createdAt}
        <div class="meta-item">
          <span class="meta-label">Updated:</span>
          <span class="meta-value">{formatDate(prompt.updatedAt)}</span>
        </div>
      {/if}
    </div>
    
    {#if prompt.tags && prompt.tags.length > 0}
      <div class="prompt-tags">
        {#each prompt.tags as tag}
          <span class="tag">{tag}</span>
        {/each}
      </div>
    {/if}
  </div>
  
  <div class="prompt-content-container">
    <div class="prompt-actions">
      <button class="btn" on:click={copyToClipboard}>
        {#if showCopySuccess}
          <span class="success-message">✓ Copied!</span>
        {:else}
          Copy to Clipboard
        {/if}
      </button>
      <a href="/prompts/{prompt.id}/edit" class="btn secondary">Edit</a>
      <button class="btn danger" on:click={confirmDelete}>Delete</button>
    </div>
    
    <div class="prompt-content">
      <h2>Prompt Content</h2>
      <pre>{prompt.content}</pre>
    </div>
  </div>
  
  {#if showDeleteConfirm}
    <div class="modal-overlay">
      <div class="modal">
        <h2>Delete Prompt</h2>
        <p>Are you sure you want to delete "{prompt.title}"? This action cannot be undone.</p>
        <div class="modal-actions">
          <button class="btn danger" on:click={handleDelete}>Yes, Delete</button>
          <button class="btn" on:click={cancelDelete}>Cancel</button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .prompt-detail-page {
    max-width: 900px;
    margin: 0 auto;
    padding: 1rem;
  }
  
  .prompt-header {
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
  
  .prompt-description {
    font-size: 1.1rem;
    color: var(--text-light);
    margin-bottom: 1.5rem;
    line-height: 1.5;
  }
  
  .prompt-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-bottom: 1rem;
    font-size: 0.875rem;
  }
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .meta-label {
    color: var(--text-light);
  }
  
  .prompt-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1rem;
  }
  
  .tag {
    background-color: var(--primary-light);
    color: var(--primary);
    border-radius: 0.25rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
  }
  
  .prompt-content-container {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 2rem;
  }
  
  .prompt-actions {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .success-message {
    color: var(--success);
  }
  
  .prompt-content h2 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    color: var(--text-light);
  }
  
  .prompt-content pre {
    background-color: var(--secondary-light);
    padding: 1.5rem;
    border-radius: 0.25rem;
    white-space: pre-wrap;
    word-break: break-word;
    font-family: monospace;
    line-height: 1.5;
    font-size: 0.9rem;
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    max-width: 500px;
    width: 90%;
  }
  
  .modal h2 {
    margin-bottom: 1rem;
  }
  
  .modal p {
    margin-bottom: 1.5rem;
  }
  
  .modal-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
  }
  
  @media (max-width: 768px) {
    .prompt-actions {
      flex-direction: column;
    }
    
    .prompt-actions button,
    .prompt-actions a {
      width: 100%;
      text-align: center;
    }
    
    .modal-actions {
      flex-direction: column;
    }
  }
</style>