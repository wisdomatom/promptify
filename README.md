# Promptify

> 一个轻量级、高效的跨平台桌面工具软件，启动即是一个简洁的输入框，通过 `@指令` 激活不同功能。

## 📖 项目概述

Promptify（也称为 `cmdbox`）是一个受 macOS 上的 Raycast 和 Alfred 启发的工具软件。它旨在为开发者、工程师和高级用户提供一套易于访问的工具集合，通过简单的命令行界面即可触发强大的功能。

## ✨ 功能特点

### 跨平台

- 支持多平台（Windows、macOS、Linux）

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

### 第一阶段：核心功能
- 实现基础框架和UI
- 开发前6个核心功能：@diff, @fix, @time, @calc, @encode/decode, @ip
- 建立基本的用户配置系统

### 第二阶段：扩展与优化
- 实现插件系统
- 添加高优先级功能：@regex, @format, @json2yaml
- 优化启动性能和资源使用
- 添加用户历史记录和偏好学习

### 第三阶段：AI增强与生态系统
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

---

## 🛠️ 开发设置 (Development Setup)

本项目的界面是基于 **React + TypeScript + Vite** 构建的。

### ESLint 配置

为了保证代码质量，我们推荐启用类型感知的 ESLint 规则。请参考以下配置更新 `eslint.config.js`：

```javascript
// eslint.config.js
import tseslint from 'typescript-eslint';
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config([
  // ... other configs
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // ... other configs
      ...tseslint.configs.recommendedTypeChecked,
      // ... or strictTypeChecked
      reactX.configs['recommended-typescript'],
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]);
```
