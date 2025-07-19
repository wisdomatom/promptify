<script>
  import { prompts } from '$lib/stores/promptStore';
  import PromptCard from '$lib/components/PromptCard.svelte';
  
  // 获取最近的提示
  $: recentPrompts = [...$prompts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);
</script>

<svelte:head>
  <title>Promptify - Organize Your AI Prompts</title>
</svelte:head>

<div class="home-page">
  <section class="hero">
    <div class="hero-content">
      <h1>Organize Your AI Prompts</h1>
      <p class="hero-subtitle">
        Create, save, and reuse your best AI prompts with Promptify - 
        the simple way to manage your AI conversations.
      </p>
      <div class="hero-actions">
        <a href="/create" class="btn primary">Create New Prompt</a>
        <a href="/prompts" class="btn secondary">Browse Prompts</a>
      </div>
    </div>
    <div class="hero-image">
      <img src="/images/hero-illustration.svg" alt="Promptify illustration" />
    </div>
  </section>
  
  <section class="features">
    <h2>Why Use Promptify?</h2>
    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-icon">📝</div>
        <h3>Save Time</h3>
        <p>Stop rewriting the same prompts. Save your best ones and reuse them with a click.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">🏷️</div>
        <h3>Organize</h3>
        <p>Tag and categorize your prompts to quickly find what you need when you need it.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">📈</div>
        <h3>Improve</h3>
        <p>Refine your prompts over time to get better results from AI assistants.</p>
      </div>
    </div>
  </section>
  
  {#if recentPrompts.length > 0}
    <section class="recent-prompts">
      <div class="section-header">
        <h2>Recent Prompts</h2>
        <a href="/prompts" class="view-all">View All &rarr;</a>
      </div>
      <div class="prompts-grid">
        {#each recentPrompts as prompt}
          <PromptCard {prompt} />
        {/each}
      </div>
    </section>
  {/if}
  
  <section class="get-started">
    <h2>Ready to Get Started?</h2>
    <p>Create your first prompt now and start building your personal prompt library.</p>
    <a href="/create" class="btn primary">Create Your First Prompt</a>
  </section>
</div>

<style>
  .home-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
  }
  
  .hero {
    display: flex;
    align-items: center;
    gap: 2rem;
    margin: 2rem 0 4rem;
  }
  
  .hero-content {
    flex: 1;
  }
  
  .hero h1 {
    font-size: 3rem;
    line-height: 1.2;
    margin-bottom: 1.5rem;
    color: var(--primary);
  }
  
  .hero-subtitle {
    font-size: 1.25rem;
    line-height: 1.6;
    margin-bottom: 2rem;
    color: var(--text);
  }
  
  .hero-actions {
    display: flex;
    gap: 1rem;
  }
  
  .hero-image {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .hero-image img {
    max-width: 100%;
    height: auto;
  }
  
  .features {
    margin: 4rem 0;
    text-align: center;
  }
  
  .features h2 {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }
  
  .feature-card {
    background-color: white;
    border-radius: 0.5rem;
    padding: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
  }
  
  .feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .feature-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  .feature-card h3 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
  
  .feature-card p {
    color: var(--text-light);
    line-height: 1.6;
  }
  
  .recent-prompts {
    margin: 4rem 0;
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .section-header h2 {
    font-size: 2rem;
    margin: 0;
  }
  
  .view-all {
    color: var(--primary);
    text-decoration: none;
    font-weight: 500;
  }
  
  .view-all:hover {
    text-decoration: underline;
  }
  
  .prompts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  
  .get-started {
    margin: 4rem 0;
    text-align: center;
    background-color: var(--primary-light);
    padding: 3rem;
    border-radius: 0.5rem;
  }
  
  .get-started h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: var(--primary);
  }
  
  .get-started p {
    font-size: 1.1rem;
    margin-bottom: 2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
  
  @media (max-width: 768px) {
    .hero {
      flex-direction: column;
    }
    
    .hero h1 {
      font-size: 2.5rem;
    }
    
    .hero-actions {
      flex-direction: column;
    }
    
    .hero-actions a {
      width: 100%;
      text-align: center;
    }
  }
</style>