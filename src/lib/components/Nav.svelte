<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  
  // 移动端菜单状态
  let isMenuOpen = false;
  
  // 切换菜单
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
  
  // 关闭菜单
  function closeMenu() {
    isMenuOpen = false;
  }
  
  // 监听路由变化关闭菜单
  $: if ($page.url.pathname) {
    closeMenu();
  }
  
  // 监听点击外部关闭菜单
  onMount(() => {
    const handleClickOutside = (event) => {
      const nav = document.querySelector('.nav');
      if (nav && !nav.contains(event.target) && isMenuOpen) {
        closeMenu();
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });
</script>

<nav class="nav">
  <div class="nav-container">
    <div class="nav-logo">
      <a href="/" class="logo-link">Promptify</a>
    </div>
    
    <button 
      class="menu-toggle" 
      on:click={toggleMenu}
      aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isMenuOpen}
    >
      <span class="menu-icon"></span>
    </button>
    
    <div class="nav-links" class:active={isMenuOpen}>
      <a 
        href="/" 
        class="nav-link" 
        class:active={$page.url.pathname === '/'}
      >
        Home
      </a>
      <a 
        href="/prompts" 
        class="nav-link" 
        class:active={$page.url.pathname === '/prompts'}
      >
        Prompts
      </a>
      <a 
        href="/create" 
        class="nav-link create-link" 
        class:active={$page.url.pathname === '/create'}
      >
        Create New
      </a>
    </div>
  </div>
</nav>

<style>
  .nav {
    background-color: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
  }
  
  .nav-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
    position: relative;
  }
  
  .nav-logo {
    font-size: 1.5rem;
    font-weight: 700;
  }
  
  .logo-link {
    color: var(--primary);
    text-decoration: none;
  }
  
  .nav-links {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }
  
  .nav-link {
    color: var(--text);
    text-decoration: none;
    font-weight: 500;
    padding: 0.5rem 0;
    position: relative;
  }
  
  .nav-link:hover {
    color: var(--primary);
    text-decoration: none;
  }
  
  .nav-link.active {
    color: var(--primary);
  }
  
  .nav-link.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: var(--primary);
  }
  
  .create-link {
    background-color: var(--primary);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
  }
  
  .create-link:hover {
    background-color: var(--primary-dark);
    color: white;
  }
  
  .create-link.active {
    background-color: var(--primary-dark);
    color: white;
  }
  
  .create-link.active::after {
    display: none;
  }
  
  .menu-toggle {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    width: 2rem;
    height: 2rem;
    position: relative;
  }
  
  .menu-icon,
  .menu-icon::before,
  .menu-icon::after {
    display: block;
    width: 1.5rem;
    height: 2px;
    background-color: var(--text);
    position: absolute;
    left: 0.25rem;
    transition: transform 0.3s, opacity 0.3s;
  }
  
  .menu-icon {
    top: 50%;
    transform: translateY(-50%);
  }
  
  .menu-icon::before {
    content: '';
    top: -8px;
  }
  
  .menu-icon::after {
    content: '';
    bottom: -8px;
  }
  
  @media (max-width: 768px) {
    .menu-toggle {
      display: block;
      z-index: 110;
    }
    
    .menu-toggle[aria-expanded="true"] .menu-icon {
      background-color: transparent;
    }
    
    .menu-toggle[aria-expanded="true"] .menu-icon::before {
      transform: rotate(45deg) translate(5px, 5px);
      background-color: var(--text);
    }
    
    .menu-toggle[aria-expanded="true"] .menu-icon::after {
      transform: rotate(-45deg) translate(5px, -5px);
      background-color: var(--text);
    }
    
    .nav-links {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 80%;
      max-width: 300px;
      background-color: white;
      flex-direction: column;
      align-items: flex-start;
      padding: 5rem 2rem 2rem;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
      z-index: 100;
    }
    
    .nav-links.active {
      transform: translateX(0);
    }
    
    .nav-link {
      width: 100%;
      padding: 0.75rem 0;
      border-bottom: 1px solid var(--border);
    }
    
    .create-link {
      margin-top: 1rem;
      width: 100%;
      text-align: center;
    }
  }
</style>