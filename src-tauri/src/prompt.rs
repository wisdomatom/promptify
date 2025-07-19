use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs::{self, File};
use std::io::{Read, Write};
use std::path::PathBuf;
use tauri::api::path::app_data_dir;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Prompt {
    pub id: String,
    pub title: String,
    pub description: String,
    pub content: String,
    pub tags: Vec<String>,
    pub created_at: String,
    pub updated_at: String,
}

pub struct PromptManager {
    data_dir: PathBuf,
    prompts_file: PathBuf,
}

impl PromptManager {
    pub fn new() -> Self {
        let app_config = tauri::Config::default();
        let data_dir = app_data_dir(&app_config).expect("Failed to get app data directory");
        let prompts_dir = data_dir.join("promptify");
        
        // 确保目录存在
        fs::create_dir_all(&prompts_dir).expect("Failed to create data directory");
        
        let prompts_file = prompts_dir.join("prompts.json");
        
        PromptManager {
            data_dir: prompts_dir,
            prompts_file,
        }
    }
    
    pub fn load_prompts(&self) -> Result<Vec<Prompt>, String> {
        // 如果文件不存在，返回空列表
        if !self.prompts_file.exists() {
            return Ok(Vec::new());
        }
        
        let mut file = File::open(&self.prompts_file)
            .map_err(|e| format!("Failed to open prompts file: {}", e))?;
        
        let mut contents = String::new();
        file.read_to_string(&mut contents)
            .map_err(|e| format!("Failed to read prompts file: {}", e))?;
        
        if contents.is_empty() {
            return Ok(Vec::new());
        }
        
        let prompts: HashMap<String, Prompt> = serde_json::from_str(&contents)
            .map_err(|e| format!("Failed to parse prompts data: {}", e))?;
        
        // 将HashMap转换为Vec
        let mut prompt_vec: Vec<Prompt> = prompts.values().cloned().collect();
        
        // 按创建时间排序（最新的在前）
        prompt_vec.sort_by(|a, b| b.created_at.cmp(&a.created_at));
        
        Ok(prompt_vec)
    }
    
    fn save_prompts(&self, prompts: &HashMap<String, Prompt>) -> Result<(), String> {
        let json = serde_json::to_string_pretty(prompts)
            .map_err(|e| format!("Failed to serialize prompts: {}", e))?;
        
        let mut file = File::create(&self.prompts_file)
            .map_err(|e| format!("Failed to create prompts file: {}", e))?;
        
        file.write_all(json.as_bytes())
            .map_err(|e| format!("Failed to write prompts file: {}", e))?;
        
        Ok(())
    }
    
    pub fn save_prompt(&mut self, mut prompt: Prompt) -> Result<(), String> {
        let mut prompts = self.load_prompts_map()?;
        
        let now = Utc::now().to_rfc3339();
        
        // 如果是新提示，生成ID和创建时间
        if prompt.id.is_empty() {
            prompt.id = Uuid::new_v4().to_string();
            prompt.created_at = now.clone();
        }
        
        // 更新修改时间
        prompt.updated_at = now;
        
        // 保存提示
        prompts.insert(prompt.id.clone(), prompt);
        self.save_prompts(&prompts)
    }
    
    pub fn delete_prompt(&mut self, id: &str) -> Result<(), String> {
        let mut prompts = self.load_prompts_map()?;
        
        if prompts.remove(id).is_none() {
            return Err(format!("Prompt with ID {} not found", id));
        }
        
        self.save_prompts(&prompts)
    }
    
    pub fn export_prompts(&self, file_path: &str) -> Result<(), String> {
        let prompts = self.load_prompts()?;
        
        let json = serde_json::to_string_pretty(&prompts)
            .map_err(|e| format!("Failed to serialize prompts: {}", e))?;
        
        let mut file = File::create(file_path)
            .map_err(|e| format!("Failed to create export file: {}", e))?;
        
        file.write_all(json.as_bytes())
            .map_err(|e| format!("Failed to write export file: {}", e))?;
        
        Ok(())
    }
    
    pub fn import_prompts(&mut self, file_path: &str) -> Result<(), String> {
        let mut file = File::open(file_path)
            .map_err(|e| format!("Failed to open import file: {}", e))?;
        
        let mut contents = String::new();
        file.read_to_string(&mut contents)
            .map_err(|e| format!("Failed to read import file: {}", e))?;
        
        let imported_prompts: Vec<Prompt> = serde_json::from_str(&contents)
            .map_err(|e| format!("Failed to parse import data: {}", e))?;
        
        let mut current_prompts = self.load_prompts_map()?;
        
        // 合并导入的提示
        for prompt in imported_prompts {
            current_prompts.insert(prompt.id.clone(), prompt);
        }
        
        self.save_prompts(&current_prompts)
    }
    
    // 辅助方法：将提示列表转换为HashMap
    fn load_prompts_map(&self) -> Result<HashMap<String, Prompt>, String> {
        let prompts = self.load_prompts()?;
        let mut map = HashMap::new();
        
        for prompt in prompts {
            map.insert(prompt.id.clone(), prompt);
        }
        
        Ok(map)
    }
}