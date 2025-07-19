<script>
  import { prompts, loading } from '$lib/stores/promptStore';
  import PromptCard from '$lib/components/PromptCard.svelte';
  import { onMount } from 'svelte';
  
  // 搜索和过滤状态
  let searchQuery = '';
  let selectedTags = [];
  let allTags = [];
  
  // 计算所有可用的标签
  $: {
    const tagSet = new Set();
    $prompts.forEach(prompt => {
      if (prompt.tags && Array.isArray(prompt.tags)) {
        prompt.tags.forEach(tag => tagSet.add(tag));
      }
    });
    allTags = Array.from(tagSet).sort();
  }
  
  // 过滤提示
  $: filteredPrompts = $prompts.filter(prompt => {
    // 搜索标题和描述
    const matchesSearch = searchQuery === '' || 
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (prompt.description && prompt.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // 过滤标签
    const matchesTags = selectedTags.length === 0 || 
      (prompt.tags && selectedTags.every(tag => prompt.tags.includes(tag)));
    
    return matchesSearch && matchesTags;
  });
  
  // 处理搜索输入
  function handleSearchInput(event) {
    searchQuery = event.target.value;
  }
  
  // 处理标签选择
  function toggleTag(tag) {
    if (selectedTags.includes(tag)) {
      selectedTags = selectedTags.filter(t => t !== tag);
    } else {
      selectedTags = [...selectedTags, tag];
    }
  }
  
  // 清除所有过滤器
  function clearFilters() {
    searchQuery = '';
    selectedTags = [];
  }
</script>

<svelte:head>
  <title>Prompts | Promptify</title>
</svelte:head>

<div class="prompts-page">
  <header class="page-header">
    <h1>All Prompts</h1>
    <a href="/create" class="btn primary">Create New Prompt</a>
  </header>
  
  <div class="filters-container">
    <div class="search-container">
      <input 
        type="text" 
        class="search-input" 
        placeholder="Search prompts..." 
        bind:value={searchQuery} 
        on:input={handleSearchInput}
      />
      {#if searchQuery}
        <button class="search-clear" on:click={() => searchQuery = ''}>
          &times;
        </button>
      {/if}
    </div>
    
    {#if allTags.length > 0}
      <div class="tags-filter">
        <h3 class="filter-title">Filter by tags:</h3>
        <div class="tags-list">
          {#each allTags as tag}
            <button 
              class="tag-filter" 
              class:active={selectedTags.includes(tag)} 
              on:click={() => toggleTag(tag)}
            >
              {tag}
            </button>
          {/each}
        </div>
      </div>
    {/if}
    
    {#if searchQuery || selectedTags.length > 0}
      <div class="active-filters">
        <span>Active filters:</span>
        {#if searchQuery}
          <div class="filter-badge">
            Search: "{searchQuery}"
          </div>
        {/if}
        
        {#each selectedTags as tag}
          <div class="filter-badge">
            Tag: {tag}
          </div>
        {/each}
        
        <button class="clear-filters" on:click={clearFilters}>
          Clear all filters
        </button>
      </div>
    {/if}
  </div>
  
  {#if $loading}
    <div class="loading">Loading prompts...</div>
  {:else if filteredPrompts.length === 0}
    <div class="empty-state">
      {#if $prompts.length === 0}
        <p>You don't have any prompts yet.</p>
        <a href="/create" class="btn primary">Create Your First Prompt</a>
      {:else}
        <p>No prompts match your current filters.</p>
        <button class="btn" on:click={clearFilters}>Clear Filters</button>
      {/if}
    </div>
  {:else}
    <div class="prompts-grid">
      {#each filteredPrompts as prompt}
        <PromptCard {prompt} />
      {/each}
    </div>
  {/if}
</div>

<style>
  .prompts-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
  }
  
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .page-header h1 {
    margin: 0;
    font-size: 2rem;
  }
  
  .filters-container {
    margin-bottom: 2rem;
  }
  
  .search-container {
    position: relative;
    margin-bottom: 1rem;
  }
  
  .search-input {
    width: 100%;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    border: 1px solid var(--border);
    border-radius: 0.25rem;
    background-color: white;
  }
  
  .search-input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
  
  .search-clear {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--text-light);
    font-size: 1.25rem;
    cursor: pointer;
  }
  
  .tags-filter {
    margin-bottom: 1.5rem;
  }
  
  .filter-title {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
  
  .tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .tag-filter {
    background-color: white;
    border: 1px solid var(--border);
    border-radius: 0.25rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .tag-filter:hover {
    border-color: var(--primary);
    color: var(--primary);
  }
  
  .tag-filter.active {
    background-color: var(--primary);
    border-color: var(--primary);
    color: white;
  }
  
  .active-filters {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    padding: 0.75rem;
    background-color: var(--secondary-light);
    border-radius: 0.25rem;
  }
  
  .active-filters span {
    font-size: 0.875rem;
    color: var(--text-light);
  }
  
  .filter-badge {
    background-color: white;
    border: 1px solid var(--border);
    border-radius: 0.25rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
  }
  
  .clear-filters {
    margin-left: auto;
    background: none;
    border: none;
    color: var(--primary);
    font-size: 0.875rem;
    cursor: pointer;
    text-decoration: underline;
  }
  
  .prompts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  
  .loading {
    text-align: center;
    padding: 2rem;
    color: var(--text-light);
  }
  
  .empty-state {
    text-align: center;
    padding: 3rem;
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .empty-state p {
    margin-bottom: 1.5rem;
    color: var(--text-light);
  }
  
  @media (max-width: 768px) {
    .page-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
    
    .page-header a {
      width: 100%;
      text-align: center;
    }
  }
</style>