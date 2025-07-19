#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod prompt;

use prompt::{Prompt, PromptManager};
use std::sync::Mutex;
use tauri::State;

// 使用Mutex包装PromptManager以在命令之间共享状态
struct AppState {
    prompt_manager: Mutex<PromptManager>,
}

#[tauri::command]
fn load_prompts(state: State<AppState>) -> Result<Vec<Prompt>, String> {
    let prompt_manager = state.prompt_manager.lock().map_err(|e| e.to_string())?;
    prompt_manager.load_prompts().map_err(|e| e.to_string())
}

#[tauri::command]
fn save_prompt(prompt: Prompt, state: State<AppState>) -> Result<(), String> {
    let mut prompt_manager = state.prompt_manager.lock().map_err(|e| e.to_string())?;
    prompt_manager.save_prompt(prompt).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_prompt(id: String, state: State<AppState>) -> Result<(), String> {
    let mut prompt_manager = state.prompt_manager.lock().map_err(|e| e.to_string())?;
    prompt_manager.delete_prompt(&id).map_err(|e| e.to_string())
}

#[tauri::command]
fn export_prompts(file_path: String, state: State<AppState>) -> Result<(), String> {
    let prompt_manager = state.prompt_manager.lock().map_err(|e| e.to_string())?;
    prompt_manager.export_prompts(&file_path).map_err(|e| e.to_string())
}

#[tauri::command]
fn import_prompts(file_path: String, state: State<AppState>) -> Result<(), String> {
    let mut prompt_manager = state.prompt_manager.lock().map_err(|e| e.to_string())?;
    prompt_manager.import_prompts(&file_path).map_err(|e| e.to_string())
}

fn main() {
    tauri::Builder::default()
        .manage(AppState {
            prompt_manager: Mutex::new(PromptManager::new()),
        })
        .invoke_handler(tauri::generate_handler![
            load_prompts,
            save_prompt,
            delete_prompt,
            export_prompts,
            import_prompts
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}