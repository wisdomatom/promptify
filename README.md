# Promptify

<p align="center">
  <img src="https://img.shields.io/badge/Status-In%20Development-yellow" alt="Status: In Development">
  <img src="https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-blue" alt="Platform: Windows | macOS | Linux">
  <img src="https://img.shields.io/badge/Made%20with-Tauri-blueviolet" alt="Made with Tauri">
</p>

> 一个轻量级、高效的跨平台桌面工具软件，启动即是一个简洁的输入框，通过 `@指令` 激活不同功能。

## 📖 项目概述

Promptify（也称为 `cmdbox`）是一个受 macOS 上的 Raycast 和 Alfred 启发的工具软件。它旨在为开发者、工程师和高级用户提供一套易于访问的工具集合，通过简单的命令行界面即可触发强大的功能。

## ✨ 功能特点

### 核心功能

1. **`@diff`** - 文本差异比较
   - 弹出两个输入框，粘贴两段文本
   - 显示文本差异（支持 side-by-side 或 inline 高亮）

2. **`@fix` 系列** - 结构化文本修复
   - 支持 `@fixjson`、`@fixyaml`、`@fixtoml` 等
   - 用户粘贴格式错误的结构化文本
   - 自动识别文本格式
   - 调用 AI 接口（如 OpenAI）修复格式错误
   - 显示修复前/修复后的对比结果

### 计划中的功能

- **`@uuid`** - 生成 UUID
- **`@regex`** - 正则表达式测试器
- **`@qr`** - 生成二维码
- **`@json2yaml`** - 结构转换器
- 更多通过插件/指令注册系统接入的功能

## 🔧 技术架构

### 整体架构

- **前端**：Svelte
- **后端**：Go 或 Python 逻辑模块（通过 Tauri 的 Rust command bridge 调用）
- **UI 渲染**：系统原生 WebView（WebView2/WKWebView/WebKitGTK）
- **跨平台框架**：Tauri（基于Rust，比Electron更轻量）

### 数据流架构

Promptify采用以下数据流架构：

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│             │      │             │      │             │
│  前端UI层   │◄────►│  Tauri桥接层 │◄────►│  后端逻辑层  │
│             │      │             │      │             │
└─────────────┘      └─────────────┘      └─────────────┘
       │                                         │
       │                                         │
       ▼                                         ▼
┌─────────────┐                          ┌─────────────┐
│             │                          │             │
│  本地存储   │                          │  外部服务   │
│             │                          │  (可选)     │
└─────────────┘                          └─────────────┘
```

1. **前端UI层**：负责用户界面渲染和交互
2. **Tauri桥接层**：处理前端和后端之间的通信
3. **后端逻辑层**：实现核心业务逻辑和功能
4. **本地存储**：保存用户配置、历史记录和缓存
5. **外部服务**：可选连接到AI服务、API等

### 技术优势

- 启动快，体积小（3–10MB）
- 支持原生功能如系统托盘、热键、剪贴板
- 安全性高（Rust 后端，默认封闭 API 权限）
- 跨平台一致性（Windows、macOS、Linux）
- 模块化设计，便于扩展和维护
- 本地优先架构，保护用户隐私
- 插件系统支持功能扩展

## 📋 用户体验目标

- 启动即输入框，专注输入
- 全键盘驱动，`@指令`触发功能
- 易拓展的工具集合，适合开发者/工程师/高级用户使用

## 🚀 安装指南

> 注意：项目目前处于开发阶段，尚未发布正式版本。

### 系统要求

- Windows 10/11
- macOS 10.15+
- Linux (主流发行版)

### 安装步骤

敬请期待...

## 💻 使用方法

1. 启动 Promptify
2. 使用快捷键呼出输入框（默认为 `Alt+Space`）
3. 输入 `@` 后跟随指令名称（如 `@diff`）
4. 按照界面提示完成操作

## 🛠️ 开发指南

### 环境设置

```bash
# 克隆仓库
git clone https://github.com/yourusername/promptify.git
cd promptify

# 安装依赖
npm install

# 启动开发服务器
npm run tauri dev
```

### 项目结构

```
promptify/
├── src/              # 前端源代码
├── src-tauri/        # Tauri 配置和 Rust 代码
├── backend/          # Go/Python 后端模块
└── ...
```

## 🤝 贡献指南

欢迎贡献！请随时提交 Pull Request 或创建 Issue。

## � 许可证

### 第一阶段：核心功能（Q3 2023）
- 实现基础框架和UI
- 开发前6个核心功能：@diff, @fix, @time, @calc, @encode/decode, @ip
- 建立基本的用户配置系统

### 第二阶段：扩展与优化（Q4 2023）
- 实现插件系统
- 添加高优先级功能：@regex, @format, @json2yaml
- 优化启动性能和资源使用
- 添加用户历史记录和偏好学习

### 第三阶段：AI增强与生态系统（Q1 2024）
- 深度集成AI功能
- 实现工作流自动化系统
- 开发插件市场
- 添加云同步选项（保持隐私优先）

### 长期目标
- 建立开发者社区
- 支持更多平台和集成
- 探索高级自动化和AI辅助功能

## 📋 用户体验目标

- **启动即输入框** - 专注输入，无干扰界面
- **全键盘驱动** - `@指令`触发功能，高效操作
- **智能上下文** - 记住用户偏好，提供智能建议
- **结果一键处理** - 复制、分享、导出或链式处理结果
- **可定制化** - 自定义快捷键、常用工具和工作流
- **历史记录** - 快速访问和重用之前的操作
- **开发者友好** - 易于扩展的插件系统，支持自定义工具
