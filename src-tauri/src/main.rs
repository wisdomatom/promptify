// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

// For macOS vibrancy
#[cfg(target_os = "macos")]
use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial};

// 用于序列化数据到前端的结构体
#[derive(serde::Serialize, Clone)]
struct AppInfo {
    name: String,
    path: String,
}

// 用于序列化数据到前端的结构体
#[derive(serde::Serialize, Clone)]
struct ClipboardItem {
    id: u32,
    content: String,
}

/// [Tauri 命令] 获取剪贴板历史记录 (占位符)
/// 注意：一个完整的剪贴板历史功能需要一个后台进程来持续监听系统剪贴板的变化。
/// 这里我们为了快速构建UI，暂时返回一些模拟数据。
#[tauri::command]
fn get_clipboard_history() -> Result<Vec<ClipboardItem>, String> {
    Ok(vec![
        ClipboardItem { id: 1, content: "这是最近的一条剪贴板记录。".into() },
        ClipboardItem { id: 2, content: "这是历史记录中的旧内容。".into() },
        ClipboardItem { id: 3, content: "https://tauri.app/".into() },
    ])
}

/// [Tauri 命令] 获取已安装的应用列表 (macOS 实现)
#[cfg(target_os = "macos")]
#[tauri::command]
fn get_installed_apps() -> Result<Vec<AppInfo>, String> {
    use std::collections::HashSet;
    use std::fs;

    let mut apps = Vec::new();
    let mut seen_apps = HashSet::new();

    // 定义一个闭包来处理目录
    let mut process_dir = |dir: &str| {
        if let Ok(entries) = fs::read_dir(dir) {
            for entry in entries.filter_map(Result::ok) {
                if let Ok(file_type) = entry.file_type() {
                    // 在 macOS 上，应用是以 .app 结尾的目录
                    if file_type.is_dir() {
                        let path = entry.path();
                        if path.extension().and_then(|s| s.to_str()) == Some("app") {
                            if let Some(name) = path.file_stem().and_then(|s| s.to_str()) {
                                // 去重
                                if seen_apps.insert(name.to_string()) {
                                    apps.push(AppInfo {
                                        name: name.to_string(),
                                        path: path.to_string_lossy().to_string(),
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    // 搜索主要的 Applications 目录
    process_dir("/Applications");
    // 搜索用户个人的 Applications 目录
    if let Some(home_dir) = dirs::home_dir() {
        if let Some(user_apps_path) = home_dir.join("Applications").to_str() {
            process_dir(user_apps_path);
        }
    }
    
    // 按字母顺序排序
    apps.sort_by(|a, b| a.name.to_lowercase().cmp(&b.name.to_lowercase()));

    Ok(apps)
}

/// [Tauri 命令] 获取已安装的应用列表 (Windows/Linux 占位符)
#[cfg(not(target_os = "macos"))]
#[tauri::command]
fn get_installed_apps() -> Result<Vec<AppInfo>, String> {
    // Windows 和 Linux 的实现更复杂，这里先用模拟数据作为占位符
    Ok(vec![
        AppInfo { name: "Notepad".into(), path: "notepad.exe".into() },
        AppInfo { name: "Calculator".into(), path: "calc.exe".into() },
        AppInfo { name: "VS Code".into(), path: "code.exe".into() },
    ])
}

fn main() {
  tauri::Builder::default()
    .setup(|app| {
        let window = app.get_webview_window("main").unwrap();

        #[cfg(target_os = "macos")]
        apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, None)
          .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

        // Note: For Windows, you would use a different function.
        // See https://github.com/tauri-apps/window-vibrancy for more details.

        Ok(())
    })
    // 在这里注册我们所有的后端命令
    .invoke_handler(tauri::generate_handler![
        get_clipboard_history,
        get_installed_apps
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
