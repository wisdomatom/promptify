<script>
  import { onMount } from 'svelte';
  import { loadPrompts } from '$lib/stores/promptStore';
  import Nav from '$lib/components/Nav.svelte';
  import '../app.css';
  
  // 在组件挂载时加载提示数据
  onMount(async () => {
    await loadPrompts();
  });
</script>

<div class="app">
  <header>
    <Nav />
  </header>
  
  <main>
    <slot />
  </main>
  
  <footer>
    <div class="footer-content">
      <div class="footer-logo">
        <a href="/">Promptify</a>
      </div>
      
      <div class="footer-links">
        <div class="footer-section">
          <h3>Navigation</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/prompts">Prompts</a></li>
            <li><a href="/create">Create New</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h3>About</h3>
          <ul>
            <li><a href="#">About Promptify</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>
      </div>
    </div>
    
    <div class="footer-bottom">
      <p>&copy; {new Date().getFullYear()} Promptify. All rights reserved.</p>
      <p>Built with <a href="https://kit.svelte.dev" target="_blank" rel="noopener noreferrer">SvelteKit</a></p>
    </div>
  </footer>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  main {
    flex: 1;
    padding-top: 1rem;
    padding-bottom: 3rem;
  }
  
  footer {
    background-color: var(--secondary);
    color: var(--text);
    padding: 3rem 1rem 1rem;
    margin-top: auto;
  }
  
  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    gap: 3rem;
    margin-bottom: 2rem;
  }
  
  .footer-logo {
    flex: 1;
    min-width: 200px;
  }
  
  .footer-logo a {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary);
    text-decoration: none;
  }
  
  .footer-links {
    flex: 2;
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
  }
  
  .footer-section {
    flex: 1;
    min-width: 150px;
  }
  
  .footer-section h3 {
    font-size: 1rem;
    margin-bottom: 1rem;
    color: var(--text);
  }
  
  .footer-section ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .footer-section li {
    margin-bottom: 0.5rem;
  }
  
  .footer-section a {
    color: var(--text-light);
    text-decoration: none;
    font-size: 0.9rem;
  }
  
  .footer-section a:hover {
    color: var(--primary);
    text-decoration: underline;
  }
  
  .footer-bottom {
    max-width: 1200px;
    margin: 0 auto;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border);
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 1rem;
    font-size: 0.875rem;
    color: var(--text-light);
  }
  
  .footer-bottom a {
    color: var(--primary);
    text-decoration: none;
  }
  
  .footer-bottom a:hover {
    text-decoration: underline;
  }
  
  @media (max-width: 768px) {
    .footer-content {
      flex-direction: column;
      gap: 2rem;
    }
    
    .footer-bottom {
      flex-direction: column;
      text-align: center;
    }
  }
</style>