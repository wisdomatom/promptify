import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { v4 as uuidv4 } from 'uuid';

// 初始状态
const initialState = {
  prompts: [],
  loading: false,
  error: null
};

// 创建存储
const createPromptStore = () => {
  const { subscribe, set, update } = writable(initialState);
  
  return {
    subscribe,
    
    // 加载提示
    loadPrompts: async () => {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        // 从本地存储加载提示
        if (browser) {
          const storedPrompts = localStorage.getItem('prompts');
          const prompts = storedPrompts ? JSON.parse(storedPrompts) : [];
          
          update(state => ({ 
            ...state, 
            prompts,
            loading: false 
          }));
        }
      } catch (error) {
        console.error('Failed to load prompts:', error);
        update(state => ({ 
          ...state, 
          error: 'Failed to load prompts', 
          loading: false 
        }));
      }
    },
    
    // 获取单个提示
    getPromptById: (id) => {
      let result = null;
      
      update(state => {
        const prompt = state.prompts.find(p => p.id === id);
        result = prompt;
        return state;
      });
      
      return result;
    },
    
    // 创建提示
    createPrompt: async (promptData) => {
      let newPrompt = null;
      
      update(state => {
        const timestamp = new Date().toISOString();
        newPrompt = {
          ...promptData,
          id: uuidv4(),
          created_at: timestamp,
          updated_at: timestamp
        };
        
        const updatedPrompts = [...state.prompts, newPrompt];
        
        // 保存到本地存储
        if (browser) {
          localStorage.setItem('prompts', JSON.stringify(updatedPrompts));
        }
        
        return {
          ...state,
          prompts: updatedPrompts
        };
      });
      
      return newPrompt;
    },
    
    // 更新提示
    updatePrompt: async (id, promptData) => {
      let updatedPrompt = null;
      
      update(state => {
        const timestamp = new Date().toISOString();
        const index = state.prompts.findIndex(p => p.id === id);
        
        if (index === -1) {
          throw new Error('Prompt not found');
        }
        
        updatedPrompt = {
          ...state.prompts[index],
          ...promptData,
          id, // 确保ID不变
          updated_at: timestamp
        };
        
        const updatedPrompts = [...state.prompts];
        updatedPrompts[index] = updatedPrompt;
        
        // 保存到本地存储
        if (browser) {
          localStorage.setItem('prompts', JSON.stringify(updatedPrompts));
        }
        
        return {
          ...state,
          prompts: updatedPrompts
        };
      });
      
      return updatedPrompt;
    },
    
    // 删除提示
    deletePrompt: async (id) => {
      update(state => {
        const updatedPrompts = state.prompts.filter(p => p.id !== id);
        
        // 保存到本地存储
        if (browser) {
          localStorage.setItem('prompts', JSON.stringify(updatedPrompts));
        }
        
        return {
          ...state,
          prompts: updatedPrompts
        };
      });
    }
  };
};

// 创建存储实例
export const { 
  subscribe, 
  loadPrompts, 
  getPromptById, 
  createPrompt, 
  updatePrompt, 
  deletePrompt 
} = createPromptStore();

// 导出加载状态
export const loading = {
  subscribe: store => {
    return subscribe(state => store(state.loading));
  }
};

// 导出提示列表
export const prompts = {
  subscribe: store => {
    return subscribe(state => store(state.prompts));
  }
};