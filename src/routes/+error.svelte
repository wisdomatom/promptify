<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  
  // 错误信息
  export let error;
  
  // 状态码
  let status = error?.status || 500;
  let message = error?.message || 'An unexpected error occurred';
  
  // 根据状态码设置错误标题
  let title = 'Error';
  if (status === 404) {
    title = 'Page Not Found';
    message = message || 'The page you are looking for does not exist.';
  }
  
  // 返回首页
  function goHome() {
    goto('/');
  }
</script>

<div class="error-container">
  <div class="error-content">
    <h1>{status}: {title}</h1>
    <p>{message}</p>
    
    {#if status === 404}
      <p>The page you requested could not be found.</p>
    {:else}
      <p>Something went wrong while processing your request.</p>
    {/if}
    
    <div class="error-actions">
      <button on:click={goHome} class="btn primary">Return Home</button>
      <button on:click={() => window.location.reload()} class="btn">Refresh Page</button>
    </div>
    
    {#if import.meta.env.DEV && error?.stack}
      <pre class="error-stack">{error.stack}</pre>
    {/if}
  </div>
</div>

<style>
  .error-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 2rem;
    background-color: var(--background);
  }
  
  .error-content {
    max-width: 600px;
    text-align: center;
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 2rem;
  }
  
  .error-content h1 {
    color: var(--error);
    margin-top: 0;
  }
  
  .error-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
  }
  
  .error-stack {
    text-align: left;
    background-color: #f8f9fa;
    padding: 1rem;
    border-radius: 0.25rem;
    margin-top: 2rem;
    font-size: 0.875rem;
    overflow-x: auto;
  }
</style>