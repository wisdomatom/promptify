import { v4 as uuidv4 } from 'uuid';

// 本地存储键
const STORAGE_KEY = 'promptify_prompts';

/**
 * 从本地存储加载提示
 * @returns {Promise<Array>} 提示数组
 */
export async function loadPrompts() {
  return new Promise((resolve) => {
    try {
      const storedPrompts = localStorage.getItem(STORAGE_KEY);
      resolve(storedPrompts ? JSON.parse(storedPrompts) : []);
    } catch (error) {
      console.error('Error loading prompts from localStorage:', error);
      resolve([]);
    }
  });
}

/**
 * 保存提示到本地存储
 * @param {Object} prompt 提示对象
 * @returns {Promise<Object>} 保存后的提示对象
 */
export async function savePrompt(prompt) {
  return new Promise(async (resolve, reject) => {
    try {
      const prompts = await loadPrompts();
      const now = new Date().toISOString();
      
      // 如果是新提示
      if (!prompt.id) {
        const newPrompt = {
          ...prompt,
          id: uuidv4(),
          created_at: now,
          updated_at: now
        };
        
        prompts.push(newPrompt);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
        resolve(newPrompt);
      } 
      // 如果是更新提示
      else {
        const index = prompts.findIndex(p => p.id === prompt.id);
        
        if (index === -1) {
          reject(new Error('Prompt not found'));
          return;
        }
        
        const updatedPrompt = {
          ...prompt,
          updated_at: now
        };
        
        prompts[index] = updatedPrompt;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
        resolve(updatedPrompt);
      }
    } catch (error) {
      console.error('Error saving prompt to localStorage:', error);
      reject(error);
    }
  });
}

/**
 * 删除提示
 * @param {string} id 提示ID
 * @returns {Promise<boolean>} 是否删除成功
 */
export async function deletePrompt(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const prompts = await loadPrompts();
      const filteredPrompts = prompts.filter(p => p.id !== id);
      
      if (filteredPrompts.length === prompts.length) {
        reject(new Error('Prompt not found'));
        return;
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredPrompts));
      resolve(true);
    } catch (error) {
      console.error('Error deleting prompt from localStorage:', error);
      reject(error);
    }
  });
}

/**
 * 导出所有提示到JSON文件
 */
export async function exportPrompts() {
  try {
    const prompts = await loadPrompts();
    const dataStr = JSON.stringify(prompts, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `promptify_export_${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  } catch (error) {
    console.error('Error exporting prompts:', error);
    throw error;
  }
}

/**
 * 导出单个提示到文件
 * @param {Object} prompt 提示对象
 */
export async function exportPromptToFile(prompt) {
  try {
    const dataStr = prompt.content;
    const dataUri = `data:text/plain;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    // 使用提示标题作为文件名，移除非法字符
    const safeTitle = prompt.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const exportFileDefaultName = `${safeTitle}.txt`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  } catch (error) {
    console.error('Error exporting prompt to file:', error);
    throw error;
  }
}

/**
 * 导入提示
 */
export async function importPrompts() {
  return new Promise((resolve, reject) => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/json';
      
      input.onchange = async (e) => {
        const file = e.target.files[0];
        
        if (!file) {
          reject(new Error('No file selected'));
          return;
        }
        
        const reader = new FileReader();
        
        reader.onload = async (event) => {
          try {
            const importedPrompts = JSON.parse(event.target.result);
            
            if (!Array.isArray(importedPrompts)) {
              reject(new Error('Invalid import format'));
              return;
            }
            
            const currentPrompts = await loadPrompts();
            
            // 合并提示，避免重复
            const mergedPrompts = [...currentPrompts];
            
            for (const importedPrompt of importedPrompts) {
              // 检查是否已存在相同ID的提示
              const existingIndex = mergedPrompts.findIndex(p => p.id === importedPrompt.id);
              
              if (existingIndex === -1) {
                // 如果不存在，添加新提示
                mergedPrompts.push(importedPrompt);
              } else {
                // 如果存在，保留更新时间较新的版本
                const existing = mergedPrompts[existingIndex];
                if (new Date(importedPrompt.updated_at) > new Date(existing.updated_at)) {
                  mergedPrompts[existingIndex] = importedPrompt;
                }
              }
            }
            
            localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedPrompts));
            resolve(true);
          } catch (error) {
            console.error('Error parsing import file:', error);
            reject(new Error('Invalid JSON format'));
          }
        };
        
        reader.readAsText(file);
      };
      
      input.click();
    } catch (error) {
      console.error('Error importing prompts:', error);
      reject(error);
    }
  });
}