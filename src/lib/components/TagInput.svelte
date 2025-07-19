<script>
  import { createEventDispatcher } from 'svelte';
  
  // 导出属性
  export let tags = [];
  export let placeholder = 'Add tags...';
  export let maxTags = 10;
  
  // 创建事件分发器
  const dispatch = createEventDispatcher();
  
  // 输入状态
  let inputValue = '';
  let inputElement;
  
  // 添加标签
  function addTag() {
    const tag = inputValue.trim();
    
    if (tag && !tags.includes(tag) && tags.length < maxTags) {
      const newTags = [...tags, tag];
      dispatch('update', newTags);
      inputValue = '';
    }
  }
  
  // 删除标签
  function removeTag(index) {
    const newTags = [...tags];
    newTags.splice(index, 1);
    dispatch('update', newTags);
  }
  
  // 处理键盘事件
  function handleKeydown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTag();
    } else if (event.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  }
  
  // 处理粘贴事件
  function handlePaste(event) {
    event.preventDefault();
    const pastedText = (event.clipboardData || window.clipboardData).getData('text');
    
    if (pastedText) {
      // 按逗号或空格分割粘贴的文本
      const pastedTags = pastedText
        .split(/[,\s]+/)
        .map(tag => tag.trim())
        .filter(tag => tag && !tags.includes(tag));
      
      // 添加新标签，但不超过最大数量
      const availableSlots = maxTags - tags.length;
      const tagsToAdd = pastedTags.slice(0, availableSlots);
      
      if (tagsToAdd.length > 0) {
        const newTags = [...tags, ...tagsToAdd];
        dispatch('update', newTags);
      }
    }
    
    inputValue = '';
  }
  
  // 处理点击容器
  function handleContainerClick() {
    if (inputElement) {
      inputElement.focus();
    }
  }
</script>

<div class="tag-input-container" on:click={handleContainerClick}>
  <div class="tags-list">
    {#each tags as tag, index}
      <div class="tag">
        <span class="tag-text">{tag}</span>
        <button 
          type="button" 
          class="tag-remove" 
          on:click|stopPropagation={() => removeTag(index)}
          aria-label={`Remove tag ${tag}`}
        >
          &times;
        </button>
      </div>
    {/each}
    
    <input
      bind:this={inputElement}
      bind:value={inputValue}
      on:keydown={handleKeydown}
      on:paste={handlePaste}
      on:blur={addTag}
      type="text"
      class="tag-input"
      placeholder={tags.length === 0 ? placeholder : ''}
      disabled={tags.length >= maxTags}
    />
  </div>
  
  {#if tags.length >= maxTags}
    <div class="tag-limit-message">
      Maximum {maxTags} tags reached
    </div>
  {/if}
</div>

<style>
  .tag-input-container {
    border: 1px solid var(--border);
    border-radius: 0.25rem;
    padding: 0.25rem;
    background-color: white;
    cursor: text;
  }
  
  .tag-input-container:focus-within {
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
  
  .tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
    min-height: 2rem;
    padding: 0.25rem;
  }
  
  .tag {
    display: flex;
    align-items: center;
    background-color: var(--primary-light);
    color: var(--primary);
    border-radius: 0.25rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
  }
  
  .tag-text {
    margin-right: 0.25rem;
  }
  
  .tag-remove {
    background: none;
    border: none;
    color: var(--primary);
    cursor: pointer;
    font-size: 1rem;
    line-height: 1;
    padding: 0 0.25rem;
  }
  
  .tag-remove:hover {
    color: var(--error);
  }
  
  .tag-input {
    flex: 1;
    min-width: 100px;
    border: none;
    outline: none;
    font-size: 0.875rem;
    padding: 0.25rem;
  }
  
  .tag-limit-message {
    font-size: 0.75rem;
    color: var(--text-light);
    margin-top: 0.25rem;
    padding: 0 0.25rem;
  }
</style>