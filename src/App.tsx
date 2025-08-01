import React, { useState, useEffect } from 'react';
import { DiffPage } from './features/diff';
import { useTranslation } from 'react-i18next';
import TopBar from './components/TopBar';
import MainContent from './components/MainContent';
import BottomBar from './components/BottomBar';
import { lightTheme, darkTheme } from './theme';
import { getCurrentWindow as appWindow } from '@tauri-apps/api/window';

export type PageType = 'home' | 'diff';

function App() {
  const [page, setPage] = useState<PageType>('home');
  const [input, setInput] = useState('');
  const [minimal, setMinimal] = useState(false);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const { t, i18n } = useTranslation();
  const theme = themeMode === 'light' ? lightTheme : darkTheme;

  // 切换极简模式时只切换窗口边框，内容和主页面完全一致
  useEffect(() => {
    if (minimal) {
      appWindow().setDecorations(false);
    } else {
      appWindow().setDecorations(false);
    }
  }, [minimal]);

  const handleInputEnter = (v: string) => {
    if (v.trim().toLowerCase() === '@diff') {
      setPage('diff');
      setInput('');
    }
    // 未来可扩展更多指令
  };

  const isHomePage = page === 'home';
  let mainContent = null;
  if (page === 'diff') {
    mainContent = <DiffPage onBack={() => setPage('home')} />;
  } else {
    mainContent = <div style={{ color: theme.text, fontSize: 20, opacity: 0.5 }}>欢迎使用 Promptify！</div>;
  }

  return (
    <div
      style={{
        height: "100vh", // 使用 height 确保容器占满整个视窗
        width: "100%",
        background: "none",
        display: "flex",
        flexDirection: "column",
        borderRadius: 12,
        overflow: 'hidden', // 保留以裁剪圆角
      }}
    >
      {/* 区域1：顶部输入框区域 */}
      <div
        style={{
          flexShrink: 0, // 防止此区域在内容过多时被压缩
          zIndex: 10,
          backdropFilter: "blur(10px)",
          background: 'none',
        }}
      >
        <TopBar
          value={input}
          onChange={setInput}
          onEnter={handleInputEnter}
          theme={theme}
        />
      </div>
      {/* 区域2：功能展示区 */}
      <div
        style={{
          flex: 1, // 关键：让此区域占据所有剩余空间
          minWidth: 0, // 防止子元素过宽导致 flex 布局破坏
          overflowY: "auto", // 只在垂直方向上需要时显示滚动条
          overflowX: "auto", // 隐藏水平滚动条
          backdropFilter: "blur(10px)",
          background: "none",
        }}
      >
        <MainContent theme={theme} center={isHomePage}>{mainContent}</MainContent>
      </div>
      {/* 区域3：底部菜单栏 */}
      <div
        style={{
          flexShrink: 0, // 防止此区域在内容过多时被压缩
          zIndex: 10,
          backdropFilter: "blur(10px)",
          background: theme.bg,
        }}
      >
        <BottomBar theme={theme}>
          <div style={{ display: "flex", gap: 16 }}>
            {/* 语言切换 */}
            <button
              onClick={() =>
                i18n.changeLanguage(i18n.language === "zh" ? "en" : "zh")
              }
              style={{
                background: theme.btn,
                color: theme.text,
                border: "none",
                borderRadius: 6,
                padding: "6px 16px",
                cursor: "pointer",
                fontSize: 15,
                transition: "background 0.18s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = theme.btnHover)
              }
              onMouseOut={(e) => (e.currentTarget.style.background = theme.btn)}
            >
              {i18n.language === "zh" ? "EN" : "中文"}
            </button>
            {/* 主题切换 */}
            <button
              onClick={() =>
                setThemeMode(themeMode === "light" ? "dark" : "light")
              }
              style={{
                background: theme.btn,
                color: theme.text,
                border: "none",
                borderRadius: 6,
                padding: "6px 16px",
                cursor: "pointer",
                fontSize: 15,
                transition: "background 0.18s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = theme.btnHover)
              }
              onMouseOut={(e) => (e.currentTarget.style.background = theme.btn)}
            >
              {themeMode === "light" ? "🌙 暗色" : "☀️ 亮色"}
            </button>
            {/* 极简模式 */}
            <button
              onClick={() => setMinimal((m) => !m)}
              style={{
                background: theme.btn,
                color: theme.text,
                border: "none",
                borderRadius: 6,
                padding: "6px 16px",
                cursor: "pointer",
                fontSize: 15,
                transition: "background 0.18s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = theme.btnHover)
              }
              onMouseOut={(e) => (e.currentTarget.style.background = theme.btn)}
            >
              {minimal
                ? i18n.language === "zh"
                  ? "退出极简"
                  : "Normal"
                : i18n.language === "zh"
                ? "极简模式"
                : "Minimal"}
            </button>
          </div>
          {/* 右侧可放设置等按钮 */}
          <div style={{ display: "flex", gap: 16 }}>
            <button
              style={{
                background: theme.btn,
                color: theme.text,
                border: "none",
                borderRadius: 6,
                padding: "6px 16px",
                cursor: "pointer",
                fontSize: 15,
                transition: "background 0.18s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = theme.btnHover)
              }
              onMouseOut={(e) => (e.currentTarget.style.background = theme.btn)}
            >
              {i18n.language === "zh" ? "设置" : "Settings"}
            </button>
          </div>
        </BottomBar>
      </div>
    </div>
  );
}

export default App;
